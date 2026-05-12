import apiClienteDinamica from "./apiClienteDinamica";

export const obtenerCitasRehabilitacionPorMedico = async (verTodo = false) => {
    try {
        const response = await apiClienteDinamica.get(`appointments/rehabilitation/today`, {
            params: { verTodo: verTodo }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las citas de rehabilitación por médico', error);
        throw error;
    }
}