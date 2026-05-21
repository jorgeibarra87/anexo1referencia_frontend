import { useState } from "react";
import { obtenerPorTramiteId } from "../api/egresoService";

const useFetchEgresos = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPorTramite = async (tramiteId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await obtenerPorTramiteId(tramiteId);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchPorTramite };
};

export default useFetchEgresos;
