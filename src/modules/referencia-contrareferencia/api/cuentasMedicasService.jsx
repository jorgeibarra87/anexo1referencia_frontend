import apiClientReferenciaContrareferencia from "./apiClienteReferenciaContrareferencia";

export const obtenerCuentasMedicas = async () => {
    try {
        const response = await apiClientReferenciaContrareferencia.get('/cuentas-medicas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener cuentas médicas', error);
        throw error;
    }
}

export const cambiarEstadoCuentaMedica = async (id, nuevoEstado) => {
    try {
        const response = await apiClientReferenciaContrareferencia.patch(
            `/cuentas-medicas/${id}/estado?estado=${nuevoEstado}`
        );
        return response.data;
    }
    catch (error) {
        console.error('Error al cambiar el estado de la cuenta médica', error);
        throw error;
    }
}

export const guardarCuentaMedica = async (cuentaMedicaData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.post('/cuentas-medicas', cuentaMedicaData);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la cuenta médica', error);
        throw error;
    }
}

export const actualizarCuentaMedica = async (id, cuentaMedicaData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/cuentas-medicas/${id}`, cuentaMedicaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la cuenta médica', error);
        throw error;
    }
}