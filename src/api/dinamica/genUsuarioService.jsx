import apiClienteDinamica from './apiClienteDinamica';
import apiClienteDinamicaPublica from './apiClienteDinamicaPublica';

export const obtenerInfoGenUsuario = async (username) => {
  try {
    const response = await apiClienteDinamica.get(`/genusuario/info/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información del usuario', error);
    throw error;
  }
};

export const obtenerInfoContactoGenUsuarioPublic = async (username) => {
  try {
    const response = await apiClienteDinamicaPublica.get(`/genusuario/datosdecontacto/${username}/public`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información de contacto del usuario', error);
    throw error;
  }
};
