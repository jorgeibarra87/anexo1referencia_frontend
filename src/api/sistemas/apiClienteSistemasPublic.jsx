import axios from 'axios';

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicioSistemas = window.env.VITE_URL_SISTEMAS;

const apiClienteSistemasPublic = axios.create({
  baseURL: `${ruta}${rutamicroservicioSistemas}/`,
  headers: {
    'X-Public-Route': 'true',
  },
});

export default apiClienteSistemasPublic;
