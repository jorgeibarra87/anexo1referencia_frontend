import apiClienteDinamica from "./apiClienteDinamica";

export const obtenerInformacionPacienteHospitalizadoByIdentificacion = async (identificacion) => {
    try {
        const response = await apiClienteDinamica.get(`/pacienteHospitalizado/infoIngresoServicioCama/${identificacion}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}