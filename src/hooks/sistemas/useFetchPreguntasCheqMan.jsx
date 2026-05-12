import React, { useState } from 'react'
import { obtenerPreguntasCheqMan } from '../../api/sistemas/preguntasCheMantService';

const useFetchPreguntasCheqMan = () => {
   const [preguntas, setPreguntas] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const fetchPreguntas = async () => {
        setLoading(true);
        setError(null);
        try {
            const preguntas = await obtenerPreguntasCheqMan();
            setPreguntas(preguntas);
        } catch (error) {
            setError(error);
        } finally{
            setLoading(false);
        }
   }
    return { preguntas, loading, error, fetchPreguntas };
}

export default useFetchPreguntasCheqMan;