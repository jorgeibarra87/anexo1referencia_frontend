import { createApiClient } from "../apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const micro = window.env.VITE_URL_LABORATORIO;

const apiClienteLaboratorio = createApiClient(`${ruta}${micro}/`);

export default apiClienteLaboratorio;