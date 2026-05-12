import { useCallback, useState } from "react";
import { primeraEvaluacion } from "../../api/nutricion/tamizajeService";

export const useEvalueteFirst = () => {  

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFirstEvaluate = useCallback(({ arrPatients, status }) => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = primeraEvaluacion(arrPatients, status);
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

  }, []);

  return { fetchFirstEvaluate, data, loading, error };
};
