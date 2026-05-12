import apiClientReferenciaContrareferencia from "./apiClienteReferenciaContrareferencia";

export const obtenerHospitalesReferencia = async () => {
    try {
        const response = await apiClientReferenciaContrareferencia.get('/hospitales');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los hospitales de referencia', error);
        throw error;
    }
}

export const agregarHospitalReferencia = async (data) => {
    try {
        const response = await apiClientReferenciaContrareferencia.post('/hospitales', data);
        return response.data;
    } catch (error) {
        console.error('Error al agregar el hospital de referencia', error);
        throw error;
    }
}
