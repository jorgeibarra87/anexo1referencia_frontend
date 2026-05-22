import { faCheckCircle, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostTramite from "../../hooks/usePostTramite";
import useFetchTipoSolicitudCatalogo from "../../hooks/useFetchTipoSolicitudCatalogo";
import { actualizarTramite } from "../../api/tramiteService";
import Loader from "../../../../components/Loader";

export default function TramiteForm({ tramite, onSaved }) {
  const { data: tiposSolicitud, loading: loadingTipos } = useFetchTipoSolicitudCatalogo();
  const { data: tramiteCreado, loading: loadingPost, error: errorPost, postTramite } = usePostTramite();
  const [infoPaciente, setInfoPaciente] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const token = localStorage.getItem("tokenhusjp");
  let nombreUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nombreUsuario = decoded.name_user || decoded.sub || "";
    } catch {}
  }

  const auxiliarReferenciaDefault = nombreUsuario;
  const esEdicion = !!tramite;

  useEffect(() => {
    if (!tramiteCreado) return;
    toast.success(esEdicion ? "Trámite actualizado con éxito!" : "Trámite guardado con éxito!");
    onSaved?.();
  }, [tramiteCreado]);

  useEffect(() => {
    if (!errorPost) return;
    toast.error("Error al guardar el trámite");
  }, [errorPost]);

  useEffect(() => {
    if (!tramite) return;
    setInfoPaciente({
      id: tramite.pacienteId,
      eps: tramite.eps || "",
      servicioOrigen: tramite.servicioOrigen || "",
      nombreCompleto: tramite.pacienteNombre || "",
    });
  }, [tramite]);

  const handleSearchDocumento = async () => {
    if (!busqueda.trim()) {
      toast.info("Ingrese un número de documento");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8086/api/dinamica/genpacien/${busqueda}`);
      const data = await response.json();
      if (data && data.pacNumDoc) {
        setInfoPaciente({
          tipoDocumento: "CC",
          numeroDocumento: data.pacNumDoc,
          nombreCompleto: `${data.pacPriNom || ""} ${data.pacSegNom || ""} ${data.pacPriApe || ""} ${data.pacSegApe || ""}`.trim(),
          eps: data.pacCodEmp || "",
          ingreso: data.ainIngreso || "",
          servicioOrigen: data.ainSerProce || ""
        });
        toast.success("Información del paciente cargada");
      } else {
        toast.info("No se encontró información para ese documento");
      }
    } catch {
      toast.error("Error al consultar la información del paciente");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.numeroTramite || (!esEdicion && !data.pacienteId)) {
      toast.error(esEdicion ? "El número de trámite es obligatorio" : "Debe buscar un paciente antes de guardar");
      return;
    }

    console.log("Datos del formulario:", data);

    const payload = {
      numeroTramite: data.numeroTramite,
      pacienteId: esEdicion ? tramite.pacienteId : parseInt(data.pacienteId),
      Ingreso: data.Ingreso || null,
      servicio: data.servicio || null,
      tipoSolicitudId: data.tipoSolicitudId ? parseInt(data.tipoSolicitudId) : null,
      descripcion: data.descripcion,
      estado: data.estado || "PENDIENTE",
      auxiliarReferencia: auxiliarReferenciaDefault
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
    <form onSubmit={handleSubmit}>
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
                {!esEdicion ? (
                  <>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Documento:</label>
                    <div className="flex items-center">
                      <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="123456789" />
                      <button type="button" onClick={handleSearchDocumento}
                        className="flex-shrink-0 text-blue-500 hover:text-blue-700 ml-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">Editando trámite existente</p>
                )}

                {infoPaciente && (
                  <>
                    <input type="hidden" name="pacienteId" value={infoPaciente.id} />
                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">EPS:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={infoPaciente.eps || ""} disabled />

                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Servicio:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={infoPaciente.servicio || ""} disabled />
                  </>
                )}
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                {infoPaciente && (
                  <>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={infoPaciente.nombreCompleto || ""} disabled />
                  </>
                )}

                {/* <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Número de Trámite:</label>
                <input name="numeroTramite" defaultValue={tramite?.numeroTramite || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" required /> */}

                <label className="block text-gray-700 text-sm font-bold mb-2">Ingreso:</label>
                <input name="Ingreso" defaultValue={tramite?.Ingreso || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" disabled/>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Solicitud:</label>
                <select name="tipoSolicitudId" defaultValue={tramite?.tipoSolicitudId || ""}
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">Seleccione...</option>
                  {tiposSolicitud.map((ts) => (
                    <option key={ts.id} value={ts.id}>{ts.descripcion}</option>
                  ))}
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Estado:</label>
                <select name="estado" defaultValue={tramite?.estado || "PENDIENTE"}
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN_PROCESO">EN PROCESO</option>
                  <option value="CERRADO">CERRADO</option>
                  <option value="ANULADO">ANULADO</option>
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Auxiliar de Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={tramite?.auxiliarReferencia || auxiliarReferenciaDefault} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                <textarea name="descripcion" rows={4} defaultValue={tramite?.descripcion || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300">
          Guardar
        </button>
        <button type="button" onClick={() => { document.getElementById("tramiteForm").reset(); setInfoPaciente(null); setBusqueda(""); }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300 ml-4">
          Cancelar
        </button>
      </div>
    </form>
  );
}
