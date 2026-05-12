import apiClienteSistemas from "./apiClienteSistemas";

export const obtenerPreguntasCheqMan = async () => {
    try {
        const response = await apiClienteSistemas.get(`/preguntas-mantenimiento`);       
        return response.data;
    } catch (error) {
        console.error('Error al obtener las preguntas de chequeo de mantenimiento', error);
        throw error;
    }
}

export const guardarRespuestasCheqMan = async (respuestas) => {
    try {
        const response = await apiClienteSistemas.post(`/registro-respuestas-mantenimiento`, respuestas);
        return response.data;
    } catch (error) {
        console.error('Error al guardar las respuestas de chequeo de mantenimiento', error);
        throw error;
    }
}