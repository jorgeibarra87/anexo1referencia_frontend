import apiClienteAnexo1 from "./apiClienteAnexo1";

export const listarPacientes = async () => {
  const res = await apiClienteAnexo1.get("/pacientes");
  return res.data;
};

export const obtenerPacientePorId = async (id) => {
  const res = await apiClienteAnexo1.get(`/pacientes/${id}`);
  return res.data;
};

export const crearPaciente = async (data) => {
  const res = await apiClienteAnexo1.post("/pacientes", data);
  return res.data;
};

export const actualizarPaciente = async (id, data) => {
  const res = await apiClienteAnexo1.put(`/pacientes/${id}`, data);
  return res.data;
};

export const eliminarPaciente = async (id) => {
  await apiClienteAnexo1.delete(`/pacientes/${id}`);
};
