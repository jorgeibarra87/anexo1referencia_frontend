import { useEffect, useState } from "react";
import { listarTramites } from "../api/tramiteService";

const useFetchTramites = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listarTramites();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, setData, loading, error, refetch: fetchData };
};

export default useFetchTramites;
