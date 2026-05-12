import { useState, useCallback } from 'react';
import { crearSolicitudRecuperacionContrasenaByEmail } from '../../api/sistemas/solicitudRecuperaContra';

export const useSolicitudRecuperacionContrasena = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const crearSolicitud = useCallback(async (username, reenviar = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crearSolicitudRecuperacionContrasenaByEmail(username, reenviar);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearSolicitud, data, loading, error };
};
