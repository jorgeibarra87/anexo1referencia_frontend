import { useState } from "react";
import { obtenerInfoCantidadesPorGrupoPorMes } from "../../api/monitorizacionHc/respuestasService";

const useFechDataByGrupoResumen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchDataByGrupoResumen = async (fechaDesde, fechaHasta, procesoId, servicioId, tipoPregunta) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerInfoCantidadesPorGrupoPorMes(fechaDesde, fechaHasta, procesoId, servicioId, tipoPregunta);
            setData(response);
        } catch (error) {
            setError('Error al obtener los datos por grupo resumen', error);
        } finally {
            setLoading(false);
        }
    }

    return { data, setData, loading, error, fetchDataByGrupoResumen };
}

export default useFechDataByGrupoResumen;