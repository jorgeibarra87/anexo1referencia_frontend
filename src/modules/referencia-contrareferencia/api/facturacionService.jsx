import apiClientReferenciaContrareferencia from "./apiClienteReferenciaContrareferencia";

export const obtenerFacturas = async () => {
    try {
        const response = await apiClientReferenciaContrareferencia.get('/facturaciones');
        return response.data;
    } catch (error) {
        console.error('Error al obtener facturas', error);
        throw error;
    }
}

export const cambiarEstadoFactura = async (id, nuevoEstado) => {
    try {
        const response = await apiClientReferenciaContrareferencia.patch(
            `/facturaciones/${id}/estado?estado=${nuevoEstado}`
        );
        return response.data;
    } catch (error) {
        console.error('Error al cambiar el estado de la factura', error);
        throw error;
    }
}

export const guardarFactura = async (facturacionData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.post('/facturaciones', facturacionData);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la factura', error);
        throw error;
    }
}

export const actualizarFactura = async (id, facturacionData) => {
    try {
        const response = await apiClientReferenciaContrareferencia.put(`/facturaciones/${id}`, facturacionData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la factura', error);
        throw error;
    }
}