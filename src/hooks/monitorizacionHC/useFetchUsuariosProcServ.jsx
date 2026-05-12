import { useEffect, useState } from "react";
import { obtenerUsuariosQueTienenProcesosYServicios } from "../../api/monitorizacionHc/usuarioService";

const useFetchUsuariosProcServ = () => {
    const [usuariosProServ, setUsuariosProcServ] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(usuariosProServ.length === 0) {
            fetchUsuariosProcServ();
        }
    }, [])

    const fetchUsuariosProcServ = async () => {
        setLoading(true);
        setError(null);
        try {
            const usuariosData = await obtenerUsuariosQueTienenProcesosYServicios();
            const usuarioProcServ = usuariosData.map((usuario) => {
                return {
                    usuario: {id: usuario.id, documento: usuario.documento},
                    procesos: usuario.procesosServicios.filter(item => item.tipo == 'PROCESO').map((proceso) => ({
                        value: proceso.id,
                        label: proceso.nombre,
                        tipo: proceso.tipo
                    })),
                    servicios: usuario.procesosServicios.filter(item => item.tipo == 'SERVICIO').map((servicio) => ({
                        value: servicio.id,
                        label: servicio.nombre,
                        tipo: servicio.tipo
                    }))
                }
            })
            setUsuariosProcServ(usuarioProcServ);
        }catch (error) {
            setError('Error al obtener los usuarios que tienen procesos y servicios', error);
        }
        finally {
            setLoading(false);
        }
    }

    return { usuariosProServ, setUsuariosProcServ, loadingUps: loading };
}

export default useFetchUsuariosProcServ;