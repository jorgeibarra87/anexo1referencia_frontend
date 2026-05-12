import apiClienteDinamica from "./apiClienteDinamica";

export const obtenerEstadoDeCamas = async (codigosCamas) => {
    try {
        const response = await apiClienteDinamica.post(`hpndefcam/obetenerEstadoCamaPorCodigos`, codigosCamas);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el estado de las camas:', error);
        throw error;
    }
};