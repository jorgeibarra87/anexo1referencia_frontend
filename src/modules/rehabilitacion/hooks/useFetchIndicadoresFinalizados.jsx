import { useState } from "react"
import { obtenerIndicadores } from "../api/indicadoresService";

const useFetchIndicadoresFinalizados = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchIndicadoresFinalizados = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerIndicadores(data);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

    }
  return { data, loading, error, fetchIndicadoresFinalizados };
}

export default useFetchIndicadoresFinalizados