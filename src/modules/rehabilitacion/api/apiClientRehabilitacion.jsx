import axios from "axios";
import { createApiClient } from "../../../api/apiClientFactory";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutaMicroservicioRehabilitacion = window.env.VITE_URL_REHABILITACION;

const apiClientRehabilitacion = createApiClient(`${ruta}${rutaMicroservicioRehabilitacion}`);

export default apiClientRehabilitacion;