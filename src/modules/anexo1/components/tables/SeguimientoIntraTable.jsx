import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { listarPorTramite as listarTodosIntra } from '../../api/seguimientoIntrahospitalarioService';
import { listarTramites } from '../../api/tramiteService';
import Pagination from '../../../../components/Pagination';
import TextoColapsable from '../../../../components/utilities/TextoColapsable';

const PAGE_SIZE = 50;

export default function SeguimientoIntraTable({ onEdit = () => {}, reloadFlag }) {
  const [data, setData] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(0);
  const [filtroSolicitud, setFiltroSolicitud] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const tramitesData = await listarTramites();
      setTramites(tramitesData);

      let all = [];
      for (const t of tramitesData) {
        try {
          const items = await listarTodosIntra(t.id);
          all = all.concat(items.map((item) => ({
            ...item,
            tramiteId: t.id,
            pacienteNombre: t.pacienteNombre,
            pacienteDocumento: t.pacienteDocumento,
            servicio: t.servicio,
            estado: t.estado,
            tipoSolicitudDescripcion: t.tipoSolicitudDescripcion
          })));
        } catch {}
      }
      setData(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [reloadFlag]);

  const opcionesSolicitud = [...new Set(tramites.map(t => t.tipoSolicitudDescripcion).filter(Boolean))].sort();
  const opcionesEstado = ["CERRADO", "PENDIENTE"];

  const dataFiltrada = data.filter((item) => {
    if (filtroSolicitud && item.tipoSolicitudDescripcion !== filtroSolicitud) return false;
    if (filtroEstado && item.estado !== filtroEstado) return false;
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      String(item.tramiteId).includes(q) ||
      (item.pacienteNombre || '').toLowerCase().includes(q) ||
      (item.pacienteDocumento || '').toLowerCase().includes(q) ||
      (item.servicio || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(dataFiltrada.length / PAGE_SIZE);
  const paginatedData = dataFiltrada.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const getEstadoBadge = (estado) => {
    if (estado === "CERRADO") return "bg-green-400 text-green-900";
    return "bg-yellow-300 text-yellow-900";
  };

  if (loading) return <p className="text-center py-4">Cargando seguimientos...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-2 w-full">
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 flex-wrap">
        <span className="font-medium"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" /> Buscar:</span>
        <input type="text" value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPage(0); }}
          placeholder="ID, paciente, documento o servicio"
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-48"
        />
        <select value={filtroSolicitud} onChange={(e) => { setFiltroSolicitud(e.target.value); setPage(0); }}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white">
          <option value="">Todas las solicitudes</option>
          {opcionesSolicitud.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPage(0); }}
          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white">
          <option value="">Todos los estados</option>
          {opcionesEstado.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="relative mb-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
        style={{ minHeight: '300px', maxHeight: '700px' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">ID Trámite</th>
                <th className="px-3 py-2 text-left">Paciente</th>
                <th className="px-3 py-2 text-left">Documento</th>
                <th className="px-3 py-2 text-left">Servicio</th>
                <th className="px-3 py-2 text-left">Fecha Seguimiento</th>
                <th className="px-3 py-2 text-left">Autorización</th>
                <th className="px-3 py-2 text-left">Estado Trámite</th>
                <th className="px-3 py-2 text-left">Auxiliar</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, i) => (
                <tr key={item.id || i} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-1.5 font-semibold text-blue-700">{item.tramiteId}</td>
                  <td className="px-3 py-1.5">{item.pacienteNombre || ""}</td>
                  <td className="px-3 py-1.5">{item.pacienteDocumento || ""}</td>
                  <td className="px-3 py-1.5">{item.servicio || ""}</td>
                  <td className="px-3 py-1.5">{item.fechaSeguimiento ? new Date(item.fechaSeguimiento).toLocaleString() : ""}</td>
                  <td className="px-3 py-1.5 max-w-xs"><TextoColapsable texto={item.autorizacion || item.numeroAutorizacion} /></td>
                  <td className="px-3 py-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getEstadoBadge(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">{item.auxiliarReferencia || ""}</td>
                  <td className="px-3 py-1.5">
                    <button onClick={() => onEdit?.(item)} className="text-blue-600 hover:text-blue-800">
                      <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={9} className="text-center py-4 text-gray-500">No hay seguimientos registrados.</td></tr>
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
