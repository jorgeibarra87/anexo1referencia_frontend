// src/services/adnIngresoService.js

import apiClienteDinamica from "./apiClienteDinamica";

/**
 * Llama al endpoint POST para obtener información de ingresos y pacientes
 * para una lista de números de documento.
 * @param {string[]} documentos Lista de números de documento (PACNUMDOC).
 * @returns {Promise<GenPacienListIngresosResDTO[]>} Lista de resultados.
 */
export const obtenerIngresosPorDocumentos = async (documentos) => {
    try {
        // Usamos POST para enviar la lista de documentos en el cuerpo
        const response = await apiClienteDinamica.post('genPacien/adnIngreso/todos/lista', documentos);
        return response.data;
    } catch (error) {
        console.error('Error al obtener ingresos por lote de documentos:', error);
        throw error;
    }
};


export const obtenerInformacionGeneralPaciente = async (documento) => {
    try {
        const response = await apiClienteDinamica.get(`genPacien/informacion-basica/${documento}`);
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener información general del paciente:', error);
        throw error;
    }
};

/**
 * @typedef {Object} PacienteIngresoDTO
 * @property {string} pacNumDoc - Número de documento o Historia Clínica del paciente.
 * @property {string} nombreCompleto - Nombres y apellidos concatenados.
 * @property {number} ingreso - Consecutivo único del ingreso (AINCONSEC).
 * @property {string} fechaIngreso - Fecha y hora del ingreso (formato ISO).
 * @property {string} entidad - Nombre de la entidad de salud o contrato.
 * @property {string?} servicio - Nombre del servicio/área actual (puede ser nulo).
 */

/**
 * Obtiene la información detallada de un paciente, incluyendo su ingreso activo y entidad.
 * 
 * @param {string} documento - Número de identificación del paciente a consultar.
 * @returns {Promise<PacienteIngresoDTO>} Promesa que resuelve con los datos del paciente e ingreso.
 * @throws {Error} Si ocurre un error en la petición o el paciente no tiene ingresos activos.
 */
export const obtenerInformacionCompletaPaciente = async (documento) => {
    try {
        const response = await apiClienteDinamica.get(`genPacien/informacion/ingreso/${documento}`);
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener información completa del paciente:', error);
        throw error;
    }
};


export const obtenerInformacionPacienteEgreso = async (ingreso) => {
    try {
        const response = await apiClienteDinamica.get(`genPacien/informacion/egreso/${ingreso}`);
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener información de egreso del paciente:', error);
        throw error;
    }
};