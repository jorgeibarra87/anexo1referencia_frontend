import apiClienteTurnos from "./apiClienteTurnos";

// Servicios para PERSONAS
export const personasService = {
    getAll: async () => {
        try {
            const response = await apiClienteTurnos.get("/persona");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar personas: ${error.response?.data?.message || error.message}`);
        }
    },

    getById: async (id) => {
        try {
            const response = await apiClienteTurnos.get(`/persona/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar persona con ID ${id}: ${error.response?.data?.message || error.message}`);
        }
    },

    create: async (personaData) => {
        try {
            const response = await apiClienteTurnos.post("/persona", personaData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al crear persona: ${error.response?.data?.message || error.message}`);
        }
    },

    update: async (id, personaData) => {
        try {
            const response = await apiClienteTurnos.put(`/persona/${id}`, personaData);
            return response.data;
        } catch (error) {
            throw new Error(`Error al actualizar persona: ${error.response?.data?.message || error.message}`);
        }
    },

    delete: async (id) => {
        try {
            const response = await apiClienteTurnos.delete(`/persona/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 409) {
                throw new Error('No se puede eliminar la persona porque tiene dependencias asociadas');
            } else if (error.response?.status === 404) {
                throw new Error('La persona no fue encontrada');
            }
            throw new Error(`Error al eliminar persona: ${error.response?.data?.message || error.message}`);
        }
    }
};

export const personasTitulosService = {
    getUsuariosTitulos: async () => {
        try {
            const response = await apiClienteTurnos.get("/persona/titulos");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar usuarios títulos: ${error.response?.data?.message || error.message}`);
        }
    },

    getTitulos: async () => {
        try {
            const response = await apiClienteTurnos.get("/titulosFormacionAcademica");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar títulos: ${error.response?.data?.message || error.message}`);
        }
    },

    addTituloToPersona: async (personaId, tituloId) => {
        try {
            const response = await apiClienteTurnos.post(`/persona/${personaId}/titulo/${tituloId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al agregar título a persona: ${error.response?.data?.message || error.message}`);
        }
    },

    removeTituloFromPersona: async (personaId, tituloId) => {
        try {
            const response = await apiClienteTurnos.delete(`/persona/${personaId}/titulo/${tituloId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al eliminar relación persona-título: ${error.response?.data?.message || error.message}`);
        }
    }
};

export const personasRolesService = {
    getUsuariosRoles: async () => {
        try {
            const response = await apiClienteTurnos.get("/persona/roles");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar usuarios roles: ${error.response?.data?.message || error.message}`);
        }
    },

    getRoles: async () => {
        try {
            const response = await apiClienteTurnos.get("/roles");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar roles: ${error.response?.data?.message || error.message}`);
        }
    },

    addRolToPersona: async (personaId, rolId) => {
        try {
            const response = await apiClienteTurnos.post(`/persona/${personaId}/rol/${rolId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al agregar rol a persona: ${error.response?.data?.message || error.message}`);
        }
    },

    removeRolFromPersona: async (personaId, rolId) => {
        try {
            const response = await apiClienteTurnos.delete(`/persona/${personaId}/rol/${rolId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al eliminar relación persona-rol: ${error.response?.data?.message || error.message}`);
        }
    }
};

export const personasEquiposService = {
    getUsuariosEquipos: async () => {
        try {
            const response = await apiClienteTurnos.get("/persona/equipos");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar usuarios equipos: ${error.response?.data?.message || error.message}`);
        }
    },

    getEquipos: async () => {
        try {
            const response = await apiClienteTurnos.get("/equipo");
            return response.data;
        } catch (error) {
            throw new Error(`Error al cargar equipos: ${error.response?.data?.message || error.message}`);
        }
    },

    addEquipoToPersona: async (personaId, equipoId) => {
        try {
            const response = await apiClienteTurnos.post(`/persona/${personaId}/equipo/${equipoId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al agregar equipo a persona: ${error.response?.data?.message || error.message}`);
        }
    },

    removeEquipoFromPersona: async (personaId, equipoId) => {
        try {
            const response = await apiClienteTurnos.delete(`/persona/${personaId}/equipo/${equipoId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al eliminar relación persona-equipo: ${error.response?.data?.message || error.message}`);
        }
    }
};

export const apiPersonasService = {
    personas: personasService,
    personasTitulos: personasTitulosService,
    personasRoles: personasRolesService,
    personasEquipos: personasEquiposService
};

export default apiPersonasService;
