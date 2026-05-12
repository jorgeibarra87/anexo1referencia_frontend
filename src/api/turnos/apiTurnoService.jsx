import apiClienteTurnos from "./apiClienteTurnos";

// Servicio de turnos
export const apiTurnoService = {
    turnos: {
        // Obtener turnos por cuadro
        getByCuadro: async (cuadroId) => {
            const response = await apiClienteTurnos.get(`/turnos/cuadro/${cuadroId}`);
            return response.data || [];
        },

        // Obtener turno por ID
        getById: async (turnoId) => {
            const response = await apiClienteTurnos.get(`/turnos/${turnoId}`);
            return response.data;
        },

        // Crear turno
        create: async (turnoData) => {
            try {
                const response = await apiClienteTurnos.post('/turnos', turnoData);
                return response.data;
            } catch (error) {
                console.error('Error status:', error.response?.status);
                console.error('Error data:', error.response?.data);

                if (error.response?.status === 422) {
                    // Validación
                    const errorMessage = error.response.data?.mensaje ||
                        error.response.data?.message ||
                        'Error de validación en el turno';
                    throw new Error(errorMessage);
                } else if (error.response?.status === 400) {
                    throw new Error('Datos inválidos en la solicitud');
                } else if (error.response?.status === 409) {
                    throw new Error('Conflicto al crear el turno');
                } else if (error.response?.status === 500) {
                    throw new Error('Error interno del servidor');
                } else {
                    throw new Error('Error desconocido: ' + (error.response?.data?.message || error.message));
                }
            }
        },

        // Actualizar turno
        update: async (turnoId, turnoData) => {
            const response = await apiClienteTurnos.put(`/turnos/${turnoId}`, turnoData);
            return response.data;
        },

        // Eliminar turno
        delete: async (turnoId) => {
            const response = await apiClienteTurnos.delete(`/turnos/${turnoId}`);
            return response.data;
        },

        // Obtener turnos abiertos por cuadro
        getTurnosAbiertosByCuadro: async (cuadroId) => {
            const response = await apiClienteTurnos.get(`/turnos/cuadro/${cuadroId}`);
            const turnos = response.data || [];
            return turnos;
        }
    },

    auxiliares: {
        // Obtener cuadros de turno
        getCuadrosTurno: async () => {
            const response = await apiClienteTurnos.get('/cuadro-turnos');
            return Array.isArray(response.data) ? response.data : response.data.cuadros || [];
        },

        // Obtener cuadros formateados para selects
        getCuadrosFormateados: async () => {
            const cuadros = await apiTurnoService.auxiliares.getCuadrosTurno();
            return cuadros.map(cuadro => ({
                idCuadroTurno: cuadro.idCuadroTurno || cuadro.id || "",
                nombre: cuadro.nombre || cuadro.descripcion || "Sin nombre",
                idEquipo: cuadro.idEquipo || null
                , version: cuadro.version || ""
            }));
        },

        // Obtener usuarios de un equipo (para formulario)
        getUsuariosEquipo: async (equipoId) => {
            const response = await apiClienteTurnos.get(`/persona/equipo/${equipoId}/usuarios`);
            return response.data || [];
        },

        // Obtener miembros con perfil de un equipo
        getMiembrosPerfilEquipo: async (equipoId) => {
            const response = await apiClienteTurnos.get(`/equipo/${equipoId}/miembros-perfil`);
            return response.data || [];
        },

        // Obtener información de un equipo
        getEquipoInfo: async (equipoId) => {
            const response = await apiClienteTurnos.get(`/equipo/${equipoId}`);
            return {
                idEquipo: response.data.idEquipo || response.data.id || "",
                nombre: response.data.nombre || "Sin nombre"
            };
        }
    }
};
