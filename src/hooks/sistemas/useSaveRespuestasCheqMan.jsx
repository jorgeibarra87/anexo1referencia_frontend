import { useEffect, useState } from "react"
import { guardarRespuestasCheqMan } from "../../api/sistemas/preguntasCheMantService";

const useSaveRespuestasCheqMan = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=> {
        if(data?.message){
            // Swal.fire({
            //     title: 'Éxito',
            //     text: `${data.message}`,
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar'
            // });
            setData(null); 
        }
    }, [data]);

    const saveRespuestas = async (respuestas) => {
        setLoading(true);
        setError(null);
        try {  
            const response = await guardarRespuestasCheqMan(respuestas);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    return { data, loading, error, saveRespuestas };
}

export default useSaveRespuestasCheqMan;