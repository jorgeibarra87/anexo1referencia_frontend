import apiClienteTurnos from "./apiClienteTurnos";

// Servicio para Macroprocesos
export const macroprocesosService = {
    // Obtener todos los macroprocesos
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/macroprocesos');
            // Validar que retorne un array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.macroprocesos)) {
                return response.data.macroprocesos;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener macroprocesos:', error);
            throw error;
        }
    },

    // Obtener un macroproceso por ID
    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/macroprocesos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener macroproceso ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo macroproceso
    create: async (macroprocesoData) => {
        try {
            const response = await apiClienteTurnos.post('/macroprocesos', macroprocesoData);
            return response.data;
        } catch (error) {
            console.error('Error al crear macroproceso:', error);
            throw error;
        }
    },

    // Actualizar un macroproceso existente
    update: async (id, macroprocesoData) => {
        try {
            const response = await apiClienteTurnos.put(`/macroprocesos/${id}`, macroprocesoData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar macroproceso ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un macroproceso
    delete: async (id) => {
        try {
            const response = await apiClienteTurnos.delete(`/macroprocesos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar macroproceso ${id}:`, error);
            throw error;
        }
    },

    // Buscar macroprocesos por nombre
    searchByName: async (nombre) => {
        try {
            const response = await apiClienteTurnos.get(`/macroprocesos/buscar?nombre=${encodeURIComponent(nombre)}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al buscar macroprocesos por nombre "${nombre}":`, error);
            throw error;
        }
    },

    // Obtener macroprocesos activos
    getActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/macroprocesos/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener macroprocesos activos:', error);
            throw error;
        }
    },

    // Cambiar estado de un macroproceso
    cambiarEstado: async (id, estado) => {
        try {
            const response = await apiClienteTurnos.patch(`/macroprocesos/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado del macroproceso ${id}:`, error);
            throw error;
        }
    }
};

//Validación
export const macroprocesosValidation = {
    // Validar datos del macroproceso antes de enviar
    validateMacroprocesoData: (data) => {
        const errors = [];

        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push('El nombre del macroproceso es requerido');
        }

        if (data.nombre && data.nombre.trim().length < 3) {
            errors.push('El nombre del macroproceso debe tener al menos 3 caracteres');
        }

        if (data.nombre && data.nombre.trim().length > 100) {
            errors.push('El nombre del macroproceso no puede exceder 100 caracteres');
        }

        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Limpiar y formatear datos del macroproceso
    cleanMacroprocesoData: (data) => {
        return {
            ...data,
            nombre: data.nombre ? data.nombre.trim() : '',
            estado: Boolean(data.estado)
        };
    }
};

// Exportar servicios individualmente
export { macroprocesosService as default };
