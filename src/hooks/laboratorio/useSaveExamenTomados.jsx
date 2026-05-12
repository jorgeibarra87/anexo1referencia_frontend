import React, { useState } from 'react'
import { guardarExamenesTomados } from '../../api/laboratorio/examenesService';

const useSaveExamenTomados = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const saveExamenTomado = async (examenData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await guardarExamenesTomados(examenData);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
  return { data, loading, error, saveExamenTomado }
}

export default useSaveExamenTomados