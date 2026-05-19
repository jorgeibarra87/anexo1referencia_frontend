import apiClienteTurnos from "./apiClienteTurnos";

export const tipoPersonalService = {
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get('/tipo-personal');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error al obtener tipos de personal:', error);
            return [];
        }
    },

    getById: async (id) => {
        const response = await apiClienteTurnos.get(`/tipo-personal/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClienteTurnos.post('/tipo-personal', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClienteTurnos.put(`/tipo-personal/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await apiClienteTurnos.delete(`/tipo-personal/${id}`);
    }
};
