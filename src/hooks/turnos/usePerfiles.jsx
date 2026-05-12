import { useState, useEffect } from 'react';
import { apiTurnoService } from '../../api/turnos/apiTurnoService';

export const usePerfiles = (cuadroId) => {
    const [perfiles, setPerfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerfiles = async () => {
            if (!cuadroId) {
                setPerfiles([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Obtener cuadro específico para acceder al equipo
                const cuadroResponse = await apiTurnoService.auxiliares.getCuadrosTurno();
                const cuadroSeleccionado = cuadroResponse.find(c => c.idCuadroTurno?.toString() === cuadroId.toString());

                if (!cuadroSeleccionado?.idEquipo) {
                    setPerfiles([]);
                    return;
                }

                const equipoId = cuadroSeleccionado.idEquipo;

                // USAR SERVICIO API
                const miembrosData = await apiTurnoService.auxiliares.getMiembrosPerfilEquipo(equipoId);
                // Extraer perfiles únicos de los títulos
                const todosLosPerfiles = miembrosData.flatMap(miembro =>
                    miembro.titulos || []
                );

                const perfilesUnicos = [...new Set(todosLosPerfiles)]
                    .filter(perfil => perfil && perfil.trim())
                    .map(perfil => ({
                        id: perfil,
                        nombre: perfil.trim()
                    }))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));

                setPerfiles(perfilesUnicos);

            } catch (err) {
                console.error('❌ Error al cargar perfiles:', err);
                setError('Error al cargar perfiles');
                setPerfiles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfiles();
    }, [cuadroId]);

    return { perfiles, loading, error };
};
