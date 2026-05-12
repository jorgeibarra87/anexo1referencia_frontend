import axios from "axios";

const ruta = window.env.VITE_URL_API_GATEWAY;
const rutamicroservicioDinamica = window.env.VITE_URL_DINAMICA;

const apiClienteDinamicaPublica = axios.create({
  baseURL: `${ruta}${rutamicroservicioDinamica}/`,
  headers: {
    'X-Public-Route': 'true',
  }
});

export default apiClienteDinamicaPublica;
