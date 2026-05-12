import React, { useState } from 'react'
import { obtenerRespuestas } from '../../api/monitorizacionHc/respuestasService';

const useFetchRespuestas = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchRespuestas = async (body) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerRespuestas(body);
            setData(response);
        } catch (error) {
            setError('Error al obtener las respuestas', error);
        } finally {
            setLoading(false);
        }
    }
  return { data, loading, error, fetchRespuestas };
}

export default useFetchRespuestas