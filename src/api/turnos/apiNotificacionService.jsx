import apiClienteTurnos from "./apiClienteTurnos";

// Servicios para NOTIFICACIONES
export const notificacionesService = {
    // Obtener todas las notificaciones
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get("/notificaciones");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar notificaciones: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener notificación por ID
    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/notificaciones/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar notificación con ID ${id}: ${error.response?.data?.message || error.message}`);
        }
    },

    // Crear nueva notificación
    create: async (notificacionData) => {
        try {
            const response = await apiClienteTurnos.post("/notificaciones", notificacionData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al crear notificación: ${error.response?.data?.message || error.message}`);
        }
    },

    // Actualizar notificación
    update: async (id, notificacionData) => {
        try {
            const response = await apiClienteTurnos.put(`/notificaciones/${id}`, notificacionData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al actualizar notificación: ${error.response?.data?.message || error.message}`);
        }
    },

    // Enviar notificaciones automáticas
    enviarNotificacionesAutomaticas: async (notificaciones) => {
        try {
            const response = await apiClienteTurnos.post('/notificaciones/enviar-automaticas', notificaciones);
            return response.data;
        } catch (error) {
            throw new Error(`Error al enviar notificaciones automáticas: ${error.response?.data?.message || error.message}`);
        }
    },

    // Enviar notificaciones manuales
    enviarNotificaciones: async (notificaciones) => {
        try {
            const response = await apiClienteTurnos.post('/notificaciones/enviar', notificaciones);
            return response.data;
        } catch (error) {
            throw new Error(`Error al enviar notificaciones: ${error.response?.data?.message || error.message}`);
        }
    },

    // Probar correo
    probarCorreo: async (destinatario) => {
        try {
            const response = await apiClienteTurnos.post(`/notificaciones/probar-correo?destinatario=${destinatario}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al probar correo: ${error.response?.data?.message || error.message}`);
        }
    },

    // Agregar correo a la configuración
    agregarCorreoConfiguracion: async (notificacionData) => {
        try {
            const response = await apiClienteTurnos.post('/notificaciones/agregar-correo-configuracion', notificacionData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al agregar correo a configuración: ${error.response?.data?.message || error.message}`);
        }
    },

    // Validar configuración
    validarConfiguracion: async () => {
        try {
            const response = await apiClienteTurnos.get('/notificaciones/validar-configuracion-correo');
            return response.data;
        } catch (error) {
            throw new Error(`Error al validar configuración: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Servicios para CONFIGURACIÓN DE CORREOS
export const configuracionCorreosService = {
    // Obtener correos por tipo usando el campo permanente
    getCorreosPorTipo: async (esPermanente) => {
        try {
            const response = await apiClienteTurnos.get(`/notificaciones/correos`, {
                params: { permanente: esPermanente }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener correos por tipo: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener correos predeterminados activos
    getCorreosPredeterminadosActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/notificaciones/correos-predeterminados-activos');
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener correos predeterminados activos: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener correos seleccionables activos
    getCorreosSeleccionablesActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/notificaciones/correos-seleccionables-activos');
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener correos seleccionables activos: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener todos los correos únicos activos
    getTodosCorreosActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/notificaciones/correos-activos');
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener correos activos: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener correos únicos
    getCorreosUnicos: async () => {
        try {
            const response = await apiClienteTurnos.get('/notificaciones/correos-unicos');
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener correos únicos: ${error.response?.data?.message || error.message}`);
        }
    },

    // Actualizar estado de correos seleccionables
    actualizarEstadoCorreos: async (actualizaciones) => {
        try {
            const response = await apiClienteTurnos.put('/notificaciones/actualizar-estados', actualizaciones);
            return response.data;
        } catch (error) {
            throw new Error(`Error al actualizar estados: ${error.response?.data?.message || error.message}`);
        }
    },

    agregarCorreoConfiguracion: async (notificacionData) => {
        try {
            const response = await apiClienteTurnos.post('/notificaciones/agregar-correo-configuracion', notificacionData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al agregar correo a configuración: ${error.response?.data?.message || error.message}`);
        }
    },

    // Crear o actualizar correo
    createOrUpdateCorreo: async (notificacionData) => {
        try {
            const response = await apiClienteTurnos.post('/notificaciones/create-or-update', notificacionData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al crear/actualizar correo: ${error.response?.data?.message || error.message}`);
        }
    }
};

// Exportar servicios agrupados
export const apiNotificacionService = {
    notificaciones: notificacionesService,
    configuracion: configuracionCorreosService
};

export default apiNotificacionService;
