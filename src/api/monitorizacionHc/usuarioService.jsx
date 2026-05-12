import UsuarioProcesoServicio from "../../models/monitorizacionHc/UsuarioProcesoServicio";
import apiClienteMonitorizacionHc from "./apiClienteMonitorizacionHc";

export const obtenerUsuariosQueTienenProcesosYServicios = async () =>{
    try {
        const response = await apiClienteMonitorizacionHc.get(`/usuario/conAsignacionProcesoAndServicio`);
        const usuarios = response.data.map(usuario => new UsuarioProcesoServicio(usuario));
        return usuarios;
    } catch (error) {
        console.error('Error al obtener los usuarios que tienen procesos y servicios de monitorizacion microservice',error);
        throw error;
    }
}

export const obtenerUsuarioConProcesosYServiciosPorDocumento = async (documento) => {
    try {
        const response = await apiClienteMonitorizacionHc.get(`/usuario/relacionProcesosServicios/${documento}`);
        return new UsuarioProcesoServicio(response.data);
    } catch (error) {
        console.error(`Error al obtener al usuario con susprocesos y servicios con documento ${documento}`,error);
        throw error;
    }
};

export const guardarUsuarioMHC = async (data) => {
    try {
        const response = await apiClienteMonitorizacionHc.post(`/usuario`, data);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la relacion de usuario con procesos y servicios', error);
        throw error;
    }
}