import { useState, useEffect } from 'react';
import { apiTurnoService } from '../../api/turnos/apiTurnoService';

export const useCuadrosTurno = () => {
    const [cuadrosTurno, setCuadrosTurno] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCuadrosTurno = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiTurnoService.auxiliares.getCuadrosFormateados();
                // VALIDAR EL FORMATO DE LA RESPUESTA
                let cuadros = [];
                if (Array.isArray(response)) {
                    // Si response es directamente un array
                    cuadros = response;
                } else if (response && response.data && Array.isArray(response.data)) {
                    // Si response tiene una propiedad data que es un array
                    cuadros = response.data;
                } else {
                    console.warn('⚠️ Formato de respuesta inesperado:', response);
                    cuadros = [];
                }
                setCuadrosTurno(cuadros);

            } catch (err) {
                console.error('❌ Error al cargar cuadros:', err);
                console.error('❌ Error details:', {
                    message: err.message,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });

                setError('Error al cargar cuadros de turno: ' + err.message);
                setCuadrosTurno([]);

            } finally {
                setLoading(false);
            }
        };

        fetchCuadrosTurno();
    }, []);

    return { cuadrosTurno, loading, error };
};
