import apiClienteTurnos from "./apiClienteTurnos";

export const entidadService = {
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/entidad');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener entidades:', error);
            return [];
        }
    },

    getById: async (id) => {
        const response = await apiClienteTurnos.get(`/entidad/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClienteTurnos.post('/entidad', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClienteTurnos.put(`/entidad/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await apiClienteTurnos.delete(`/entidad/${id}`);
    }
};
