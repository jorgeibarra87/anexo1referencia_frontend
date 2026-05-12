import { useEffect, useState } from "react";
import { obtenerInfoGenUsuario } from "../../api/dinamica/genUsuarioService";

const useFetchGenUsuarioInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data?.oid) {
            // Swal.fire({
            //     title: 'Información del Usuario',
            //     html: data.usudescri,  // Cambiado text por html para mejor formato
            //     icon: 'info',
            //     showCancelButton: true,  // Añadido para mostrar ambos botones
            //     confirmButtonText: 'Sí',  // Corregida mayúscula
            //     cancelButtonText: 'No',
            //     reverseButtons: true,    // Opcional: orden más común (No, Sí)
            //     focusCancel: true         // Opcional: enfoca el botón de cancelar
            // }).then((result) => {
            //     if (result.isDismissed) {  // Mejor condición para capturar cancelación
            //         setData(null);
            //     }
            // });
        }
    }, [data]);

    const fetchGenUsuarioInfo = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerInfoGenUsuario(username);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, fetchGenUsuarioInfo };
}

export default useFetchGenUsuarioInfo;