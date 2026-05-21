import { useState } from "react";
import { crearTramite } from "../api/tramiteService";

const usePostTramite = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postTramite = async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const res = await crearTramite(datos);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postTramite };
};

export default usePostTramite;
