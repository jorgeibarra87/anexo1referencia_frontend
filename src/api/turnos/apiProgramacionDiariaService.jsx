import apiClienteTurnos from "./apiClienteTurnos";

export const apiProgramacionDiariaService = {
    obtenerMatriz: async (idCuadroTurno) => {
        const response = await apiClienteTurnos.get(`/programacion-diaria/cuadro/${idCuadroTurno}`);
        return response.data;
    },

    guardarMatriz: async (idCuadroTurno, celdas) => {
        const response = await apiClienteTurnos.post(`/programacion-diaria/cuadro/${idCuadroTurno}`, {
            idCuadroTurno,
            celdas
        });
        return response.data;
    },

    actualizarCelda: async (idCuadroTurno, idPersona, diaMes, codigoJornada, observacion) => {
        const response = await apiClienteTurnos.put(`/programacion-diaria/cuadro/${idCuadroTurno}/celda`, {
            idPersona,
            diaMes,
            codigoJornada,
            observacion
        });
        return response.data;
    },

    eliminarMatriz: async (idCuadroTurno) => {
        await apiClienteTurnos.delete(`/programacion-diaria/cuadro/${idCuadroTurno}`);
    },

    generarTurnos: async (idCuadroTurno) => {
        const response = await apiClienteTurnos.post(`/programacion-diaria/cuadro/${idCuadroTurno}/generar-turnos`);
        return response.data;
    },

    importarExcel: async (idCuadroTurno, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClienteTurnos.post(`/importar/excel/${idCuadroTurno}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000
        });
        return response.data;
    },

    validarExcel: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClienteTurnos.post('/importar/excel/validar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    descargarPlantilla: (diasDelMes = 31) => {
        const baseUrl = (apiClienteTurnos.defaults?.baseURL || window.env.VITE_URL_API_GATEWAY).replace(/\/+$/, '');
        return `${baseUrl}/plantilla/excel?dias=${diasDelMes}`;
    },

    importarCompleto: async (file, params) => {
        const formData = new FormData();
        formData.append('file', file);
        Object.entries(params).forEach(([key, val]) => {
            if (val !== null && val !== undefined && val !== '') {
                formData.append(key, val);
            }
        });
        const response = await apiClienteTurnos.post('/importar/completo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 180000
        });
        return response.data;
    }
};
