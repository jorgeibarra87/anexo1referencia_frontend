import { useState } from "react";
import { listarPorTramite } from "../api/seguimientoIntrahospitalarioService";

const useFetchSeguimientoIntra = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPorTramite = async (tramiteId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarPorTramite(tramiteId);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, setData, loading, error, fetchPorTramite };
};

export default useFetchSeguimientoIntra;
