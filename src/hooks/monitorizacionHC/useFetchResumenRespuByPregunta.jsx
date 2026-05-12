import { useState } from "react";
import { obtenerInfocanteidadesPorPreguntas } from "../../api/monitorizacionHc/respuestasService";

const useFetchResumenRespuByPregunta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResumenRespuByPregunta = async (fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta) => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await obtenerInfocanteidadesPorPreguntas(fechaInicio, fechaFin, procesoId, servicioId, tipoPregunta);
            setData(responseData);
        }
        catch (error){
            setError(error);
        }finally {
            setLoading(false);
        }
    }
  return { data, setData, loading, error, fetchResumenRespuByPregunta};
};

export default useFetchResumenRespuByPregunta;