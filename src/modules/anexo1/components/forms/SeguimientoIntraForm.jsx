import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostSeguimientoIntra from "../../hooks/usePostSeguimientoIntra";
import Loader from "../../../../components/Loader";

export default function SeguimientoIntraForm() {
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

  const fechaActual = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!seguimientoCreado) return;
    toast.success("Seguimiento intrahospitalario guardado con éxito!");
  }, [seguimientoCreado]);

  useEffect(() => {
    if (!error) return;
    toast.error("Error al guardar el seguimiento");
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.tramiteId) {
      toast.error("El ID del trámite es obligatorio");
      return;
    }

    try {
      await postSeguimiento({
        tramiteId: parseInt(data.tramiteId),
        fechaSeguimiento: data.fechaSeguimiento || new Date().toISOString(),
        prestadorAutorizado: data.prestadorAutorizado,
        numeroAutorizacion: data.numeroAutorizacion,
        estadoAutorizacion: data.estadoAutorizacion || "PENDIENTE",
        auxiliarReferencia: nombreUsuario,
        observaciones: data.observaciones
      });
      event.target.reset();
      setTramiteId("");
    } catch {
      toast.error("Error al guardar el seguimiento");
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
                  type="number" required />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Fecha de Seguimiento:</label>
                <input name="fechaSeguimiento" type="datetime-local" defaultValue={fechaActual}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Número de Autorización:</label>
                <input name="numeroAutorizacion"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" placeholder="Ingrese autorización" />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Prestador Autorizado:</label>
                <input name="prestadorAutorizado"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text" />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estado de Autorización:</label>
                <select name="estadoAutorizacion"
                  className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="AUTORIZADO">AUTORIZADO</option>
                  <option value="NEGADO">NEGADO</option>
                  <option value="EN_TRAMITE">EN TRÁMITE</option>
                </select>

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Auxiliar de Referencia:</label>
                <input className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={nombreUsuario} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones:</label>
                <textarea name="observaciones" rows={3}
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
