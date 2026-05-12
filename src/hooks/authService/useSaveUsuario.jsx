import { useState } from "react";
import { sincronizarUsuario } from "../../api/authservice/usuarioServiceApiAuth";

const useSaveUsuarioAuthSer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const saveUsuario = async (documento) => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await sincronizarUsuario(documento);
            setResponse(responseData);
        } catch (error) {
            setError(error);
        }finally {
            setLoading(false);
        }
    }
    return { loading, response, error, saveUsuario };
}

export default useSaveUsuarioAuthSer;