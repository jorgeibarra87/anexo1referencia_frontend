import { useState } from 'react'
import { obtenerInfoPorRangoFechaPorProcesoServicioYTipoPregunta } from '../../api/monitorizacionHc/respuestasService';

const useFetchDataByProServTipoPregunta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDataByProServTipoPregunta = async (fechaDesde, fechaHasta, procesoId, servicioId, tipoPregunta) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerInfoPorRangoFechaPorProcesoServicioYTipoPregunta(fechaDesde, fechaHasta, procesoId, servicioId, tipoPregunta);
            setData(response);
        } catch (error) {
            setError('Error al obtener los datos por Proceso/Servicio y Tipo de Pregunta', error);
        } finally {
            setLoading(false);
        }
    }

    return {data, setData, loading, error, fetchDataByProServTipoPregunta};
}

export default useFetchDataByProServTipoPregunta;