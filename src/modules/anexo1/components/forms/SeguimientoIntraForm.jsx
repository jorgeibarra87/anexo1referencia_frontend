import { faExchangeAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostSeguimientoIntra from "../../hooks/usePostSeguimientoIntra";
import { actualizar } from "../../api/seguimientoIntrahospitalarioService";
import { listarTramites } from "../../api/tramiteService";
import Loader from "../../../../components/Loader";

export default function SeguimientoIntraForm({ item, onSaved }) {
  const { data: seguimientoCreado, loading, error, postSeguimiento } = usePostSeguimientoIntra();
  const [tramites, setTramites] = useState([]);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const esEdicion = !!item;
  const token = localStorage.getItem("tokenhusjp");
  let nombreUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nombreUsuario = decoded.name_user || decoded.sub || "";
    } catch {}
  }

  const fechaActual = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!seguimientoCreado) return;
    toast.success(esEdicion ? "Seguimiento intrahospitalario actualizado con éxito!" : "Seguimiento intrahospitalario guardado con éxito!");
    onSaved?.();
  }, [seguimientoCreado]);

  useEffect(() => {
    if (!error) return;
    toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
  }, [error]);

  useEffect(() => {
    if (!esEdicion) return;
    (async () => {
      try {
        const todos = await listarTramites();
        const encontrado = todos.find(t => t.id === item.tramiteId);
        if (encontrado) setTramiteSeleccionado(encontrado);
      } catch {}
    })();
  }, []);

  const handleBuscarDocumento = async () => {
    if (!busqueda.trim()) {
      toast.info("Ingrese un número de documento");
      return;
    }
    try {
      const todos = await listarTramites();
      const filtrados = todos.filter(t =>
        t.pacienteDocumento && t.pacienteDocumento.includes(busqueda)
      );
      setTramites(filtrados);
      if (filtrados.length === 0) {
        toast.info("No se encontraron trámites para ese documento");
        setTramiteSeleccionado(null);
      } else if (filtrados.length === 1) {
        setTramiteSeleccionado(filtrados[0]);
        toast.success("Trámite encontrado");
      } else {
        setTramiteSeleccionado(null);
        toast.info(`Se encontraron ${filtrados.length} trámites, seleccione uno`);
      }
    } catch {
      toast.error("Error al buscar trámites");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const tramiteId = esEdicion ? item.tramiteId : (tramiteSeleccionado?.id || parseInt(data.tramiteId));
    if (!tramiteId) {
      toast.error("Debe buscar un trámite primero");
      return;
    }

    const payload = {
      tramiteId,
      fechaSeguimiento: data.fechaSeguimiento || new Date().toISOString(),
      autorizacion: data.autorizacion,
      estadoAutorizacion: data.estadoAutorizacion || "PENDIENTE",
      auxiliarReferencia: item?.auxiliarReferencia || nombreUsuario
    };

    try {
      if (esEdicion) {
        await actualizar(item.id, payload);
      } else {
        await postSeguimiento(payload);
      }
      event.target.reset();
      setTramiteSeleccionado(null);
      setTramites([]);
      setBusqueda("");
    } catch {
      toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
    }
  };

  if (loading) return <Loader />;

  return (
    <form id="segIntraForm" onSubmit={handleSubmit}>
      <div className="flex-grow py-2">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Seguimiento Intrahospitalario
            </h3>
          </div>
          <div className="p-6">
            {!esEdicion && (
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Buscar por Documento:</label>
                  <div className="flex items-center">
                    <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="N° documento del paciente" />
                    <button type="button" onClick={handleBuscarDocumento}
                      className="ml-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                      <FontAwesomeIcon icon={faSearch} className="mr-1" />Buscar
                    </button>
                  </div>
                  {tramites.length > 1 && (
                    <select onChange={(e) => {
                      const t = tramites.find(t => t.id === parseInt(e.target.value));
                      setTramiteSeleccionado(t || null);
                    }} className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                      <option value="">Seleccione un trámite...</option>
                      {tramites.map(t => (
                        <option key={t.id} value={t.id}>#{t.id} - {t.fechaTramite ? new Date(t.fechaTramite).toLocaleDateString() : ""}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            {tramiteSeleccionado && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-sm text-blue-800 mb-2">Datos del Trámite</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><span className="font-semibold">ID Trámite:</span> {tramiteSeleccionado.id}</div>
                  <div><span className="font-semibold">Fecha:</span> {tramiteSeleccionado.fechaTramite ? new Date(tramiteSeleccionado.fechaTramite).toLocaleDateString() : ""}</div>
                  <div><span className="font-semibold">Paciente:</span> {tramiteSeleccionado.pacienteNombre || ""}</div>
                  <div><span className="font-semibold">Documento:</span> {tramiteSeleccionado.pacienteDocumento || ""}</div>
                  <div><span className="font-semibold">Ingreso:</span> {tramiteSeleccionado.ingreso || ""}</div>
                  <div><span className="font-semibold">EPS:</span> {tramiteSeleccionado.pacienteEps || ""}</div>
                  <div><span className="font-semibold">Servicio:</span> {tramiteSeleccionado.servicio || ""}</div>
                  <div><span className="font-semibold">Estado:</span> {tramiteSeleccionado.estado || ""}</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Seguimiento:</label>
                <input name="fechaSeguimiento" type="datetime-local"
                  defaultValue={esEdicion ? (item.fechaSeguimiento ? new Date(item.fechaSeguimiento).toISOString().slice(0, 16) : fechaActual) : fechaActual}
                  disabled
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
              </div>

              <div className="w-full md:w-2/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Autorización:</label>
                  <textarea name="autorizacion" rows={3} defaultValue={item?.autorizacion || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Ingrese autorización..." />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estado Autorización:</label>
                <select name="estadoAutorizacion" defaultValue={item?.estadoAutorizacion || "PENDIENTE"}
                  disabled={!esEdicion}
                  className={`border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ${!esEdicion ? "bg-gray-100" : "bg-gray-50 focus:ring-blue-500 focus:border-blue-500"}`}>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="AUTORIZADO">AUTORIZADO</option>
                  <option value="NEGADO">NEGADO</option>
                  <option value="EN_TRAMITE">EN TRÁMITE</option>
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Aux. Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={item?.auxiliarReferencia || nombreUsuario} disabled />
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
        <button type="button" onClick={() => { document.getElementById("segIntraForm").reset(); setTramiteSeleccionado(null); setTramites([]); setBusqueda(""); }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300 ml-4">
          Cancelar
        </button>
      </div>
    </form>
  );
}
