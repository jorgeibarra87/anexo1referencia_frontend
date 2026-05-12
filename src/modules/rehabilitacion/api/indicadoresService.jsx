import apiClientRehabilitacion from "./apiClientRehabilitacion";

// crear una peticion post que reciba data y envie usando apiClienteRehabilitacion a la ruta filtro
export const obtenerIndicadores = async (data) => {
  try {
    const response = await apiClientRehabilitacion.post('estado/finalizado', data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores:', error);
    throw error;
  }
};


export const obtenerEspecialidadesRehabilitacion = async () => {
  try {
    const response = await apiClientRehabilitacion.get('especialidades');
    return response.data;
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    throw error;
  }
};