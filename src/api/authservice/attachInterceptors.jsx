import {getAccessToken,setAccessToken,getRefreshToken,setRefreshToken,clearTokens,} from "../tokenStorage";
  import apiClientAuthServicePublic from "./apiClientAuthServicePublic";
  
  let onLogout = () => {
    clearTokens();
    window.location.hash = "#/login"; // usa hash sin recargar toda la SPA
  };
  
  let onTokensUpdated = (_access, _refresh) => {
    // noop: no hace nada si no configuras nada
  };
  
  export const configureAuthCallbacks = ({ logout, tokensUpdated } = {}) => {
    if (logout) onLogout = logout;
    if (tokensUpdated) onTokensUpdated = tokensUpdated;
  };
  
  let isRefreshing = false;
  let refreshQueue = [];
  
  const processQueue = (error, newToken = null) => {
    refreshQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(newToken);
    });
    refreshQueue = [];
  };
  
  export default function attachInterceptors(
    instance,
    { refreshPath = "auth/refresh" } = {}
  ) {
    // 1) Interceptor de request
    instance.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  
    // 2) Interceptor de response
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        const status = error?.response?.status;
  
        if (!status || ![401, 403].includes(status) || original._retry) {
          return Promise.reject(error);
        }
  
        // Si ya se está refrescando → encola
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({
              resolve: (newToken) => {
                original._retry = true;
                original.headers.Authorization = `Bearer ${newToken}`;
                resolve(instance(original));
              },
              reject,
            });
          });
        }
  
        // Marcar reintento
        original._retry = true;
        isRefreshing = true;
  
        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            onLogout();
            return Promise.reject(error);
          }
  
          // Llamada de refresh
          const { data } = await apiClientAuthServicePublic.post(
            refreshPath,
            { refreshToken }
          );
  
          // Backend retorna { jwt, refreshToken }
          const newAccess = data?.jwt;
          const newRefresh = data?.refreshToken || refreshToken;
  
          if (!newAccess) throw new Error("No se recibió nuevo JWT en refresh");
  
          setAccessToken(newAccess);
          if (newRefresh) setRefreshToken(newRefresh);
  
          onTokensUpdated(newAccess, newRefresh);
  
          processQueue(null, newAccess);
  
          // Reintentar original
          original.headers.Authorization = `Bearer ${newAccess}`;
          return instance(original);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          onLogout();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    );
  
    return instance;
  }
  