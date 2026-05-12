import apiClienteDinamica from "./apiClienteDinamica"

// Función genérica para obtener el resumen de pacientes según tipo de prioridad
export const obtenerPacientesConExamenes = async (tipo, page = 0, size = 100) => {
    try {
        const response = await apiClienteDinamica.get(`/hcnSolExa/resumen-pacientes`, {
            params: { tipo, page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener exámenes ${tipo}:`, error);
        throw error;
    }
};

// Función genérica para obtener el detalle de exámenes de un paciente según tipo
export const obtenerDetalleExamenesPorPaciente = async (documento, tipo) => {
    try {
        const response = await apiClienteDinamica.get(`/hcnSolExa/paciente/${documento}`, {
            params: { tipo }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalles de exámenes ${tipo} por paciente:`, error);
        throw error;
    }
};
