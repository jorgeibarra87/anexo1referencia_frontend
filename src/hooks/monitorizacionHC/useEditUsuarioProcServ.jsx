import { useState } from "react";
import { actualizarRelacionUsuarioProcesoServicio } from "../../api/monitorizacionHc/usuarioProcesoServicio";

const useEditUsuarioProcServ = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editarUsuarioProcServ = async (documento, items) => {
        setLoading(true);
        setError(null);
        try {
            const item = {
                items: items.map((item) => ({ id: item.value, tipo: item.tipo }))
            };
            const responseData = actualizarRelacionUsuarioProcesoServicio(documento, item);
            setResponse(responseData);
        } catch (error) {
            if(error.response?.data?.codigoError) {
                setError({
                    mensaje: error.response.data.mensaje.split('|')[1],
                    title: 'Información',
                    icon: 'error'
                })
            }
            else {
                setError({
                    mensaje: 'error inesperado, revisar el log ',
                    title: 'Error inesperado',
                    icon: 'error'
                })
            }
        }
        finally {
            setLoading(false);
        }
    }
    return {editarUsuarioProcServ, loading, response, error};
}

export default useEditUsuarioProcServ;