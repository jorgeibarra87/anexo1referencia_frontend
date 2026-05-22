import { faExchangeAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostSeguimientoAmbulatorio from "../../hooks/usePostSeguimientoAmbulatorio";
import useFetchEgresos from "../../hooks/useFetchEgresos";
import { actualizar } from "../../api/seguimientoAmbulatorioService";
import { obtenerTramitePorId } from "../../api/tramiteService";
import Loader from "../../../../components/Loader";

export default function SeguimientoAmbulatorioForm({ item, onSaved }) {
  const { data: seguimientoCreado, loading, error, postSeguimiento } = usePostSeguimientoAmbulatorio();
  const { data: egreso, loading: loadingEgreso, fetchPorTramite } = useFetchEgresos();
  const [tramiteId, setTramiteId] = useState(item?.tramiteId?.toString() || "");
  const [tramiteInfo, setTramiteInfo] = useState(null);
  const [tieneEgreso, setTieneEgreso] = useState(false);

  const esEdicion = !!item;

  const token = localStorage.getItem("tokenhusjp");
  let nombreUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nombreUsuario = decoded.name_user || decoded.sub || "";
    } catch {}
  }

  useEffect(() => {
    if (!esEdicion || !item.tramiteId) return;
    (async () => {
      try {
        const tramite = await obtenerTramitePorId(item.tramiteId);
        setTramiteInfo(tramite);
        const egresoData = await fetchPorTramite(item.tramiteId);
        if (egresoData && egresoData.servicioEgreso) {
          setTieneEgreso(true);
        }
      } catch {}
    })();
  }, []);

  const handleBuscarTramite = async () => {
    if (!tramiteId.trim()) {
      toast.info("Ingrese un ID de trámite");
      return;
    }
    try {
      const tramite = await obtenerTramitePorId(parseInt(tramiteId));
      setTramiteInfo(tramite);

      const egresoData = await fetchPorTramite(parseInt(tramiteId));
      if (egresoData && egresoData.servicioEgreso) {
        setTieneEgreso(true);
        toast.success("Trámite con datos de egreso - puede registrar seguimiento ambulatorio");
      } else {
        setTieneEgreso(false);
        toast.info("Este trámite no tiene datos de egreso. El seguimiento ambulatorio solo aplica para egresados.");
      }
    } catch {
      toast.error("Error al consultar el trámite");
      setTramiteInfo(null);
      setTieneEgreso(false);
    }
  };

  useEffect(() => {
    if (!seguimientoCreado) return;
    toast.success(esEdicion ? "Seguimiento ambulatorio actualizado con éxito!" : "Seguimiento ambulatorio guardado con éxito!");
    onSaved?.();
  }, [seguimientoCreado]);

  useEffect(() => {
    if (!error) return;
    toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.tramiteId || !tieneEgreso) {
      toast.error("Debe buscar un trámite válido con datos de egreso");
      return;
    }

    const payload = {
      tramiteId: parseInt(data.tramiteId),
      fechaNota: new Date().toISOString(),
      notaSeguimiento: data.notaSeguimiento,
      usuario: item?.usuario || nombreUsuario
    };

    try {
      if (esEdicion) {
        await actualizar(item.id, payload);
      } else {
        await postSeguimiento(payload);
      }
      event.target.reset();
      setTramiteId("");
      setTramiteInfo(null);
      setTieneEgreso(false);
    } catch {
      toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
    }
  };

  if (loading || loadingEgreso) return <Loader />;

  return (
    <form id="segAmbulatorioForm" onSubmit={handleSubmit}>
      <div className="flex-grow py-2">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Seguimiento Ambulatorio
            </h3>
          </div>
          <div className="p-6">
            {!tieneEgreso && tramiteId && tramiteInfo && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p><FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  Este trámite no tiene servicio egreso ni fecha egreso. Solo se puede registrar seguimiento ambulatorio a pacientes egresados.
                </p>
              </div>
            )}

            {tieneEgreso && egreso && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p><FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  Paciente egresado - Servicio: {egreso.servicioEgreso} | Fecha: {new Date(egreso.fechaEgreso).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID del Trámite:</label>
                <div className="flex items-center">
                  <input name="tramiteId" value={tramiteId} onChange={(e) => setTramiteId(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number" required disabled={esEdicion} />
                  {!esEdicion && (
                    <button type="button" onClick={handleBuscarTramite}
                      className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                      Buscar
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Usuario:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={item?.usuario || nombreUsuario} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nota de Seguimiento:</label>
                <textarea name="notaSeguimiento" rows={6} defaultValue={item?.notaSeguimiento || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={!tieneEgreso} required />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" disabled={!tieneEgreso}
          className={`font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 transition duration-300 ${tieneEgreso
            ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>
          Guardar
        </button>
        <button type="button" onClick={() => { document.getElementById("segAmbulatorioForm").reset(); setTramiteId(""); setTramiteInfo(null); setTieneEgreso(false); }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300 ml-4">
          Cancelar
        </button>
      </div>
    </form>
  );
}
