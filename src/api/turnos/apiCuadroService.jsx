import apiClienteTurnos from "./apiClienteTurnos";

// Servicio de cuadros de turno
export const apiCuadroService = {
    cuadros: {
        // Obtener todos los cuadros de turno
        getAll: async () => {
            const response = await apiClienteTurnos.get('/cuadro-turnos');
            return Array.isArray(response.data) ? response.data : response.data.cuadros || [];
        },

        // Obtener cuadros
        getCuadros: async () => {
            const response = await apiClienteTurnos.get('/cuadro-turnos');
            const allCuadros = Array.isArray(response.data) ? response.data : response.data.cuadros || [];
            /* return allCuadros.filter(cuadro => cuadro.estadoCuadro === 'abierto'); */
            return allCuadros;
        },

        // Obtener cuadro por ID
        getById: async (id) => {
            const response = await apiClienteTurnos.get(`/cuadro-turnos/${id}`);
            return response.data;
        },

        // Obtener procesos de un cuadro
        getProcesos: async (cuadroId) => {
            const response = await apiClienteTurnos.get(`/cuadro-turnos/${cuadroId}/procesos`);
            return response.data || [];
        },

        // Crear cuadro completo
        createCompleto: async (cuadroData) => {
            const response = await apiClienteTurnos.post('/cuadro-turnos/crear-total', cuadroData);
            return response.data;
        },

        // Actualizar cuadro completo
        updateCompleto: async (id, cuadroData) => {
            const response = await apiClienteTurnos.put(`/cuadro-turnos/${id}/editar-total`, cuadroData);
            return response.data;
        },

        // Cambiar estado del cuadro (cerrar/abrir)
        cambiarEstado: async (estadoActual, nuevoEstado, idsCuadros) => {
            const response = await apiClienteTurnos.put('/cuadro-turnos/cambiar-estado', {
                estadoActual,
                nuevoEstado,
                idsCuadros
            });
            return response.data;
        },

        // Cerrar cuadro específico con información de versión
        cerrar: async (id) => {
            const response = await apiCuadroService.cuadros.cambiarEstado('abierto', 'cerrado', [id]);
            return {
                ...response,
                message: 'Cuadro cerrado. Versión mantenida.'
            };
        },

        // Abrir cuadro específico con información de nueva versión
        abrir: async (id) => {
            const response = await apiCuadroService.cuadros.cambiarEstado('cerrado', 'abierto', [id]);
            return {
                ...response,
                message: 'Cuadro reabierto con nueva versión.'
            };
        },
    },

    // Servicios auxiliares para los formularios
    auxiliares: {
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

        // Obtener procesos de atención (para multiproceso)
        getProcesosAtencion: async () => {
            const response = await apiClienteTurnos.get('/procesosAtencion');
            return response.data || [];
        },

        // Obtener procesos de atención por cuadro
        getProcesosAtencionByCuadro: async (cuadroId) => {
            const response = await apiClienteTurnos.get(`/procesosAtencion/cuadro/${cuadroId}`);
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

        // Obtener equipos
        getEquipos: async () => {
            const response = await apiClienteTurnos.get('/equipo');
            if (response.data && Array.isArray(response.data)) {
                return response.data.map(equipo => ({
                    idEquipo: equipo.idEquipo || equipo.id || "",
                    nombre: equipo.nombre || equipo.descripcion || "Sin nombre"
                }));
            }
            return [];
        },

        // Obtener miembros de un equipo con perfil
        getMiembrosEquipo: async (equipoId) => {
            const response = await apiClienteTurnos.get(`/equipo/${equipoId}/miembros-perfil`);
            return response.data || [];
        },

        // Obtener datos por categoría
        getDataByCategoria: async (categoria) => {
            const endpoints = {
                'Macroproceso': '/macroprocesos',
                'Proceso': '/procesos',
                'Servicio': '/servicio',
                'Seccion': '/seccionesServicio',
                'Subseccion': '/subseccionesServicio',
                'Multiproceso': '/procesosAtencion'
            };

            const endpoint = endpoints[categoria];
            if (!endpoint) {
                throw new Error(`Categoría no válida: ${categoria}`);
            }

            const response = await apiClienteTurnos.get(endpoint);
            return response.data || [];
        },

        // Obtener proceso específico por ID
        getProcesoById: async (id) => {
            const response = await apiClienteTurnos.get(`/procesos/${id}`);
            return response.data;
        },

        // Obtener Historial de Cambios cuadro de turno por ID
        getHistorialById: async (id) => {
            const response = await apiClienteTurnos.get(`/cuadro-turnos/${id}/historial`);
            return response.data;
        },

        // Obtener Historial de Cambios en turnos por cuadro de turno ID
        getHistorialTurnosById: async (id) => {
            const response = await apiClienteTurnos.get(`/cuadro-turnos/${id}/historialturnos`);
            return response.data;
        },
    }
};
