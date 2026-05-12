import { useState } from "react";
import { obtenerUsuarioConProcesosYServiciosPorDocumento } from "../../api/monitorizacionHc/usuarioService";

const useFecthUsuarioProcServ = () => {
    const [usuarioProcServ, setUsuarioProcServ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [procServ, setProcServ] = useState([]);

    const fetchUsuaroProcServByDocumento = async (documento) =>{
        setLoading(true);
        setError(null);
        try {
            const responseData = await obtenerUsuarioConProcesosYServiciosPorDocumento(documento);
            setProcServ([...responseData.procesosServicios.map((item) => ({value: item.id, label: item.nombre, tipo: item.tipo }))]);
            setUsuarioProcServ(responseData);
        } catch (error) {
            if(error?.response?.data?.codigoError){
                setError({
                    mensaje: error.response.data.mensaje.split('|')[1],
                    title: 'Error',
                    icon: 'error'
                })
            } else {
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
    return {procServ, loadingUPS: loading, error, fetchUsuaroProcServByDocumento};
}

export default useFecthUsuarioProcServ;