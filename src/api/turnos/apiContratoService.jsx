import apiClienteTurnos from "./apiClienteTurnos";

// Servicio de contratos
export const apiService = {
    contratos: {
        // Obtener todos los contratos
        getAll: async () => {
            const response = await apiClienteTurnos.get('/contrato');
            return Array.isArray(response.data) ? response.data : response.data.contratos || [];
        },

        // Obtener contrato por ID
        getById: async (id) => {
            const response = await apiClienteTurnos.get(`/contrato/${id}`);
            return response.data;
        },

        // Obtener especialidades de un contrato
        getEspecialidades: async (contratoId) => {
            const response = await apiClienteTurnos.get(`/contrato/${contratoId}/titulos`);
            return response.data || [];
        },

        // Obtener procesos de un contrato
        getProcesos: async (contratoId) => {
            const response = await apiClienteTurnos.get(`/contrato/${contratoId}/procesos`);
            return response.data || [];
        },

        // Crear contrato
        create: async (contrato) => {
            const response = await apiClienteTurnos.post('/contrato', contrato);
            return response.data;
        },

        // Actualizar contrato
        update: async (id, contrato) => {
            const response = await apiClienteTurnos.put(`/contrato/${id}`, contrato);
            return response.data;
        },

        // Eliminar contrato
        delete: async (id) => {
            const response = await apiClienteTurnos.delete(`/contrato/${id}`);
            return response.data;
        },

        // Obtener contrato completo (para VerContrato)
        getContratoCompleto: async (id) => {
            const response = await apiClienteTurnos.get(`/contrato/contratoTotal/${id}`);
            return response.data;
        },

        // Crear contrato con elementos relacionados (para CrearContrato)
        createCompleto: async (contratoData) => {
            const response = await apiClienteTurnos.post('/contrato/guardar', contratoData);
            return response.data;
        },

        // Actualizar contrato con elementos relacionados (para CrearContrato)
        updateCompleto: async (id, contratoData) => {
            const response = await apiClienteTurnos.put(`/contrato/actualizar/${id}`, contratoData);
            return response.data;
        },

        // Obtener especialidades disponibles
        getTitulosFormacionAcademica: async () => {
            const response = await apiClienteTurnos.get('/titulosFormacionAcademica');
            return response.data || [];
        },

        // Obtener procesos disponibles
        getProcesosDisponibles: async () => {
            const response = await apiClienteTurnos.get('/procesos');
            return response.data || [];
        }
    }
};
