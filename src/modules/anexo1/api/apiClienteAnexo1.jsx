import axios from "axios";
import attachInterceptors, { configureAuthCallbacks } from "../../../api/authservice/attachInterceptors";
import { clearTokens } from "../../../api/tokenStorage";

const ruta = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086/";

const apiClienteAnexo1 = axios.create({
  baseURL: ruta,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

configureAuthCallbacks({
  logout: () => {
    clearTokens();
    window.location.hash = "#/login";
  },
});

attachInterceptors(apiClienteAnexo1);

export default apiClienteAnexo1;
