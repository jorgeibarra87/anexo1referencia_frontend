import apiClienteAnexo1 from "./apiClienteAnexo1";

export const listarPorTramite = async (tramiteId) => {
  const res = await apiClienteAnexo1.get(`/seguimientos-ambulatorios/tramite/${tramiteId}`);
  return res.data;
};

export const obtenerPorId = async (id) => {
  const res = await apiClienteAnexo1.get(`/seguimientos-ambulatorios/${id}`);
  return res.data;
};

export const crear = async (data) => {
  const res = await apiClienteAnexo1.post("/seguimientos-ambulatorios", data);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await apiClienteAnexo1.put(`/seguimientos-ambulatorios/${id}`, data);
  return res.data;
};

export const eliminar = async (id) => {
  await apiClienteAnexo1.delete(`/seguimientos-ambulatorios/${id}`);
};
