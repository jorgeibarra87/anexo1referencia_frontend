import { useState } from "react";
import { obtenerRespuestasByIngresoIdServicioProcesoTipoPregunta } from "../../api/monitorizacionHc/respuestasService";

const useFetchRespuestaIndividual = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRespuestasIndividual = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerRespuestasByIngresoIdServicioProcesoTipoPregunta(params);
            setData(response);
        }
        catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, fetchRespuestasIndividual };
}

export default useFetchRespuestaIndividual