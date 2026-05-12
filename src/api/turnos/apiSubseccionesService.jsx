import apiClienteTurnos from "./apiClienteTurnos";

// Servicio para Subsecciones
export const subseccionesService = {
    // Obtener todas las subsecciones
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/subseccionesServicio');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.subsecciones)) {
                return response.data.subsecciones;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener subsecciones:', error);
            throw error;
        }
    },

    // Obtener una subsección por ID
    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/subseccionesServicio/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener subsección ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva subsección
    create: async (subseccionData) => {
        try {
            const response = await apiClienteTurnos.post('/subseccionesServicio', subseccionData);
            return response.data;
        } catch (error) {
            console.error('Error al crear subsección:', error);
            throw error;
        }
    },

    // Actualizar una subsección existente
    update: async (id, subseccionData) => {
        try {
            const response = await apiClienteTurnos.put(`/subseccionesServicio/${id}`, subseccionData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar subsección ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una subsección
    delete: async (id) => {
        try {
            const response = await apiClienteTurnos.delete(`/subseccionesServicio/${id}`);;
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar subsección ${id}:`, error);
            throw error;
        }
    }
};

// Servicio para Secciones (para el formulario)
export const seccionesService = {
    // Obtener todas las secciones
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/seccionesServicio');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.secciones)) {
                return response.data.secciones;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener secciones:', error);
            // En caso de error, retorna array vacío
            return [];
        }
    },

    // Obtener secciones activas
    getActivas: async () => {
        try {
            const response = await apiClienteTurnos.get('/seccionesServicio/activas');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener secciones activas:', error);
            return [];
        }
    }
};

// Utilidades para validación
export const subseccionesValidation = {
    // Validar datos de la subsección antes de enviar
    validateSubseccionData: (data) => {
        const errors = [];

        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push('El nombre de la subsección es requerido');
        }

        if (data.nombre && data.nombre.trim().length < 2) {
            errors.push('El nombre de la subsección debe tener al menos 2 caracteres');
        }

        if (data.nombre && data.nombre.trim().length > 100) {
            errors.push('El nombre de la subsección no puede exceder 100 caracteres');
        }

        if (data.idSeccionServicio && isNaN(parseInt(data.idSeccionServicio))) {
            errors.push('El ID de la sección debe ser un número válido');
        }

        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Limpiar y formatear datos de la subsección
    cleanSubseccionData: (data) => {
        return {
            nombre: data.nombre ? data.nombre.trim() : '',
            idSeccionServicio: data.idSeccionServicio && data.idSeccionServicio !== '' ? parseInt(data.idSeccionServicio) : null,
            estado: Boolean(data.estado)
        };
    }
};

// Utilidades para subsecciones
export const subseccionesUtils = {
    // Obtener nombre de la sección por ID
    getSeccionNombre: (subseccion, secciones) => {
        if (subseccion.nombreSeccion) {
            return subseccion.nombreSeccion;
        }

        if (subseccion.idSeccionServicio && secciones) {
            const seccion = secciones.find(s =>
                s.idSeccionServicio === subseccion.idSeccionServicio ||
                s.id === subseccion.idSeccionServicio
            );
            return seccion ? seccion.nombre : 'Sin sección';
        }

        return 'Sin sección';
    },

    // Obtener información completa de la sección
    getSeccionInfo: (subseccion, secciones) => {
        if (subseccion.idSeccionServicio && secciones) {
            const seccion = secciones.find(s =>
                s.idSeccionServicio === subseccion.idSeccionServicio ||
                s.id === subseccion.idSeccionServicio
            );
            if (seccion) {
                return {
                    id: seccion.idSeccionServicio || seccion.id,
                    nombre: seccion.nombre
                };
            }
        }

        return {
            id: 'No asignado',
            nombre: 'Sin sección'
        };
    }
};

// Exportaciones por defecto
export default {
    subsecciones: subseccionesService,
    secciones: seccionesService,
    validation: subseccionesValidation,
    utils: subseccionesUtils
};
