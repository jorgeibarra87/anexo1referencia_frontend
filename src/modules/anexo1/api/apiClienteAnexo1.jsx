import axios from "axios";

const ruta = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086/";

const apiClienteAnexo1 = axios.create({
  baseURL: ruta,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClienteAnexo1.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenhusjp");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClienteAnexo1;
