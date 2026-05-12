import { useCallback, useState } from "react";
import { eliminarTamizaje } from "../../api/nutricion/tamizajeService";

export const useDeleteTamizaje = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTamizaje = useCallback(({ incomeId }) => {
    setLoading(true);
    setData(null);
    setError(null);
    
    try {
      const response = eliminarTamizaje(incomeId);
      setData(response);
    } catch (error) {
      setError(error);  
    } finally {
      setLoading(false);
    }

  }, []);

  return { deleteTamizaje, data, loading, error };
};
