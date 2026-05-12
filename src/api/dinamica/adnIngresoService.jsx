import AdnIngreso from '../../models/dinamica/AdnIngreso';
import apiClienteDinamica from './apiClienteDinamica';

export const obtenerAdnIngreso = async (idAdnIngreso) => {
    try {
        const response = await apiClienteDinamica.get(`adnIngreso/GenPacien/${idAdnIngreso}`);
        return new AdnIngreso(response.data);
    }catch (error) {
        console.error('Error al obtener el adnIngreso',error);
        throw error;
    }
}

export const obtenerAdnIngresoHistoricoPorDocumento = async (documento) => {
    try {
        const response = await apiClienteDinamica.get(`adnIngreso/GenPacien/todos/${documento}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el historial de adnIngreso', error);
        throw error;
    }
}