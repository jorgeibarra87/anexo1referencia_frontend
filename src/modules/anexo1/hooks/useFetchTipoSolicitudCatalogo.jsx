import { useEffect, useState } from "react";
import { listarActivos } from "../api/tipoSolicitudCatalogoService";

const useFetchTipoSolicitudCatalogo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await listarActivos();
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, loading, error };
};

export default useFetchTipoSolicitudCatalogo;
