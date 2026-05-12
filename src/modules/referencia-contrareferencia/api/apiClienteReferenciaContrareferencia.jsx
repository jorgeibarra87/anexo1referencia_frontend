import { createApiClient } from "../../../api/apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const micro = window.env.VITE_URL_REFERENCIA_CONTRAREFERENCIA;

const apiClientReferenciaContrareferencia = createApiClient(`${ruta}${micro}/`);

export default apiClientReferenciaContrareferencia;