import Pregunta from "../../models/monitorizacionHc/Pregunta";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const obtenerPreguntasServicio = async (id, tipoGrupo, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/preguntas/${tipoGrupo}/${id}/${tipoPregunta}`);
        const preguntas = response.data;
        return preguntas;
    } catch (error) {
        console.error('Error al obtener las preguntas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerProcesosServiciosQueTienenPreguntas = async () => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/preguntas/servicios-procesos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los procesos y servicios que tienen preguntas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerTipoPreguntas = async () => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/preguntas/tipos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de preguntas de monitorizacion microservice',error);
        throw error;
    }
}