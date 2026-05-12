import { useState } from "react";
import { guardarObservacionTriage } from "../../referencia-contrareferencia/api/datosReferenciaService";

const usePostObservacionTriageRefContraRef = () => {
    const [isPutting, setIsPutting] = useState(false);
    const [putError, setPutError] = useState(null);

    const putObservacionTriage = async (id, observacion) => {
        setIsPutting(true);
        setPutError(null);
        
        try {
            const response = await guardarObservacionTriage(id, observacion);
            return response;
        } catch (error) {
            setPutError(error);
            console.error('Error al guardar la observación de triage', error);
            throw error;
        } finally {
            setIsPutting(false);
        }
    };
    return { putObservacionTriage, isPutting, putError };
}

export default usePostObservacionTriageRefContraRef