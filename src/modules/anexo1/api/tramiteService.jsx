import apiClienteAnexo1 from "./apiClienteAnexo1";

export const listarTramites = async () => {
  const res = await apiClienteAnexo1.get("/tramites");
  return res.data;
};

export const listarTramitesCompletos = async () => {
  const res = await apiClienteAnexo1.get("/tramites/completos");
  return res.data;
};

export const obtenerTramitePorId = async (id) => {
  const res = await apiClienteAnexo1.get(`/tramites/${id}`);
  return res.data;
};

export const crearTramite = async (data) => {
  const res = await apiClienteAnexo1.post("/tramites", data);
  return res.data;
};

export const actualizarTramite = async (id, data) => {
  const res = await apiClienteAnexo1.put(`/tramites/${id}`, data);
  return res.data;
};

export const cambiarEstadoTramite = async (id, estado) => {
  const res = await apiClienteAnexo1.patch(`/tramites/${id}/estado?estado=${estado}`);
  return res.data;
};

export const eliminarTramite = async (id) => {
  await apiClienteAnexo1.delete(`/tramites/${id}`);
};
