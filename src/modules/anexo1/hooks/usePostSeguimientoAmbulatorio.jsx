import { useState } from "react";
import { crear } from "../api/seguimientoAmbulatorioService";

const usePostSeguimientoAmbulatorio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postSeguimiento = async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const res = await crear(datos);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postSeguimiento };
};

export default usePostSeguimientoAmbulatorio;
