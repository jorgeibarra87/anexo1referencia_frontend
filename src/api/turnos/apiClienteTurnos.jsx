import { createApiClient } from "../apiClientFactory"

const ruta = window.env.VITE_URL_API_GATEWAY
const rutamicroservicioTurnos = window.env.VITE_URL_TURNOS

const apiClienteTurnos = createApiClient(`${ruta}${rutamicroservicioTurnos}/`)

export default apiClienteTurnos;