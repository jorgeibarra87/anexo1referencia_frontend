import { MESAPROCESOS_ACTUALIZAR_PROCESO_DE_AREA, MESAPROCESOS_ACTUALIZAR_SUBPROCESOS_DE_PROCESO, MESAPROCESOS_ACTUALIZAR_USUARIO_DE_AREA, MESAPROCESOS_AGREGAR_PROCESO_A_AREA, MESAPROCESOS_AGREGAR_SUBPROCESO_A_PROCESO, MESAPROCESOS_AGREGAR_USUARIO_A_AREA, MESAPROCESOS_ELIMINAR_USUARIO_DE_AREA, MESAPROCESOS_USUARIOS_POR_AREA_OBTENER } from "../types";

export const mesadeprocesos_usuariosporarea_obtener = (data) => ({type: MESAPROCESOS_USUARIOS_POR_AREA_OBTENER, payload: data});
export const mesadeprocesos_agregar_usuario_a_area = (data) =>({type: MESAPROCESOS_AGREGAR_USUARIO_A_AREA, payload: data});
export const mesadeprocesos_eliminar_usuario_de_area = (data) => ({type: MESAPROCESOS_ELIMINAR_USUARIO_DE_AREA, payload: data});
export const mesadeprocesos_actualizar_usuario_de_area = (data) => ({type: MESAPROCESOS_ACTUALIZAR_USUARIO_DE_AREA, payload: data});
export const mesadeprocesos_agregar_proceso_a_area = (data) => ({type: MESAPROCESOS_AGREGAR_PROCESO_A_AREA, payload: data});
export const mesadeprocesos_actualizar_proceso_de_area = (data) => ({type: MESAPROCESOS_ACTUALIZAR_PROCESO_DE_AREA, payload: data});
export const mesadeprocesos_agregar_subproceso_a_proceso = (data) => ({type : MESAPROCESOS_AGREGAR_SUBPROCESO_A_PROCESO, payload: data});
export const mesadeprocesos_actualizar_subproceso_de_proceso = (data) => ({type: MESAPROCESOS_ACTUALIZAR_SUBPROCESOS_DE_PROCESO, payload: data});