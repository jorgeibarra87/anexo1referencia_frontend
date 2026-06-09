import { faExchangeAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import usePostSeguimientoAmbulatorio from "../../hooks/usePostSeguimientoAmbulatorio";
import { actualizar } from "../../api/seguimientoAmbulatorioService";
import { listarTramites } from "../../api/tramiteService";
import { crear as crearEgreso, actualizar as actualizarEgreso, obtenerPorTramiteId as obtenerEgreso } from "../../api/egresoService";
import Loader from "../../../../components/Loader";

const MOCK_EGRESOS = [
  { documento: "123456789", nombre: "JUAN PÉREZ GÓMEZ", eps: "SALUD TOTAL", ingreso: "2025001", servicio: "URGENCIAS", egresoFecha: "2025-05-20", egresoServicio: "CIRUGÍA GENERAL" },
  { documento: "987654321", nombre: "MARÍA LÓPEZ RODRÍGUEZ", eps: "NUEVA EPS", ingreso: "2025002", servicio: "HOSPITALIZACIÓN", egresoFecha: "2025-05-22", egresoServicio: "MEDICINA INTERNA" },
  { documento: "111222333", nombre: "CARLOS ANDRÉS RAMÍREZ", eps: "SANITAS", ingreso: "2025003", servicio: "CIRUGÍA", egresoFecha: "2025-05-25", egresoServicio: "CIRUGÍA GENERAL" },
  { documento: "444555666", nombre: "ANA MILENA TORRES", eps: "SALUD TOTAL", ingreso: "2025004", servicio: "CONSULTA EXTERNA", egresoFecha: "2025-05-18", egresoServicio: "MEDICINA INTERNA" },
  { documento: "777888999", nombre: "PEDRO ANTONIO CASTRO", eps: "COMPENSAR", ingreso: "2025005", servicio: "URGENCIAS", egresoFecha: "2025-05-30", egresoServicio: "CIRUGÍA GENERAL" },
];

export default function SeguimientoAmbulatorioForm({ item, onSaved }) {
  const { data: seguimientoCreado, loading, error, postSeguimiento } = usePostSeguimientoAmbulatorio();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [egresoInfo, setEgresoInfo] = useState(null);
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

  useEffect(() => {
    if (!seguimientoCreado) return;
    toast.success(esEdicion ? "Seguimiento ambulatorio actualizado con éxito!" : "Seguimiento ambulatorio guardado con éxito!");
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

  const handleBuscarIngreso = async () => {
    if (!busqueda.trim()) {
      toast.info("Ingrese un número de ingreso");
      return;
    }

    let tramiteEncontrado = null;
    try {
      const todos = await listarTramites();
      tramiteEncontrado = todos.find(t => t.ingreso === busqueda.trim());
    } catch {}

    if (!tramiteEncontrado) {
      toast.info("No se encontró el trámite con egreso para ese ingreso");
      setTramiteSeleccionado(null);
      setEgresoInfo(null);
      return;
    }

    let egresoData = null;
    try {
      const response = await fetch(`http://optimus:8000/dinamica-microservice/genPacien/informacion/egreso/${busqueda.trim()}`);
      const data = await response.json();
      if (data && data.egresoFecha) {
        egresoData = {
          egresoFecha: data.egresoFecha,
          egresoServicio: data.egresoServicio || ""
        };
      }
    } catch {}

    if (!egresoData) {
      const mock = MOCK_EGRESOS.find(p => p.ingreso === busqueda.trim());
      if (mock) {
        egresoData = {
          egresoFecha: mock.egresoFecha,
          egresoServicio: mock.egresoServicio
        };
      }
    }

    if (!egresoData) {
      toast.info("No se encontró el trámite con egreso para ese ingreso");
      setTramiteSeleccionado(null);
      setEgresoInfo(null);
      return;
    }

    setTramiteSeleccionado(tramiteEncontrado);
    setEgresoInfo(egresoData);
    toast.success("Trámite con egreso encontrado");
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

    if (!data.notaSeguimiento?.trim()) {
      toast.error("La nota de seguimiento es obligatoria");
      return;
    }

    const payload = {
      tramiteId,
      fechaNota: new Date().toISOString(),
      notaSeguimiento: data.notaSeguimiento,
      estado: item?.estado || "ACTIVO",
      auxiliarReferencia: item?.auxiliarReferencia || nombreUsuario
    };

    try {
      if (esEdicion) {
        await actualizar(item.id, payload);
      } else {
        await postSeguimiento(payload);
      }
      if (egresoInfo) {
        const fechaEgreso = egresoInfo.egresoFecha
          ? egresoInfo.egresoFecha.includes("T")
            ? egresoInfo.egresoFecha
            : `${egresoInfo.egresoFecha}T00:00:00`
          : null;
        const egresoPayload = {
          tramiteId,
          servicioEgreso: egresoInfo.egresoServicio,
          fechaEgreso
        };
        try {
          const existente = await obtenerEgreso(tramiteId);
          if (existente && existente.id) {
            await actualizarEgreso(existente.id, egresoPayload);
          } else {
            await crearEgreso(egresoPayload);
          }
        } catch {
          await crearEgreso(egresoPayload);
        }
      }
      event.target.reset();
      setTramiteSeleccionado(null);
      setEgresoInfo(null);
      setBusqueda("");
      onSaved?.();
    } catch {
      toast.error(esEdicion ? "Error al actualizar el seguimiento" : "Error al guardar el seguimiento");
    }
  };

  if (loading) return <Loader />;

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
            {!esEdicion && (
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Buscar por Ingreso:</label>
                  <div className="flex items-center">
                    <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="N° de ingreso del paciente" />
                    <button type="button" onClick={handleBuscarIngreso}
                      className="ml-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                      <FontAwesomeIcon icon={faSearch} className="mr-1" />Buscar
                    </button>
                  </div>
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
                  <div><span className="font-semibold">Estado Trámite:</span> {tramiteSeleccionado.estado || ""}</div>
                  {egresoInfo && (
                    <>
                      <div><span className="font-semibold">Fecha Egreso:</span> {egresoInfo.egresoFecha}</div>
                      <div><span className="font-semibold">Servicio Egreso:</span> {egresoInfo.egresoServicio}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nota de Seguimiento:</label>
                <textarea name="notaSeguimiento" rows={6} defaultValue={item?.notaSeguimiento || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Ingrese nota de seguimiento..." required />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3">
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
      </div>
    </form>
  );
}
