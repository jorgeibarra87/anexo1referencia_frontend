import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit, faHospitalUser, faClipboardList, faFileMedical, faSearch, faSync, faHomeUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarTramitesCompletos } from '../../api/tramiteService';
import Loader from '../../../../components/Loader';
import Pagination from '../../../../components/Pagination';
import TextoColapsable from '../../../../components/utilities/TextoColapsable';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 50;

export default function Anexo1MainPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarTramitesCompletos();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const datosFiltrados = data.filter((t) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      String(t.id).includes(q) ||
      (t.pacienteNombre || '').toLowerCase().includes(q) ||
      (t.pacienteDocumento || '').toLowerCase().includes(q) ||
      (t.servicio || '').toLowerCase().includes(q) ||
      (t.tipoSolicitudDescripcion || '').toLowerCase().includes(q)
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

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : "";

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      datosFiltrados.map((t) => ({
        "ID": t.id,
        "Fecha Trámite": fmtDate(t.fechaTramite),
        "Nombre": t.pacienteNombre || "",
        "Documento": t.pacienteDocumento || "",
        "Ingreso": t.ingreso || "",
        "EPS": t.pacienteEps || "",
        "Servicio": t.servicio || "",
        "Solicitud": t.tipoSolicitudDescripcion || "",
        "Descripción": t.descripcion || "",
        "Estado": t.estado || "",
        "Aux. Referencia": t.auxiliarReferencia || "",
        "Fecha Seg. Intra": fmtDate(t.intraFechaSeguimiento),
        "Autorización": t.intraAutorizacion || "",
        "Aux. Ref. Intra": t.intraAuxiliarReferencia || "",
        "Servicio Egreso": t.egresoServicio || "",
        "Fecha Egreso": fmtDate(t.egresoFecha),
        "Nota Seg. Amb": t.ambulatorioNotaSeguimiento || "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Anexo1");
    XLSX.writeFile(wb, "anexo1_referencia_contrareferencia.xlsx");
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error.message || "Error"}</p>;

  const sectionColspan = {
    inicio: 11,
    intra: 3,
    salida: 2,
    amb: 2,
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-black" />
        Anexo 1 - Referencia y Contrareferencia
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => navigate('/anexo1/general')}
          className="font-bold px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          <FontAwesomeIcon icon={faHomeUser} className="pr-1" />Inicio
        </button>
        <button onClick={() => navigate('/anexo1/tramite')}
          className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
          <FontAwesomeIcon icon={faFileEdit} className="pr-1" />Trámite Inicial
        </button>
        <button onClick={() => navigate('/anexo1/seguimiento-intra')}
          className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
          <FontAwesomeIcon icon={faHospitalUser} className="pr-1" />Seg. Intrahospitalario
        </button>
        <button onClick={() => navigate('/anexo1/seguimiento-ambulatorio')}
          className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
          <FontAwesomeIcon icon={faFileMedical} className="pr-1" />Seg. Ambulatorio
        </button>
        <button onClick={fetchData}
          className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
          <FontAwesomeIcon icon={faSync} className="pr-1" />Actualizar
        </button>
        <button onClick={handleExport}
          className="font-bold px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          <FontAwesomeIcon icon={faFileEdit} className="pr-1" />Exportar Excel
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4 min-w-full">
        <span className="font-medium text-xs"><FontAwesomeIcon icon={faSearch} /> Buscar:</span>
        <input type="text" value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPage(0); }}
          placeholder="ID, paciente, documento, servicio o solicitud"
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-72" />
        {busqueda && (
          <button onClick={() => { setBusqueda(''); setPage(0); }}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">✕ Limpiar</button>
        )}
      </div>

      <div className="relative mb-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
        style={{ minHeight: '400px', maxHeight: '800px' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-gray-700 border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white text-center text-sm font-bold">
                <th colSpan={sectionColspan.inicio} className="px-2 py-2 border-r border-gray-700">INICIO TRÁMITE</th>
                <th colSpan={sectionColspan.intra} className="px-2 py-2 border-r border-gray-700">SEGUIMIENTO INTRAHOSPITALARIO</th>
                <th colSpan={sectionColspan.salida} className="px-2 py-2 border-r border-gray-700">SALIDA</th>
                <th colSpan={sectionColspan.amb} className="px-2 py-2">SEGUIMIENTO AMBULATORIO</th>
              </tr>
              <tr className="bg-gray-800 text-white text-xs">
                <th className="px-2 py-1.5 text-left">ID</th>
                <th className="px-2 py-1.5 text-left">Fecha</th>
                <th className="px-2 py-1.5 text-left">Nombre</th>
                <th className="px-2 py-1.5 text-left">Documento</th>
                <th className="px-2 py-1.5 text-left">Ingreso</th>
                <th className="px-2 py-1.5 text-left">EPS</th>
                <th className="px-2 py-1.5 text-left">Servicio</th>
                <th className="px-2 py-1.5 text-left">Solicitud</th>
                <th className="px-2 py-1.5 text-left">Descripción</th>
                <th className="px-2 py-1.5 text-left">Estado</th>
                <th className="px-2 py-1.5 text-left border-r border-gray-700">Aux. Tramite</th>
                <th className="px-2 py-1.5 text-left">Fecha Seg.</th>
                <th className="px-2 py-1.5 text-left">Autorización</th>
                <th className="px-2 py-1.5 text-left border-r border-gray-700">Aux. Seguimiento</th>
                <th className="px-2 py-1.5 text-left">Servicio Egreso</th>
                <th className="px-2 py-1.5 text-left border-r border-gray-700">Fecha Egreso</th>
                <th className="px-2 py-1.5 text-left">Nota Seguimiento</th>
                <th className="px-2 py-1.5 text-left">Fecha Nota</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((t, i) => (
                <tr key={t.id || i} className="border-b hover:bg-blue-50">
                  <td className="px-2 py-1 font-semibold text-blue-700">{t.id}</td>
                  <td className="px-2 py-1">{fmtDate(t.fechaTramite)}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{t.pacienteNombre || ""}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{t.pacienteDocumento || ""}</td>
                  <td className="px-2 py-1">{t.ingreso || ""}</td>
                  <td className="px-2 py-1">{t.pacienteEps || ""}</td>
                  <td className="px-2 py-1">{t.servicio || ""}</td>
                  <td className="px-2 py-1 max-w-[150px]"><TextoColapsable texto={t.tipoSolicitudDescripcion} limite={60} /></td>
                  <td className="px-2 py-1 max-w-[200px]"><TextoColapsable texto={t.descripcion} /></td>
                  <td className="px-2 py-1">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${getEstadoBadge(t.estado)}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-2 py-1 border-r border-gray-300">{t.auxiliarReferencia || ""}</td>
                  <td className="px-2 py-1">{fmtDate(t.intraFechaSeguimiento)}</td>
                  <td className="px-2 py-1 max-w-[150px]"><TextoColapsable texto={t.intraAutorizacion} limite={60} /></td>
                  <td className="px-2 py-1 border-r border-gray-300">{t.intraAuxiliarReferencia || ""}</td>
                  <td className="px-2 py-1">{t.egresoServicio || ""}</td>
                  <td className="px-2 py-1 border-r border-gray-300">{fmtDate(t.egresoFecha)}</td>
                  <td className="px-2 py-1 max-w-[200px]"><TextoColapsable texto={t.ambulatorioNotaSeguimiento} /></td>
                  <td className="px-2 py-1">{fmtDate(t.ambulatorioFechaNota)}</td>
                </tr>
              ))}
              {datosFiltrados.length === 0 && (
                <tr><td colSpan={18} className="text-center py-4 text-gray-500">No hay datos disponibles</td></tr>
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
