import { CERRAR_SESION, INICIAR_SESION, OBTENER_TOKEN } from "../types";
export const iniciarSesionAction = (data) => ({type: INICIAR_SESION, payload: data});
export const obtenerToken = () => ({type: OBTENER_TOKEN});
export const cerrarSesionAction = () => ({type: CERRAR_SESION});