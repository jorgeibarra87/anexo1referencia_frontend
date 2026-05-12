import apiClientReferenciaContrareferencia from "./apiClienteReferenciaContrareferencia";

export const guardarDatosReferencia = async (datos) => {
    try {
        const response = await apiClientReferenciaContrareferencia.post('/datos', datos);
        return response.data;
    } catch (error) {
        console.error('Error al guardar los datos de la referencia', error);
        throw error;
    }
}

export const actualizarDatosReferenciaIngresos = async (datos) => {
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/datos/actualizar-ingresos`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar los datos de la referencia', error);
        throw error;
    }
}

export const actualizarDatosReferenciaFechaActualizacionBusquedaIngresos = async (ids) =>{
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/datos/verificar-registros`, ids);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la fechaActualizacionBusquedaIngresos', error);
        throw error;
    }
}

export const guardarObservacionTriage = async (id, observacion) => {
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/datos/observacion-triage/${id}?observacion=${observacion}` );
        return response.data;
    } catch (error) {
        console.error('Error al guardar la observación de triage', error);
        throw error;
    }
}

export const obtenerDatosPorPaginas = async (page = 0, size = 100) => {
    try {
        const response = await apiClientReferenciaContrareferencia(`datos?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los datos ', error);
        throw error;
    }
}

export const obtenerDatosEntreFechasRefContraReferencia = async (fechaInicio, fechaFin) => {
    try {
        const response = await apiClientReferenciaContrareferencia(`datos/filtro-fecha`, {
            params: {
                fechaInicio,
                fechaFin
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los datos entre fechas', error);
        throw error;
    }
}

export const buscarDatosPorIdODocumento = async (valor) => {
    try {
        const response = await apiClientReferenciaContrareferencia(`datos/buscar`, {
            params: {
                valor
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al buscar los datos por id o documento', error);
        throw error;
    }
}