import apiClientReferenciaContrareferencia from "./apiClienteReferenciaContrareferencia";

export const obtenerTrasladosCompletos = async () => {
    try {
        const response = await apiClientReferenciaContrareferencia.get('/traslados-completos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los traslados completos', error);
        throw error;
    }
}

export const obtenerTraslados = async () => {
    try {
        const response = await apiClientReferenciaContrareferencia.get('/traslados');
        return response.data;

    } catch (error) {
        console.error('Error al obtener los traslados', error);
        throw error;
    }
}

export const obtenerTrasladoPorId = async (id) => {
    try {
        const response = await apiClientReferenciaContrareferencia.get(`/traslados/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el traslado', error);
        throw error;
    }
}

export const cambiarEstadoTraslado = async (id, nuevoEstado) => {
    try {
        const response = await apiClientReferenciaContrareferencia.patch(
            `/traslados/${id}/estado?estado=${nuevoEstado}`
        );
        return response.data;
    } catch (error) {
        console.error('Error al cambiar el estado del traslado', error);
        throw error;
    }
};

export const guardarTraslado = async (trasladoData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.post('/traslados', trasladoData);
        return response.data;
    } catch (error) {
        console.error('Error al guardar el traslado', error);
        throw error;
    }
}

export const actualizarTraslado = async (id, trasladoData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/traslados/${id}`, trasladoData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el traslado', error);
        throw error;
    }
}

export const obtenerReporteTraslados = async (fechaInicio, fechaFin) => {
    const response = await apiClientReferenciaContrareferencia.get('/reporte/traslados', {
        params: {
            fechaInicio,
            fechaFin
        }
    });
    return response.data;
};
