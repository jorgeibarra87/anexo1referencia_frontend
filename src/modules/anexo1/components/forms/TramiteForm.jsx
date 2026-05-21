import { faCheckCircle, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { obtenerPacientePorId } from "../../api/pacienteService";
import usePostTramite from "../../hooks/usePostTramite";
import useFetchTipoSolicitudCatalogo from "../../hooks/useFetchTipoSolicitudCatalogo";
import Loader from "../../../../components/Loader";

export default function TramiteForm() {
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

  useEffect(() => {
    if (!tramiteCreado) return;
    toast.success("Trámite guardado con éxito!");
  }, [tramiteCreado]);

  useEffect(() => {
    if (!errorPost) return;
    toast.error("Error al guardar el trámite");
  }, [errorPost]);

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

    if (!data.numeroTramite || !data.pacienteId) {
      toast.error("Debe buscar un paciente antes de guardar");
      return;
    }

    try {
      await postTramite({
        numeroTramite: data.numeroTramite,
        pacienteId: parseInt(data.pacienteId),
        tipoIngreso: data.tipoIngreso || null,
        servicioOrigen: data.servicioOrigen,
        tipoSolicitudId: data.tipoSolicitudId ? parseInt(data.tipoSolicitudId) : null,
        descripcion: data.descripcion,
        estado: data.estado || "PENDIENTE",
        auxiliarReferencia: auxiliarReferenciaDefault
      });
      event.target.reset();
      setInfoPaciente(null);
      setBusqueda("");
    } catch {
      toast.error("Error al guardar el trámite");
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

                {infoPaciente && (
                  <>
                    <input type="hidden" name="pacienteId" value={infoPaciente.id} />
                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">EPS:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={infoPaciente.eps || ""} disabled />

                    <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Servicio Origen:</label>
                    <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" value={infoPaciente.servicioOrigen || ""} disabled />
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

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Número de Trámite:</label>
                <input name="numeroTramite"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" required />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Tipo de Ingreso:</label>
                <select name="tipoIngreso"
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">Seleccione...</option>
                  <option value="URGENCIAS">URGENCIAS</option>
                  <option value="HOSPITALIZACION">HOSPITALIZACION</option>
                  <option value="CONSULTA_EXTERNA">CONSULTA EXTERNA</option>
                  <option value="CIRUGIA">CIRUGIA</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Solicitud:</label>
                <select name="tipoSolicitudId"
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">Seleccione...</option>
                  {tiposSolicitud.map((ts) => (
                    <option key={ts.id} value={ts.id}>{ts.descripcion}</option>
                  ))}
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Estado:</label>
                <select name="estado"
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN_PROCESO">EN PROCESO</option>
                  <option value="CERRADO">CERRADO</option>
                  <option value="ANULADO">ANULADO</option>
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Auxiliar de Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={auxiliarReferenciaDefault} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                <textarea name="descripcion" rows={4}
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
