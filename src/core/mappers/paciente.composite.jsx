import { obtenerInformacionGeneralPaciente } from "../../api/dinamica/genPacienService"
import { buscarDatosPorIdODocumento } from "../../modules/referencia-contrareferencia/api/datosReferenciaService";
import { mapearPacienteDinamica, mapearPacienteReferencia } from "./paciente.mapper";

export const buscarInformacionUsuarioSecuencial = async (documento) => {
    
    try {
        const usuarioDinamica = await obtenerInformacionGeneralPaciente(documento);
        return mapearPacienteDinamica(usuarioDinamica);
    } catch (error) {}

    try {
        const usuarioReferencia = await buscarDatosPorIdODocumento(documento);
        return mapearPacienteReferencia(usuarioReferencia);
    } catch (error) {}

    return null;
};