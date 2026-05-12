import { useState } from "react";
import { obtenerInfoRespuestasPorFechaYTipoPregunta } from "../../api/monitorizacionHc/respuestasService";

const useFetchPorcentajesByDates = () => {

    const [porcentajes, setPorcentajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPorcentajesByDates = async (fechaDesde, fechaHasta, tipoPregunta) => {
        setLoading(true);
        setError(null);
        try {
            const porcentajesData = await obtenerInfoRespuestasPorFechaYTipoPregunta(fechaDesde, fechaHasta, tipoPregunta);
            setPorcentajes(porcentajesData);
        } catch (error) {
            setError('Error al obtener los porcentajes por fechas',error);
        } finally {
            setLoading(false);
        }
    }

    return { porcentajes, setPorcentajes, loading, error, fetchPorcentajesByDates };
}

export default useFetchPorcentajesByDates;