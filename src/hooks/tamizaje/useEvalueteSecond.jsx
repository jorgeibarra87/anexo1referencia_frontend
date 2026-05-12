import { useCallback, useState } from "react";
import { finalizarTamizaje } from "../../api/nutricion/tamizajeService";

export const useEvalueteSecond = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFinalizarTamizaje = useCallback(({ arrPatients, status }) => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const response = finalizarTamizaje(arrPatients, status);
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchFinalizarTamizaje, data, loading, error };
};
