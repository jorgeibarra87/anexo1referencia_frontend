import apiClienteTurnos from "./apiClienteTurnos";

// Servicio de reportes
export const apiReporteService = {
    reportes: {
        // Obtener reporte por año, mes y cuadro (ÚNICO ENDPOINT NECESARIO)
        getReporte: async (anio, mes, cuadroId) => {
            const response = await apiClienteTurnos.get(`/reportes/${anio}/${mes}/${cuadroId}`);
            return response.data;
        }
    },

    // Servicios auxiliares para reportes
    auxiliares: {
        // Obtener todos los cuadros de turno (para select)
        getCuadrosTurno: async () => {
            const response = await apiClienteTurnos.get('/cuadro-turnos');
            return Array.isArray(response.data) ? response.data : response.data.cuadros || [];
        },

        // Obtener cuadros activos únicamente
        getCuadrosActivos: async () => {
            const cuadros = await apiReporteService.auxiliares.getCuadrosTurno();
            return cuadros.filter(cuadro => cuadro.estadoCuadro === 'abierto');
        }
    }
};
