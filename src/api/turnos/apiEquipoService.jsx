import apiClienteTurnos from "./apiClienteTurnos";

// Servicio de equipos
export const apiEquipoService = {
    equipos: {
        // Obtener todos los equipos
        getAll: async () => {
            const response = await apiClienteTurnos.get('/equipo');
            return Array.isArray(response.data) ? response.data : response.data.equipos || [];
        },

        // Obtener equipos activos (filtrado)
        getEquiposActivos: async () => {
            const response = await apiClienteTurnos.get('/equipo');
            const allEquipos = Array.isArray(response.data) ? response.data : response.data.equipos || [];
            return allEquipos.filter(equipo => equipo.estado === true);
        },

        // Obtener equipo por ID
        getById: async (id) => {
            const response = await apiClienteTurnos.get(`/equipo/${id}`);
            return response.data; // Retorna el objeto completo del equipo
        },

        // FUNCIONES PARA CrearEquipo:

        // Crear equipo, con nombre, categoría, subcategoría
        createCompleto: async ({ nombre, categoria, subcategoria }) => {
            const equipoData = { nombre, categoria, subcategoria };
            // Endpoint: POST /equipo/equipoNombre
            const response = await apiClienteTurnos.post('/equipo/equipoNombre', equipoData);
            return response.data;
        },

        // Actualizar el nombre del equipo
        updateNombre: async (id, equipoData) => {
            // Endpoint: PUT /equipo/{id}/actualizar-nombre
            const response = await apiClienteTurnos.put(`/equipo/${id}/actualizar-nombre`, equipoData);
            return response.data;
        },

        // Crear equipo
        create: async (equipoData) => {
            const response = await apiClienteTurnos.post('/equipo', equipoData);
            return response.data;
        },

        // Actualizar equipo
        update: async (id, equipoData) => {
            const response = await apiClienteTurnos.put(`/equipo/${id}`, equipoData);
            return response.data;
        },

        // Eliminar equipo
        delete: async (id) => {
            const response = await apiClienteTurnos.delete(`/equipo/${id}`);
            return response.data;
        },

        // Obtener cuadros asociados a un equipo (antes de eliminar)
        getCuadros: async (id) => {
            const response = await apiClienteTurnos.get(`/equipo/${id}/cuadros`);
            return response.data || [];
        },

        // Obtener miembros básicos del equipo
        getMiembros: async (id) => {
            const response = await apiClienteTurnos.get(`/equipo/${id}/miembros`);
            return response.data || [];
        },

        // Obtener miembros con perfil del equipo
        getMiembrosPerfil: async (id) => {
            const response = await apiClienteTurnos.get(`/equipo/${id}/miembros-perfil`);
            return response.data || [];
        },

        // Obtener usuarios del equipo (para edición)
        getUsuariosEquipo: async (idEquipo) => {
            const response = await apiClienteTurnos.get(`/persona/equipo/${idEquipo}/usuarios`);
            return response.data || [];
        },

        // Actualizar usuarios del equipo
        updateUsuariosEquipo: async (idEquipo, personasIds) => {
            const response = await apiClienteTurnos.put(`/persona/equipo/${idEquipo}`, personasIds);
            return response.data;
        },

        // Verificar si el equipo puede ser eliminado
        canDelete: async (id) => {
            try {
                const cuadros = await apiEquipoService.equipos.getCuadros(id);
                return {
                    canDelete: cuadros.length === 0,
                    cuadrosCount: cuadros.length,
                    cuadros: cuadros
                };
            } catch (error) {
                return {
                    canDelete: true,
                    cuadrosCount: 0,
                    cuadros: []
                };
            }
        },

        createWithGeneratedName: async (selection) => {
            const response = await apiClienteTurnos.post('/equipo/with-generated-name', selection);
            return response.data;  // Solo devolver los datos
        },

        updateWithGeneratedName: async (id, selection) => {
            const response = await apiClienteTurnos.put(`/equipo/${id}/with-generated-name`, selection);
            return response.data;  // Solo devolver los datos
        },

        // Obtener historial de un equipo específico
        getHistorialEquipo: async (equipoId) => {
            try {
                const response = await apiClienteTurnos.get(`/cambios-equipo/historial/${equipoId}`);
                return response.data;
            } catch (error) {
                throw new Error(`Error al obtener historial del equipo: ${error.response?.data?.message || error.message}`);
            }
        },

        // Obtener historial de una persona específica
        getHistorialPersona: async (personaId) => {
            try {
                const response = await apiClienteTurnos.get(`/cambios-equipo/historial-persona/${personaId}`);
                return response.data;
            } catch (error) {
                throw new Error(`Error al obtener historial de la persona: ${error.response?.data?.message || error.message}`);
            }
        },

        // Obtener historial completo relacionado a un cuadro
        getHistorialCompleto: async (cuadroId) => {
            try {
                const response = await apiClienteTurnos.get(`/cambios-equipo/historial-cuadro/${cuadroId}`);
                return response.data;
            } catch (error) {
                throw new Error(`Error al obtener historial completo: ${error.response?.data?.message || error.message}`);
            }
        }
    },

    //Servicios auxiliares
    auxiliares: {

        // Obtener opciones por categoría (para selects dinámicos)
        getByCategoria: async (categoria) => {
            const endpoints = {
                'Macroproceso': '/macroprocesos',
                'Proceso': '/procesos',
                'Servicio': '/servicio',
                'Seccion': '/seccionesServicio',
                'Subseccion': '/subseccionesServicio'
            };

            const endpoint = endpoints[categoria];
            if (!endpoint) {
                throw new Error(`Categoría no válida: ${categoria}`);
            }

            const response = await apiClienteTurnos.get(endpoint);
            return response.data || [];
        },

        // Obtener macroprocesos
        getMacroprocesos: async () => {
            const response = await apiClienteTurnos.get('/macroprocesos');
            return response.data || [];
        },

        // Obtener procesos
        getProcesos: async () => {
            const response = await apiClienteTurnos.get('/procesos');
            return response.data || [];
        },

        // Obtener servicios
        getServicios: async () => {
            const response = await apiClienteTurnos.get('/servicio');
            return response.data || [];
        },

        // Obtener secciones de servicio
        getSeccionesServicio: async () => {
            const response = await apiClienteTurnos.get('/seccionesServicio');
            return response.data || [];
        },

        // Obtener subsecciones de servicio
        getSubseccionesServicio: async () => {
            const response = await apiClienteTurnos.get('/subseccionesServicio');
            return response.data || [];
        },

        // Obtener perfiles/títulos (para asignación de personas)
        getPerfiles: async () => {
            const response = await apiClienteTurnos.get('/titulosFormacionAcademica');
            return response.data || [];
        },

        // Obtener usuarios por perfil/título
        getUsuariosPorPerfil: async (idTitulo) => {
            const response = await apiClienteTurnos.get(`/persona/titulo/${idTitulo}/usuarios`);
            return response.data || [];
        }
    }
};
