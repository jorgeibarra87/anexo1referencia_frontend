import apiClienteSistemasPublic from "./apiClienteSistemasPublic";

export const crearSolicitudRecuperacionContrasenaByEmail = async (username, reenviar) => {
  try {
    const response = await apiClienteSistemasPublic.post(`/solicitud-recuperacion-password/crear/by-email?username=${username}&reenviar=${reenviar}`);
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud de recuperación de contraseña', error);
    throw error;
  }
};

export const cerrarSolicitudRecuperacionContrasena = async (data) => {
  try {
    const response = await apiClienteSistemasPublic.put(`/solicitud-recuperacion-password/cerrar`, data);
    return response.data;
  } catch (error) {
    console.error('Error al cerrar la solicitud de recuperación de contraseña', error);
    throw error;
  }
};