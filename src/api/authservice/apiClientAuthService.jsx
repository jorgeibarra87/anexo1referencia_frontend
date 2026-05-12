import { createApiClient } from "../apiClientFactory";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioauth = window.env.VITE_URL_AUTH

const apiClientAuthService = createApiClient(`${ruta}${rutamicroservicioauth}/`);

export default apiClientAuthService;