import { faCheckCircle, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostTramite from "../../hooks/usePostTramite";
import useFetchTipoSolicitudCatalogo from "../../hooks/useFetchTipoSolicitudCatalogo";
import { actualizarTramite } from "../../api/tramiteService";
import { listarPacientes, crearPaciente } from "../../api/pacienteService";
import Loader from "../../../../components/Loader";

export default function TramiteForm({ tramite, onSaved }) {
  const { data: tiposSolicitud, loading: loadingTipos } = useFetchTipoSolicitudCatalogo();
  const { data: tramiteCreado, loading: loadingPost, error: errorPost, postTramite } = usePostTramite();
  const [infoPaciente, setInfoPaciente] = useState(tramite ? {
    id: tramite.pacienteId,
    tipoDocumento: "CC",
    numeroDocumento: tramite.pacienteDocumento || "",
    nombreCompleto: tramite.pacienteNombre || "",
    eps: tramite.pacienteEps || "",
    ingreso: "",
    servicio: tramite.servicio || ""
  } : null);
  const [busqueda, setBusqueda] = useState("");

  const token = localStorage.getItem("tokenhusjp");
  let nombreUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nombreUsuario = decoded.name_user || decoded.sub || "";
    } catch {}
  }

  const esEdicion = !!tramite;
  const fechaActual = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!tramiteCreado) return;
    toast.success(esEdicion ? "Trámite actualizado con éxito!" : "Trámite guardado con éxito!");
    onSaved?.();
  }, [tramiteCreado]);

  useEffect(() => {
    if (!errorPost) return;
    toast.error(esEdicion ? "Error al actualizar el trámite" : "Error al guardar el trámite");
  }, [errorPost]);

  useEffect(() => {
    if (!tramite) return;
    setInfoPaciente({
      id: tramite.pacienteId,
      tipoDocumento: "CC",
      numeroDocumento: tramite.pacienteDocumento || "",
      nombreCompleto: tramite.pacienteNombre || "",
      eps: tramite.pacienteEps || "",
      ingreso: tramite.ingreso || "",
      servicio: tramite.servicio || ""
    });
  }, [tramite]);

  const MOCK_PACIENTES = [
    { documento: "123456789", nombre: "JUAN PÉREZ GÓMEZ", eps: "SALUD TOTAL", ingreso: "2025001", servicio: "URGENCIAS" },
    { documento: "987654321", nombre: "MARÍA LÓPEZ RODRÍGUEZ", eps: "NUEVA EPS", ingreso: "2025002", servicio: "HOSPITALIZACIÓN" },
    { documento: "111222333", nombre: "CARLOS ANDRÉS RAMÍREZ", eps: "SANITAS", ingreso: "2025003", servicio: "CIRUGÍA" },
    { documento: "444555666", nombre: "ANA MILENA TORRES", eps: "SALUD TOTAL", ingreso: "2025004", servicio: "CONSULTA EXTERNA" },
    { documento: "777888999", nombre: "PEDRO ANTONIO CASTRO", eps: "COMPENSAR", ingreso: "2025005", servicio: "URGENCIAS" },
    { documento: "222333444", nombre: "DIANA PATRICIA ROJAS", eps: "SUSALUD", ingreso: "2025006", servicio: "HOSPITALIZACIÓN" },
    { documento: "555666777", nombre: "JOSÉ MANUEL DÍAZ", eps: "FAMISANAR", ingreso: "2025007", servicio: "CUIDADO INTENSIVO" },
    { documento: "888999000", nombre: "LAURA VALENTINA MEJÍA", eps: "NUEVA EPS", ingreso: "2025008", servicio: "OBSERVACIÓN" },
    { documento: "333444555", nombre: "LUIS ALBERTO MORA", eps: "SANITAS", ingreso: "2025009", servicio: "URGENCIAS" },
    { documento: "666777888", nombre: "SOFÍA ALEJANDRA GARCÍA", eps: "SALUD TOTAL", ingreso: "2025010", servicio: "HOSPITALIZACIÓN" },
  ];

  const registrarPaciente = async (pacData) => {
    try {
      const todos = await listarPacientes();
      const existente = todos.find(p => p.numeroDocumento === pacData.numeroDocumento);
      if (existente) return existente.id;
    } catch {}
    try {
      const creado = await crearPaciente({
        tipoDocumento: "CC",
        numeroDocumento: pacData.numeroDocumento,
        nombreCompleto: pacData.nombreCompleto,
        eps: pacData.eps
      });
      return creado.id;
    } catch (e) {
      console.error("Error al crear paciente:", e);
      return null;
    }
  };

  const handleSearchDocumento = async () => {
    if (!busqueda.trim()) {
      toast.info("Ingrese un número de documento");
      return;
    }
    let pacData = null;
    try {
      
      const response = await fetch(`http://optimus:8000/dinamica-microservice/genPacien/informacion/egreso/${busqueda}`);
      //const response = await fetch(`http://localhost:8081/api/dinamica/genpacien/${busqueda}`);
      const data = await response.json();
      if (data && data.pacNumDoc) {
        pacData = {
          tipoDocumento: "CC",
          numeroDocumento: data.pacNumDoc,
          nombreCompleto: `${data.pacPriNom || ""} ${data.pacSegNom || ""} ${data.pacPriApe || ""} ${data.pacSegApe || ""}`.trim(),
          eps: data.pacCodEmp || "",
          ingreso: data.ainIngreso || "",
          servicio: data.ainSerProce || ""
        };
      }
    } catch {}
    if (!pacData) {
      const mock = MOCK_PACIENTES.find(p => p.documento === busqueda.trim());
      if (mock) {
        pacData = {
          tipoDocumento: "CC",
          numeroDocumento: mock.documento,
          nombreCompleto: mock.nombre,
          eps: mock.eps,
          ingreso: mock.ingreso,
          servicio: mock.servicio
        };
      }
    }
    if (!pacData) {
      toast.info("No se encontró información para ese documento");
      return;
    }
    const id = await registrarPaciente(pacData);
    setInfoPaciente({ ...pacData, id });
    toast.success(id ? "Información del paciente cargada" : "Paciente cargado (sin registro en BD)");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!esEdicion && !infoPaciente?.numeroDocumento) {
      toast.error("Debe buscar un paciente antes de guardar");
      return;
    }

    const payload = {
      pacienteId: esEdicion ? tramite.pacienteId : infoPaciente?.id,
      ingreso: data.ingreso || null,
      servicio: esEdicion ? data.servicio : (infoPaciente?.servicio || data.servicio || null),
      tipoSolicitudId: data.tipoSolicitudId ? parseInt(data.tipoSolicitudId) : null,
      descripcion: data.descripcion,
      estado: "PENDIENTE",
      auxiliarReferencia: tramite?.auxiliarReferencia || nombreUsuario
    };

    try {
      if (esEdicion) {
        await actualizarTramite(tramite.id, payload);
      } else {
        await postTramite(payload);
      }
      event.target.reset();
      setInfoPaciente(null);
      setBusqueda("");
    } catch {
      toast.error(esEdicion ? "Error al actualizar el trámite" : "Error al guardar el trámite");
    }
  };

  if (loadingTipos || loadingPost) return <Loader />;

  return (
    <form id="tramiteForm" onSubmit={handleSubmit}>
      <div className="flex-grow py-2">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Inicio de Trámite - Anexo 1
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6">
                {esEdicion && (
                  <>
                    <label className="block text-gray-700 text-sm font-bold mb-2">ID Trámite:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={tramite?.id || ""} disabled />
                  </>
                )}

                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Trámite:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={tramite?.fechaTramite ? new Date(tramite.fechaTramite).toLocaleString() : new Date().toLocaleString()} disabled />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Documento:</label>
                {!esEdicion ? (
                  <div className="flex items-center">
                    <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="123456789" />
                    <button type="button" onClick={handleSearchDocumento}
                      className="flex-shrink-0 text-blue-500 hover:text-blue-700 ml-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                    </button>
                  </div>
                ) : (
                  <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={infoPaciente?.numeroDocumento || ""} disabled />
                )}

                {infoPaciente && (
                  <>
                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Nombre Completo:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={infoPaciente.nombreCompleto || ""} disabled />
                  </>
                )}
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                {infoPaciente && (
                  <>
                    <label className="block text-gray-700 text-sm font-bold mb-2">EPS:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={infoPaciente.eps || ""} disabled />

                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">N° Ingreso:</label>
                    <input name="ingreso" className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={infoPaciente.ingreso || ""} readOnly />

                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Servicio:</label>
                    <input name="servicio" defaultValue={infoPaciente.servicio || ""}
                      className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readOnly />
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Solicitud:</label>
                <select name="tipoSolicitudId" defaultValue={tramite?.tipoSolicitudId || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">Seleccione...</option>
                  {tiposSolicitud.map((ts) => (
                    <option key={ts.id} value={ts.id}>{ts.descripcion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                <textarea name="descripcion" rows={4} defaultValue={tramite?.descripcion || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Aux. Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={tramite?.auxiliarReferencia || nombreUsuario} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300">
          {esEdicion ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
