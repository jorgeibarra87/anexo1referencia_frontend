import { useState } from "react";
import { obtenerInfoContactoGenUsuarioPublic } from "../../api/dinamica/genUsuarioService";

const useFetchInfoContactoGenUsuario = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInfoContactoGenUsuario = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerInfoContactoGenUsuarioPublic(username);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return { data, loading, error, fetchInfoContactoGenUsuario };
}

export default useFetchInfoContactoGenUsuario