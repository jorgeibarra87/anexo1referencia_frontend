import { useState, useEffect } from "react";
import { obtenerExamenesTomadosPageble } from "../../api/laboratorio/examenesService";

const useFetchExamenesTomados = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExamenesTomados = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const response = await obtenerExamenesTomadosPageble(page, size);
            setData(response);   // aquí viene page, size, totalPages, etc.
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamenesTomados(); // page=0, size=10
    }, []);

    return { data, loading, error, fetchExamenesTomados };
};

export default useFetchExamenesTomados;
