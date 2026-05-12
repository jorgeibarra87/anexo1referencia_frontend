/** 
 * Crea un cliente Axios ya configurado con interceptores y callbacks de auht
 * @param {string} baseUrl - la url bade del microservicio
 * @param {object} options - opciones adicionales (ej. refreshPath)
 */

import axios from "axios";
import attachInterceptors, { configureAuthCallbacks } from "./authservice/attachInterceptors";
import { clearTokens } from "./tokenStorage";

export function createApiClient(baseURL, options = {}) {
    const instance = axios.create({ baseURL });
  
    // Configura callbacks de logout/token update (solo una vez)
    configureAuthCallbacks({
      logout: () => {
        clearTokens();
        window.location.hash = "#/login";
      },
      // tokensUpdated: (access, refresh) => { ... } // opcional
    });
  
    // Adjunta interceptores para este cliente
    attachInterceptors(instance, {
      refreshPath: options.refreshPath || "auth/refresh",
    });
  
    return instance;
  }