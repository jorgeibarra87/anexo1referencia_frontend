import axios from "axios";
// IMPORTAR CLAVES ENV DE VITE 
 const ruta = window.env.VITE_URL_API_GATEWAY
 const rutamicroservicioauth = window.env.VITE_URL_AUTH

 const apiClientAuthServicePublic = axios.create({
    baseURL: `${ruta}${rutamicroservicioauth}/`,
    headers: {
        'X-Public-Route': 'true',
    },
 });

 export default apiClientAuthServicePublic;