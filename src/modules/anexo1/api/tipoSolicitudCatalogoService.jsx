import apiClienteAnexo1 from "./apiClienteAnexo1";

export const listarTodos = async () => {
  const res = await apiClienteAnexo1.get("/tipos-solicitud");
  return res.data;
};

export const listarActivos = async () => {
  const res = await apiClienteAnexo1.get("/tipos-solicitud/activos");
  return res.data;
};
