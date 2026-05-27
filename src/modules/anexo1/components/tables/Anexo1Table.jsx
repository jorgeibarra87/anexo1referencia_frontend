import { useEffect, useState } from "react";
import useFetchTramites from "../../hooks/useFetchTramites";
import useFetchSeguimientoIntra from "../../hooks/useFetchSeguimientoIntra";
import useFetchEgresos from "../../hooks/useFetchEgresos";
import { obtenerPorTramiteId as obtenerEgreso } from "../../api/egresoService";
import Loader from "../../../../components/Loader";
import * as XLSX from 'xlsx';
import TextoColapsable from "../../../../components/utilities/TextoColapsable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Anexo1Table() {
  const { data: tramites, loading, error, refetch } = useFetchTramites();
  const { data: seguimientosIntra, fetchPorTramite: fetchIntra } = useFetchSeguimientoIntra();
  const { fetchPorTramite: fetchEgreso } = useFetchEgresos();
  const [tramitesConDetalle, setTramitesConDetalle] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [tramiteExpandido, setTramiteExpandido] = useState(null);

  useEffect(() => {
    if (!tramites || tramites.length === 0) return;
    cargarDetalles(tramites);
  }, [tramites]);

  const cargarDetalles = async (lista) => {
    setLoadingDetalle(true);
    try {
      const resultados = await Promise.all(
        lista.map(async (t) => {
          try {
            const egreso = await obtenerEgreso(t.id);
            return { ...t, egreso };
          } catch {
            return { ...t, egreso: null };
          }
        })
      );
      setTramitesConDetalle(resultados);
    } catch {
      setTramitesConDetalle(lista);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleVerIntra = async (tramiteId) => {
    if (tramiteExpandido === tramiteId) {
      setTramiteExpandido(null);
    } else {
      await fetchIntra(tramiteId);
      setTramiteExpandido(tramiteId);
    }
  };

  const datosExportar = (datos) => {
    return datos.map((t) => ({
      "ID Trámite": t.id,
      "Fecha Trámite": t.fechaTramite ? new Date(t.fechaTramite).toLocaleString() : "",
      "Paciente": t.pacienteNombre || "",
      "Documento": t.pacienteDocumento || "",
      "Ingreso": t.ingreso || "",
      "EPS": t.pacienteEps || "",
      "Servicio": t.servicio || "",
      "Tipo Solicitud": t.tipoSolicitudDescripcion || "",
      "Descripción": t.descripcion || "",
      "Estado": t.estado || "",
      "Auxiliar": t.auxiliarReferencia || "",
      "Servicio Egreso": t.egreso?.servicioEgreso || "",
      "Fecha Egreso": t.egreso?.fechaEgreso ? new Date(t.egreso.fechaEgreso).toLocaleString() : "",
    }));
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(datosExportar(tramitesConDetalle));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Anexo1");
    XLSX.writeFile(workbook, "anexo1_referencia_contrareferencia.xlsx");
  };

  const getEstadoBadge = (estado) => {
    const colores = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      EN_PROCESO: "bg-blue-100 text-blue-800",
      CERRADO: "bg-green-100 text-green-800",
      ANULADO: "bg-red-100 text-red-800",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  const getEstadoAutoBadge = (estado) => {
    if (estado === "AUTORIZADO" || estado === "CERRADO") return "bg-green-100 text-green-800";
    if (estado === "NEGADO") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  if (loading) return <Loader />;
  if (error) return <div><h2>Error: {error.message || "Error al cargar datos"}</h2></div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg pb-4">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-bold">Anexo 1 - Referencia y Contrareferencia</h2>
        <button onClick={handleExport}
          className="text-white rounded-lg px-3 py-2 bg-blue-600 hover:bg-blue-700 text-sm">
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Ingreso</th>
              <th className="px-4 py-3">EPS</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Tipo Solicitud</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Auxiliar</th>
              <th className="px-4 py-3">Servicio Egreso</th>
              <th className="px-4 py-3">Fecha Egreso</th>
            </tr>
          </thead>
          <tbody>
            {tramitesConDetalle.length === 0 && !loadingDetalle && (
              <tr><td colSpan={13} className="text-center py-4 text-gray-500">No hay datos disponibles</td></tr>
            )}
            {tramitesConDetalle.map((t, index) => (
              <tr key={t.id || index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-xs font-medium text-gray-900">{t.id}</td>
                <td className="px-4 py-2 text-xs">{t.fechaTramite ? new Date(t.fechaTramite).toLocaleDateString() : ""}</td>
                <td className="px-4 py-2 text-xs">{t.pacienteNombre || ""}</td>
                <td className="px-4 py-2 text-xs">{t.pacienteDocumento || ""}</td>
                <td className="px-4 py-2 text-xs">{t.ingreso || ""}</td>
                <td className="px-4 py-2 text-xs">{t.pacienteEps || ""}</td>
                <td className="px-4 py-2 text-xs">{t.servicio || ""}</td>
                <td className="px-4 py-2 text-xs">{t.tipoSolicitudDescripcion || ""}</td>
                <td className="px-4 py-2 text-xs max-w-xs"><TextoColapsable texto={t.descripcion} /></td>
                <td className="px-4 py-2 text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(t.estado)}`}>
                    {t.estado}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">{t.auxiliarReferencia || ""}</td>
                <td className="px-4 py-2 text-xs">{t.egreso?.servicioEgreso || "-"}</td>
                <td className="px-4 py-2 text-xs">
                  {t.egreso?.fechaEgreso ? new Date(t.egreso.fechaEgreso).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
            {loadingDetalle && (
              <tr><td colSpan={13} className="text-center py-4"><Loader /></td></tr>
            )}
          </tbody>
        </table>

        {/* Detalle de seguimientos intrahospitalarios */}
        {tramiteExpandido && (
          <div className="bg-gray-50 p-4 border-t">
            <h4 className="font-bold text-sm mb-2">Seguimientos Intrahospitalarios - Trámite #{tramiteExpandido}</h4>
            {seguimientosIntra && seguimientosIntra.length > 0 ? (
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-2">Fecha</th>
                    <th className="px-3 py-2">Autorizaci�n</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {seguimientosIntra.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-3 py-1">{new Date(s.fechaSeguimiento).toLocaleString()}</td>
                      <td className="px-3 py-1">{s.autorizacion || s.numeroAutorizacion || "-"}</td>
                      <td className="px-3 py-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoAutoBadge(s.estadoAutorizacion)}`}>
                          {s.estadoAutorizacion}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-gray-500">No hay seguimientos registrados</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
