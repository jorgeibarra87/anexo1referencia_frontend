import { useCallback, useState } from "react";
import { buscarInformacionUsuarioSecuencial } from "../../../core/mappers/paciente.composite";

const useFetchInfoPacienteRef = () => {
    const [infoPaciente, setInfoPaciente] = useState(null);
    
    const fetchInformacionPaciente = useCallback(async (documento) => {
        try {
            const data = await buscarInformacionUsuarioSecuencial(documento);
            setInfoPaciente(data);
        } catch (error) {

        } 
    }, []);

    return { infoPaciente, fetchInformacionPaciente };
}

export default useFetchInfoPacienteRef