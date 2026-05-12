import Ingreso from "../../models/monitorizacionHc/Ingreso";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const guardarRespuestas = async (respuestas, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.post(`/respuestas/${tipoPregunta}`, respuestas);
        return response.data;
    }catch(error){
        console.error('Error al guardar las respuestas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerRespuestasByIngresoIdServicioProcesoTipoPregunta = async (params) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`respuestas/resumen/individual`, { params });
        return response.data;
    }catch(error){
        console.error('Error al obtener las respuestas de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerInfoRespuestasPorFechaYTipoPregunta = async (fechaInicio, fechaFin, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/resumen-mensual', {
            params: {
                fechaInicio,
                fechaFin,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las respuestas por fecha y tipo de pregunta', error);
        throw error;
    }
}

export const obtenerInfoPorRangoFechaPorProcesoServicioYTipoPregunta = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/porcentaje-por-grupo', {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el porcentaje por grupo', error);
        throw error;
    }   
}

export const obtenerInfoCantidadesPorGrupoPorMes = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response =  await apiClienteMonitorizacionHc.get(`/respuestas/resumen-mensual-grupo`, {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        }) 
        return response.data;     
    } catch (error) {
        console.error('Error al obtener las cantidades por grupo por mes', error);
        throw error;
    }
}

export const obtenerInfocanteidadesPorPreguntas = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
    try {
        const response = await apiClienteMonitorizacionHc.get('/respuestas/resumen-cantidad-si-no-noaplica-conpregunta', {
            params: {
                fechaInicio,
                fechaFin,
                procesoId,
                servicioId,
                tipoPregunta
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las cantidades por preguntas', error);
        throw error;
    }
}

export const obtenerRespuestas = async (body) => {
    try {
        const response = await apiClienteMonitorizacionHc.post('respuestas/buscar', body);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las respuestas', error);
        throw error;
    }
}