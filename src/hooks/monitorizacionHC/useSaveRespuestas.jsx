import { useState } from "react";
import { guardarRespuestas } from "../../api/monitorizacionHc/respuestasService";

const useSaveRespuestas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const saveRespuestas = async (objIngresoConRespuestas, tipoPregunta) => {
        setLoading(true);
        setError(null);
        try {
            const respuestasData = await guardarRespuestas(objIngresoConRespuestas, tipoPregunta);
            setResponse(respuestasData);
        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    }
    return { loadingRes: loading, responseSr: response, error, saveRespuestas };
}

export default useSaveRespuestas;