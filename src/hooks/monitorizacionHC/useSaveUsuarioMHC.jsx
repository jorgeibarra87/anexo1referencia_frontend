import { useState } from "react";
import { guardarUsuarioMHC } from "../../api/monitorizacionHc/usuarioService";


const useSaveUsuarioMHC = () =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const saveUsuario = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const objEnviar = {
                documento: data.username,
                nombreCompleto: data.nombreCompleto
            }
            const responseData = await guardarUsuarioMHC(objEnviar);
            setResponse(responseData);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, response, error, saveUsuario };
}

export default useSaveUsuarioMHC;