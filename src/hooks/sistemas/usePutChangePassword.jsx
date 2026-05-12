import { useCallback, useState } from "react";
import { cerrarSolicitudRecuperacionContrasena } from "../../api/sistemas/solicitudRecuperaContra";

export const usePutChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const putChangePassword = useCallback( async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cerrarSolicitudRecuperacionContrasena(formData);
            setData(response);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    },[]);

    return { loading, error, data, putChangePassword };
};