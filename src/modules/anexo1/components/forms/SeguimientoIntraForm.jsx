import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostSeguimientoIntra from "../../hooks/usePostSeguimientoIntra";
import { actualizar } from "../../api/seguimientoIntrahospitalarioService";
import Loader from "../../../../components/Loader";

export default function SeguimientoIntraForm({ item, onSaved }) {
  const { data: seguimientoCreado, loading, error, postSeguimiento } = usePostSeguimientoIntra();
  const [tramiteId, setTramiteId] = useState("");

  const token = localStorage.getItem("tokenhusjp");
  let nombreUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nombreUsuario = decoded.name_user || decoded.sub || "";
    } catch {}
  }

  const esEdicion = !!item;
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
    if (!item) return;
    setTramiteId(item.tramiteId || "");
  }, [item]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.tramiteId) {
      toast.error("El ID del trámite es obligatorio");
      return;
    }

    const payload = {
      tramiteId: parseInt(data.tramiteId),
      fechaSeguimiento: data.fechaSeguimiento || new Date().toISOString(),
      prestadorAutorizado: data.prestadorAutorizado,
      numeroAutorizacion: data.numeroAutorizacion,
      estadoAutorizacion: data.estadoAutorizacion || "PENDIENTE",
      auxiliarReferencia: item?.auxiliarReferencia || nombreUsuario,
      observaciones: data.observaciones
    };

    try {
      if (esEdicion) {
        await actualizar(item.id, payload);
      } else {
        await postSeguimiento(payload);
      }
      event.target.reset();
      setTramiteId("");
    } catch {
      toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-grow py-2">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              Seguimiento Intrahospitalario
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID del Trámite:</label>
                <input name="tramiteId" value={tramiteId} onChange={(e) => setTramiteId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number" required disabled={esEdicion} />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Fecha de Seguimiento:</label>
                <input name="fechaSeguimiento" type="datetime-local"
                  defaultValue={esEdicion ? (item.fechaSeguimiento ? new Date(item.fechaSeguimiento).toISOString().slice(0, 16) : fechaActual) : fechaActual}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Número de Autorización:</label>
                <input name="numeroAutorizacion" defaultValue={item?.numeroAutorizacion || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" placeholder="Ingrese autorización" />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Prestador Autorizado:</label>
                <input name="prestadorAutorizado" defaultValue={item?.prestadorAutorizado || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estado de Autorización:</label>
                <select name="estadoAutorizacion" defaultValue={item?.estadoAutorizacion || "PENDIENTE"}
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="AUTORIZADO">AUTORIZADO</option>
                  <option value="NEGADO">NEGADO</option>
                  <option value="EN_TRAMITE">EN TRÁMITE</option>
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Auxiliar de Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={item?.auxiliarReferencia || nombreUsuario} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones:</label>
                <textarea name="observaciones" rows={3} defaultValue={item?.observaciones || ""}
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
        <button type="button" onClick={() => { document.getElementById("segIntraForm").reset(); setTramiteId(""); }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300 ml-4">
          Cancelar
        </button>
      </div>
    </form>
  );
}
