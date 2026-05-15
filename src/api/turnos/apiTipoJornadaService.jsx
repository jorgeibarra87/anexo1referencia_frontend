import apiClienteTurnos from "./apiClienteTurnos";

export const apiTipoJornadaService = {
    getAll: async () => {
        const response = await apiClienteTurnos.get('/tipo-jornada');
        return response.data || [];
    },
    getTrabajo: async () => {
        const response = await apiClienteTurnos.get('/tipo-jornada/trabajo');
        return response.data || [];
    },
    getDescanso: async () => {
        const response = await apiClienteTurnos.get('/tipo-jornada/descanso');
        return response.data || [];
    },
    getByCodigo: async (codigo) => {
        const response = await apiClienteTurnos.get(`/tipo-jornada/${codigo}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClienteTurnos.post('/tipo-jornada', data);
        return response.data;
    },
    update: async (codigo, data) => {
        const response = await apiClienteTurnos.put(`/tipo-jornada/${codigo}`, data);
        return response.data;
    },
    delete: async (codigo) => {
        await apiClienteTurnos.delete(`/tipo-jornada/${codigo}`);
    }
};
