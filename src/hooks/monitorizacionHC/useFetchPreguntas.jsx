import { useState } from "react";
import { obtenerPreguntasServicio } from "../../api/monitorizacionHc/preguntasService";

const useFetchPreguntas = () =>{
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPreguntas = async (id, tipoGrupo, tipoPregunta) =>{
        setLoading(true);
        setError(null);
        try {
            const preguntasData = await obtenerPreguntasServicio(id, tipoGrupo, tipoPregunta);
            setPreguntas(preguntasData);
        } catch (error) {
            setError('Error al obtener las preguntas',error);
        } finally {
            setLoading(false);
        }
    }

    return {preguntas, setPreguntas, loadingP: loading, error, fetchPreguntas};
}

export default useFetchPreguntas;