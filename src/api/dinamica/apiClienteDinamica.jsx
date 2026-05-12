import { createApiClient } from "../apiClientFactory";

 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioDinamica = window.env.VITE_URL_DINAMICA

const apiClienteDinamica = createApiClient(`${ruta}${rutamicroservicioDinamica}/`)

export default apiClienteDinamica;