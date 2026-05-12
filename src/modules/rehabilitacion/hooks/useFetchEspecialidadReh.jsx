import { useState, useEffect } from 'react';
import { obtenerEspecialidadesRehabilitacion } from '../api/indicadoresService';

// 
const useFetchEspecialidadReh = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Se inicia en true
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await obtenerEspecialidadesRehabilitacion();
                setData(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []); // El array vacío asegura que solo se ejecute una vez

    return { data, loading, error };
}

export default useFetchEspecialidadReh;