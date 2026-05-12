import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const guardarRelacionUsuarioProcesoServicio = async (items, documento) => {
    try {
        const response = await apiClienteMonitorizacionHc.post(`/usuario-proceso-servicio/${documento}`, items);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la relacion usuario proceso servicio de monitorizacion microservice', error);
        throw error;
    }
}

export const actualizarRelacionUsuarioProcesoServicio = async (documento, items ) => {
    try {
        const response = await apiClienteMonitorizacionHc.put(`/usuario-proceso-servicio/${documento}`, items);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la relacion usuario proceso servicio de monitorizacion microservice', error);
        throw error;
    }
}