import { useState } from "react";
import { obtenerUsuarioPorMicroservicioPageable } from "../../api/authservice/usuarioServiceApiAuth";

const useFetchUsuarioPageable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsuarios = async (nameMicroservice, page, size) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerUsuarioPorMicroservicioPageable(nameMicroservice, page, size);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    return { data,setData, loading, error, fetchUsuarios };
}

export default useFetchUsuarioPageable;