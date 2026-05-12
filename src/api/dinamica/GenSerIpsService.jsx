import apiClienteDinamica from "./apiClienteDinamica"

export const cambiarEstadoIpsPorSipCodigo = async (sipCodigo) => {
    try {
        const response = await apiClienteDinamica.put(`genSerRips//cambiarEstado/${sipCodigo}`);
        return response.data;
    } catch (error) {
        console.error("Error changing IPS state:", error);
        throw error;
    }
}