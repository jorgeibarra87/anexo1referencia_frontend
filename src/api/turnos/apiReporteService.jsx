import apiClienteTurnos from "./apiClienteTurnos";

const getBaseUrl = () => {
    const baseURL = apiClienteTurnos.defaults?.baseURL || window.env.VITE_URL_API_GATEWAY;
    return baseURL.replace(/\/+$/, '');
};

// Servicio de reportes
export const apiReporteService = {
    reportes: {
        // Obtener reporte por año, mes y cuadro (ÚNICO ENDPOINT NECESARIO)
        getReporte: async (anio, mes, cuadroId) => {
            const response = await apiClienteTurnos.get(`/reportes/${anio}/${mes}/${cuadroId}`);
            return response.data;
        },

        // Descargar Excel avanzado (con gráfico) del backend
        descargarExcel: (anio, mes, cuadroId) => {
            const url = `${getBaseUrl()}/reportes/${anio}/${mes}/${cuadroId}/excel`;
            const link = document.createElement('a');
            link.href = url;
            link.download = `ReporteTurnos_${anio}_${mes}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
