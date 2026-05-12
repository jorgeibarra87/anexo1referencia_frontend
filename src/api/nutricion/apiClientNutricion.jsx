import { createApiClient } from "../apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicionutricion = window.env.VITE_URL_NUTRICION;

const apiClientNutricion = createApiClient(`${ruta}${rutamicroservicionutricion}/`);

export default apiClientNutricion;