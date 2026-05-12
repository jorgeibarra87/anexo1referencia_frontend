import { useState } from "react";
import { guardarDatosReferencia } from "../../referencia-contrareferencia/api/datosReferenciaService";

const usePostDatosRefContraRef = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postDatosRefContraRef = async (datos) => {
        setLoading(true);
        setError(null);
        try {
            const response = await guardarDatosReferencia(datos);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, postDatosRefContraRef };
}

export default usePostDatosRefContraRef