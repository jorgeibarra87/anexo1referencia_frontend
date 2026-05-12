import { useState, useEffect } from 'react';
import apiClienteTurnos from '../../api/turnos/apiClienteTurnos';

export const useCalendarioTurnos = (filtros, fechaActual) => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurnos = async () => {
            if (!filtros.cuadroTurno) {
                setTurnos([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Cargar TODOS los turnos
                const response = await apiClienteTurnos.get('/turnos');

                let turnosFiltrados = response.data || [];

                // FILTRO PRINCIPAL: Por cuadro de turno
                turnosFiltrados = turnosFiltrados.filter(turno => {
                    const coincideCuadro = turno.idCuadroTurno?.toString() === filtros.cuadroTurno.toString();
                    if (coincideCuadro) {
                    }
                    return coincideCuadro;
                });

                // Filtro por mes y año actual del calendario
                const añoActual = fechaActual.getFullYear();
                const mesActual = fechaActual.getMonth();

                turnosFiltrados = turnosFiltrados.filter(turno => {
                    if (!turno.fechaInicio) return false;

                    let fechaTurno;
                    if (turno.fechaInicio.includes('T')) {
                        fechaTurno = new Date(turno.fechaInicio);
                    } else {
                        fechaTurno = new Date(turno.fechaInicio + 'T00:00:00');
                    }

                    const cumpleFecha = fechaTurno.getFullYear() === añoActual &&
                        fechaTurno.getMonth() === mesActual;

                    return cumpleFecha;
                });

                // FILTRO POR PROCESO
                if (filtros.proceso && filtros.proceso.trim() !== '') {
                    const procesoFiltro = filtros.proceso.toString();
                    const turnosAntesProceso = turnosFiltrados.length;

                    turnosFiltrados = turnosFiltrados.filter(turno => {
                        const coincide = turno.idProceso?.toString() === procesoFiltro;
                        if (coincide) {
                        }
                        return coincide;
                    });
                }

                // FILTRO POR PERFIL
                if (filtros.perfil) {
                    try {

                        // Obtener cuadro específico para acceder al equipo
                        const cuadroResponse = await apiClienteTurnos.get(`/cuadro-turnos/${filtros.cuadroTurno}`);
                        const equipoId = cuadroResponse.data.idEquipo;

                        if (equipoId) {
                            // Obtener miembros con sus perfiles
                            const miembrosResponse = await apiClienteTurnos.get(`/equipo/${equipoId}/miembros-perfil`);
                            const miembrosConPerfil = miembrosResponse.data || [];

                            // Crear mapa: idPersona -> perfiles
                            const mapaPersonaPerfiles = {};
                            miembrosConPerfil.forEach(miembro => {
                                const personaId = miembro.idPersona || miembro.id;
                                if (personaId && miembro.titulos) {
                                    mapaPersonaPerfiles[personaId.toString()] = miembro.titulos;
                                }
                            });

                            // Filtrar turnos por perfil
                            turnosFiltrados = turnosFiltrados.filter(turno => {
                                const personaId = turno.idPersona;

                                if (!personaId) {
                                    return false;
                                }

                                const perfilesPersona = mapaPersonaPerfiles[personaId.toString()] || [];
                                const tienePerfil = perfilesPersona.some(perfil =>
                                    perfil.toLowerCase().includes(filtros.perfil.toLowerCase())
                                );

                                return tienePerfil;
                            });

                        }
                    } catch (error) {
                        console.error('❌ Error al aplicar filtro de perfil:', error);
                    }
                }
                setTurnos(turnosFiltrados);

            } catch (err) {
                console.error('❌ Error al cargar turnos:', err);
                setError('Error al cargar turnos: ' + err.message);
                setTurnos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
    }, [filtros, fechaActual]);

    return { turnos, loading, error };
};
