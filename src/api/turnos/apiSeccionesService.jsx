import apiClienteTurnos from "./apiClienteTurnos";

// Servicio para Secciones
export const seccionesService = {
    // Obtener todas las secciones
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/seccionesServicio');

            // Validar que retorne un array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.secciones)) {
                return response.data.secciones;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener secciones:', error);
            throw error;
        }
    },

    // Obtener una sección por ID
    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/seccionesServicio/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener sección ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva sección
    create: async (seccionData) => {
        try {
            const response = await apiClienteTurnos.post('/seccionesServicio', seccionData);
            return response.data;
        } catch (error) {
            console.error('Error al crear sección:', error);
            throw error;
        }
    },

    // Actualizar una sección existente
    update: async (id, seccionData) => {
        try {
            const response = await apiClienteTurnos.put(`/seccionesServicio/${id}`, seccionData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar sección ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una sección
    delete: async (id) => {
        try {
            const response = await apiClienteTurnos.delete(`/seccionesServicio/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar sección ${id}:`, error);
            throw error;
        }
    },

    // Buscar secciones por nombre
    searchByName: async (nombre) => {
        try {
            const response = await apiClienteTurnos.get(`/seccionesServicio/buscar?nombre=${encodeURIComponent(nombre)}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al buscar secciones por nombre "${nombre}":`, error);
            throw error;
        }
    },

    // Obtener secciones activas
    getActivas: async () => {
        try {
            const response = await apiClienteTurnos.get('/seccionesServicio/activas');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener secciones activas:', error);
            throw error;
        }
    },

    // Obtener secciones por servicio
    getByServicio: async (servicioId) => {
        try {
            const response = await apiClienteTurnos.get(`/seccionesServicio/servicio/${servicioId}`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`Error al obtener secciones del servicio ${servicioId}:`, error);
            throw error;
        }
    },

    // Cambiar estado de una sección
    cambiarEstado: async (id, estado) => {
        try {
            const response = await apiClienteTurnos.patch(`/seccionesServicio/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado de la sección ${id}:`, error);
            throw error;
        }
    }
};

// Servicio para Servicios
export const serviciosService = {
    // Obtener todos los servicios (para el formulario)
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/servicio');

            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.servicios)) {
                return response.data.servicios;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            // En caso de error, retorna array vacío
            return [];
        }
    },

    // Obtener servicios activos
    getActivos: async () => {
        try {
            const response = await apiClienteTurnos.get('/servicio/activos');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener servicios activos:', error);
            return [];
        }
    }
};

// Utilidades para validación
export const seccionesValidation = {
    // Validar datos de la sección antes de enviar
    validateSeccionData: (data) => {
        const errors = [];

        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push('El nombre de la sección es requerido');
        }

        if (data.nombre && data.nombre.trim().length < 2) {
            errors.push('El nombre de la sección debe tener al menos 2 caracteres');
        }

        if (data.nombre && data.nombre.trim().length > 100) {
            errors.push('El nombre de la sección no puede exceder 100 caracteres');
        }

        if (data.idServicio && isNaN(parseInt(data.idServicio))) {
            errors.push('El ID del servicio debe ser un número válido');
        }

        if (typeof data.estado !== 'boolean') {
            errors.push('El estado debe ser un valor booleano');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Limpiar y formatear datos de la sección
    cleanSeccionData: (data) => {
        return {
            nombre: data.nombre ? data.nombre.trim() : '',
            idServicio: data.idServicio && data.idServicio !== '' ? parseInt(data.idServicio) : null,
            estado: Boolean(data.estado)
        };
    }
};

// Utilidades para obtener información adicional
export const seccionUtils = {
    // Obtener nombre del servicio por ID
    getServicioNombre: (seccion, servicios) => {
        if (seccion.nombreServicio) {
            return seccion.nombreServicio;
        }

        if (seccion.idServicio && servicios) {
            const servicio = servicios.find(s => s.idServicio === seccion.idServicio);
            return servicio ? servicio.nombre : 'Sin servicio';
        }

        return 'Sin servicio';
    },

    // Obtener información completa del servicio
    getServicioInfo: (seccion, servicios) => {
        if (seccion.idServicio && servicios) {
            const servicio = servicios.find(s => s.idServicio === seccion.idServicio);
            if (servicio) {
                return {
                    id: servicio.idServicio,
                    nombre: servicio.nombre
                };
            }
        }

        return {
            id: 'No asignado',
            nombre: 'Sin servicio'
        };
    },

    // Filtrar secciones por criterios específicos
    filtrarSecciones: (secciones, criterio) => {
        if (!secciones || !Array.isArray(secciones)) return [];

        switch (criterio) {
            case 'activas':
                return secciones.filter(s => s.estado === true);
            case 'inactivas':
                return secciones.filter(s => s.estado === false);
            case 'sin_servicio':
                return secciones.filter(s => !s.idServicio);
            default:
                return secciones;
        }
    },

    // Ordenar secciones
    ordenarSecciones: (secciones, campo = 'nombre', orden = 'asc') => {
        if (!secciones || !Array.isArray(secciones)) return [];

        const seccionesOrdenadas = [...secciones];

        seccionesOrdenadas.sort((a, b) => {
            let valorA = a[campo];
            let valorB = b[campo];

            // Manejar valores nulos/undefined
            if (valorA == null) valorA = '';
            if (valorB == null) valorB = '';

            // Convertir a string para comparación
            valorA = valorA.toString().toLowerCase();
            valorB = valorB.toString().toLowerCase();

            if (orden === 'desc') {
                return valorB.localeCompare(valorA);
            }
            return valorA.localeCompare(valorB);
        });

        return seccionesOrdenadas;
    },

    // Obtener estadísticas de secciones
    getEstadisticas: (secciones) => {
        if (!secciones || !Array.isArray(secciones)) {
            return {
                total: 0,
                activas: 0,
                inactivas: 0,
                conServicio: 0,
                sinServicio: 0
            };
        }

        return {
            total: secciones.length,
            activas: secciones.filter(s => s.estado === true).length,
            inactivas: secciones.filter(s => s.estado === false).length,
            conServicio: secciones.filter(s => s.idServicio).length,
            sinServicio: secciones.filter(s => !s.idServicio).length
        };
    }
};

// Exportar servicio principal
export { seccionesService as default };
