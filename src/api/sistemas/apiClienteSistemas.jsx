import { createApiClient } from "../apiClientFactory";

 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioSistemas = window.env.VITE_URL_SISTEMAS

const apiClienteSistemas = createApiClient(`${ruta}${rutamicroservicioSistemas}/`)

export default apiClienteSistemas;