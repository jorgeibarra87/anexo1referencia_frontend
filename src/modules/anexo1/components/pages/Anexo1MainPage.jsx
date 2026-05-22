import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit, faHospitalUser, faClipboardList, faFileMedical, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchTramites from '../../hooks/useFetchTramites';
import { obtenerPorTramiteId as obtenerEgreso } from '../../api/egresoService';
import Loader from '../../../../components/Loader';
import Pagination from '../../../../components/Pagination';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 50;

export default function Anexo1MainPage() {
  const { data: tramites, loading, error, refetch } = useFetchTramites();
  const [tramitesConDetalle, setTramitesConDetalle] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tramites || tramites.length === 0) return;
    const cargarDetalles = async () => {
      const resultados = await Promise.all(
        tramites.map(async (t) => {
          try {
            const egreso = await obtenerEgreso(t.id);
            return { ...t, egreso };
          } catch {
            return { ...t, egreso: null };
          }
        })
      );
      setTramitesConDetalle(resultados);
    };
    cargarDetalles();
  }, [tramites]);

  const datosFiltrados = tramitesConDetalle.filter((t) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      t.numeroTramite?.toLowerCase().includes(q) ||
      t.pacienteNombre?.toLowerCase().includes(q) ||
      t.servicioOrigen?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(datosFiltrados.length / PAGE_SIZE);
  const paginatedData = datosFiltrados.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const getEstadoBadge = (estado) => {
    const colores = {
      PENDIENTE: "bg-yellow-300 text-yellow-900",
      EN_PROCESO: "bg-blue-300 text-blue-900",
      CERRADO: "bg-green-400 text-green-900",
      ANULADO: "bg-red-300 text-red-900",
    };
    return colores[estado] || "bg-gray-200 text-gray-800";
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      datosFiltrados.map((t) => ({
        "N° Trámite": t.numeroTramite,
        "Fecha": t.fechaTramite ? new Date(t.fechaTramite).toLocaleString() : "",
        "Paciente": t.pacienteNombre || "",
        "Tipo Ingreso": t.tipoIngreso || "",
        "Servicio Origen": t.servicioOrigen || "",
        "Tipo Solicitud": t.tipoSolicitudDescripcion || "",
        "Descripción": t.descripcion || "",
        "Estado": t.estado || "",
        "Auxiliar": t.auxiliarReferencia || "",
        "Servicio Egreso": t.egreso?.servicioEgreso || "",
        "Fecha Egreso": t.egreso?.fechaEgreso ? new Date(t.egreso.fechaEgreso).toLocaleString() : "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Anexo1");
    XLSX.writeFile(wb, "anexo1_referencia_contrareferencia.xlsx");
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error.message || "Error"}</p>;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-black" />
        Anexo 1 - Referencia y Contrareferencia
      </h1>

      <button
        onClick={() => navigate('/anexo1/tramite')}
        className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Inicio de Trámite
      </button>
      <button
        onClick={() => navigate('/anexo1/seguimiento-intra')}
        className="font-bold mx-2 my-6 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        <FontAwesomeIcon icon={faHospitalUser} className="w-4 h-4 text-white pr-2" />Seg. Intrahospitalario
      </button>
      <button
        onClick={() => navigate('/anexo1/seguimiento-ambulatorio')}
        className="font-bold mx-2 my-6 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        <FontAwesomeIcon icon={faFileMedical} className="w-4 h-4 text-white pr-2" />Seg. Ambulatorio
      </button>
      <button
        onClick={handleExport}
        className="font-bold mx-2 my-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Exportar Excel
      </button>

      <div className="flex items-center space-x-2 mb-4">
        <span className="font-medium text-xs"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" /> Buscar:</span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPage(0); }}
          placeholder="N° trámite, paciente o servicio"
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-64"
        />
        {busqueda && (
          <button onClick={() => { setBusqueda(''); setPage(0); }}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">
            ✕ Limpiar
          </button>
        )}
      </div>

      <div className="relative mb-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
        style={{ minHeight: '400px', maxHeight: '800px' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-gray-700">
            <thead className="bg-gray-800 text-white text-xs">
              <tr>
                <th className="px-3 py-2 text-left">Id Trámite</th>
                <th className="px-3 py-2 text-left">Fecha Trámite</th>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Documento</th>
                <th className="px-3 py-2 text-left">Ingreso</th>
                <th className="px-3 py-2 text-left">EPS</th>
                <th className="px-3 py-2 text-left">Servicio</th>
                <th className="px-3 py-2 text-left">Tipo Solicitud</th>
                <th className="px-3 py-2 text-left">Descripción</th>    
                <th className="px-3 py-2 text-left">Auxiliar Trámite</th>
                <th className="px-3 py-2 text-left">Fecha Seguimiento</th>
                <th className="px-3 py-2 text-left">Autorización</th>
                <th className="px-3 py-2 text-left">Auxiliar Seguimiento</th>
                <th className="px-3 py-2 text-left">Servicio Egreso</th>
                <th className="px-3 py-2 text-left">Fecha Egreso</th>
                <th className="px-3 py-2 text-left">Nota Seguimiento</th>
                <th className="px-3 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((t, i) => (
                <tr key={t.id || i} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-1.5 font-semibold text-blue-700">{t.id}</td>
                  <td className="px-3 py-1.5">{t.fechaTramite ? new Date(t.fechaTramite).toLocaleDateString() : ""}</td>
                  <td className="px-3 py-1.5">{t.pacienteNombre || ""}</td>
                  <td className="px-3 py-1.5">{t.pacienteDocumento || ""}</td>
                  <td className="px-3 py-1.5">{t.tipoIngreso || ""}</td>
                  <td className="px-3 py-1.5">{t.pacienteEps || ""}</td>
                  <td className="px-3 py-1.5">{t.servicioOrigen || ""}</td>
                  <td className="px-3 py-1.5">{t.tipoSolicitudDescripcion || ""}</td>
                  <td className="px-3 py-1.5 max-w-xs truncate">{t.descripcion || ""}</td>
                  <td className="px-3 py-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getEstadoBadge(t.estado)}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">{t.auxiliarReferencia || ""}</td>
                  <td className="px-3 py-1.5">{t.egreso?.servicioEgreso || "-"}</td>
                  <td className="px-3 py-1.5">
                    {t.egreso?.fechaEgreso ? new Date(t.egreso.fechaEgreso).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
              {datosFiltrados.length === 0 && (
                <tr><td colSpan={11} className="text-center py-4 text-gray-500">No hay datos disponibles</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex-shrink-0 p-2 bg-gray-50 border-t">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
