import { useState, useEffect } from 'react';
import { apiTurnoService } from '../../api/turnos/apiTurnoService';

export const useProcesos = (cuadroId) => {
    const [procesos, setProcesos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProcesos = async () => {
            if (!cuadroId) {
                setProcesos([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // USAR TU SERVICIO API PARA OBTENER TURNOS DEL CUADRO
                const turnosDelCuadro = await apiTurnoService.turnos.getByCuadro(cuadroId);

                // Extraer procesos únicos de los turnos
                const procesosUnicos = [...new Set(
                    turnosDelCuadro
                        .filter(turno => turno.idProceso && turno.idProceso !== null)
                        .map(turno => ({
                            id: turno.idProceso,
                            nombre: turno.nombreProceso || turno.proceso || `Proceso ${turno.idProceso}`
                        }))
                        .map(proceso => JSON.stringify(proceso))
                )]
                    .map(procesoStr => JSON.parse(procesoStr))
                    .filter(proceso => proceso.id !== undefined && proceso.id !== null)
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));

                setProcesos(procesosUnicos);

            } catch (err) {
                console.error('❌ Error al cargar procesos:', err);
                setError('Error al cargar procesos');
                setProcesos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProcesos();
    }, [cuadroId]);

    return { procesos, loading, error };
};
