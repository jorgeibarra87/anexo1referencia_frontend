import { useState } from "react";
import { guardarRelacionUsuarioProcesoServicio } from "../../api/monitorizacionHc/usuarioProcesoServicio";

const useSaveUsuarioProcServ = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const saveUsuarioRelacionProcesoServicio = async (items, documento) => {
        setLoading(true);
        setError(null);
        try {
            const item = {
                items: items.map((item) => ({id: item.value, tipo: item.tipo}))
            };
            const responseData = await guardarRelacionUsuarioProcesoServicio(item, documento);
            setResponse(responseData);
        } catch (error) {
            if(error.response?.data?.codigoError){
                setError({
                    mensaje: error.response.data.mensaje.split('|')[1],
                    title: error.response.data.codigoError == 'MHC-0015' ? 'Usuario registrado' : 'Información',
                    icon: error.response.data.codigoError == 'MHC-0015' ? 'warning' : 'error'
                })
            }else{
                setError({
                    mensaje: 'error inesperado, revisar el log ',
                    title: 'Error inesperado',
                    icon: 'error'
                })
            }
        } finally {
            setLoading(false);
        }
    }
    return { loadingRPS: loading, saveUsuarioRelacionProcesoServicio,  response, error};
}

export default useSaveUsuarioProcServ;