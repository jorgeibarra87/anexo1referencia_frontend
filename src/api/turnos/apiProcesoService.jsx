import apiClienteTurnos from "./apiClienteTurnos";

// Servicio para Procesos
export const procesosService = {
    // Obtener todos los procesos
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/procesos');

            // Validar que retorne un array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.procesos)) {
                return response.data.procesos;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener procesos:', error);
            throw error;
        }
    },

    // Obtener un proceso por ID
    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/procesos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener proceso ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo proceso
    create: async (procesoData) => {
        try {
            const response = await apiClienteTurnos.post('/procesos', procesoData);
            return response.data;
        } catch (error) {
            console.error('Error al crear proceso:', error);
            throw error;
        }
    },

    // Actualizar un proceso existente
    update: async (id, procesoData) => {
        try {
            const response = await apiClienteTurnos.put(`/procesos/${id}`, procesoData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar proceso ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un proceso
    delete: async (id) => {
        try {
            const response = await apiClienteTurnos.delete(`/procesos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar proceso ${id}:`, error);
            throw error;
        }
    },

    // Buscar procesos por nombre
    searchByName: async (nombre) => {
        try {
            const response = await apiClienteTurnos.get(`/procesos/buscar?nombre=${encodeURIComponent(nombre)}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al buscar procesos por nombre "${nombre}":`, error);
            throw error;
        }
    },

    // Obtener procesos activos
    getActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/procesos/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener procesos activos:', error);
            throw error;
        }
    },

    // Obtener procesos por macroproceso
    getByMacroproceso: async (macroprocesoId) => {
        try {
            const response = await apiClienteTurnos.get(`/procesos/macroproceso/${macroprocesoId}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al obtener procesos del macroproceso ${macroprocesoId}:`, error);
            throw error;
        }
    },

    // Cambiar estado de un proceso
    cambiarEstado: async (id, estado) => {
        try {
            const response = await apiClienteTurnos.patch(`/procesos/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado del proceso ${id}:`, error);
            throw error;
        }
    }
};

// Servicio para Macroprocesos
export const macroprocesosService = {
    // Obtener todos los macroprocesos (para el formulario)
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/macroprocesos');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.macroprocesos)) {
                return response.data.macroprocesos;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener macroprocesos:', error);
            // En caso de error, retorna array vacío
            return [];
        }
    },

    // Obtener macroprocesos activos
    getActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/macroprocesos/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener macroprocesos activos:', error);
            return [];
        }
    }
};

// Utilidades para validación
export const procesosValidation = {
    // Validar datos del proceso antes de enviar
    validateProcesoData: (data) => {
        const errors = [];

        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push('El nombre del proceso es requerido');
        }

        if (data.nombre && data.nombre.trim().length < 3) {
            errors.push('El nombre del proceso debe tener al menos 3 caracteres');
        }

        if (data.nombre && data.nombre.trim().length > 150) {
            errors.push('El nombre del proceso no puede exceder 150 caracteres');
        }

        if (data.idMacroproceso && isNaN(parseInt(data.idMacroproceso))) {
            errors.push('El ID del macroproceso debe ser un número válido');
        }

        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Limpiar y formatear datos del proceso
    cleanProcesoData: (data) => {
        return {
            nombre: data.nombre ? data.nombre.trim() : '',
            idMacroproceso: data.idMacroproceso && data.idMacroproceso !== '' ? parseInt(data.idMacroproceso) : null,
            estado: Boolean(data.estado)
        };
    }
};

// Utilidades para obtener información de macroprocesos
export const procesoUtils = {
    // Obtener nombre del macroproceso por ID
    getMacroprocesoNombre: (proceso, macroprocesos) => {
        if (proceso.nombreMacroproceso) {
            return proceso.nombreMacroproceso;
        }

        if (proceso.idMacroproceso && macroprocesos) {
            const macroproceso = macroprocesos.find(m => m.idMacroproceso === proceso.idMacroproceso);
            return macroproceso ? macroproceso.nombre : 'Sin macroproceso';
        }

        return 'Sin macroproceso';
    },

    // Obtener información completa del macroproceso
    getMacroprocesoInfo: (proceso, macroprocesos) => {
        if (proceso.idMacroproceso && macroprocesos) {
            const macroproceso = macroprocesos.find(m => m.idMacroproceso === proceso.idMacroproceso);
            if (macroproceso) {
                return {
                    id: macroproceso.idMacroproceso,
                    nombre: macroproceso.nombre
                };
            }
        }

        return {
            id: 'No asignado',
            nombre: 'Sin macroproceso'
        };
    }
};

// Exportar servicio principal
export { procesosService as default };
