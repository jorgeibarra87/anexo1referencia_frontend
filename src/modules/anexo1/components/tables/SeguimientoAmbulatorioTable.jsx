import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { listarPorTramite as listarTodosAmb } from '../../api/seguimientoAmbulatorioService';
import { listarTramites } from '../../api/tramiteService';
import Pagination from '../../../../components/Pagination';

const PAGE_SIZE = 50;

export default function SeguimientoAmbulatorioTable({ onEdit = () => {}, reloadFlag }) {
  const [data, setData] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const tramitesData = await listarTramites();
      setTramites(tramitesData);

      let all = [];
      for (const t of tramitesData) {
        try {
          const items = await listarTodosAmb(t.id);
          all = all.concat(items.map((item) => ({ ...item, numeroTramite: t.numeroTramite, pacienteNombre: t.pacienteNombre })));
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

  const dataFiltrada = data.filter((item) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      item.numeroTramite?.toLowerCase().includes(q) ||
      item.pacienteNombre?.toLowerCase().includes(q) ||
      item.notaSeguimiento?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(dataFiltrada.length / PAGE_SIZE);
  const paginatedData = dataFiltrada.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (loading) return <p className="text-center py-4">Cargando seguimientos...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-2 w-full">
      <div className="flex items-center space-x-2 mb-2 text-xs text-gray-600">
        <span className="font-medium"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" /> Buscar:</span>
        <input type="text" value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPage(0); }}
          placeholder="N° trámite o paciente"
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-64"
        />
        {busqueda && (
          <button onClick={() => { setBusqueda(''); setPage(0); }}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">✕ Limpiar</button>
        )}
      </div>

      <div className="relative mb-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
        style={{ minHeight: '300px', maxHeight: '700px' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">N° Trámite</th>
                <th className="px-3 py-2 text-left">Paciente</th>
                <th className="px-3 py-2 text-left">Fecha Nota</th>
                <th className="px-3 py-2 text-left">Nota Seguimiento</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Usuario</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, i) => (
                <tr key={item.id || i} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-1.5 font-semibold text-blue-700">{item.numeroTramite || item.tramiteId}</td>
                  <td className="px-3 py-1.5">{item.pacienteNombre || ""}</td>
                  <td className="px-3 py-1.5">{item.fechaNota ? new Date(item.fechaNota).toLocaleString() : ""}</td>
                  <td className="px-3 py-1.5 max-w-xs truncate">{item.notaSeguimiento || "-"}</td>
                  <td className="px-3 py-1.5">{item.estado || "ACTIVO"}</td>
                  <td className="px-3 py-1.5">{item.usuario || ""}</td>
                  <td className="px-3 py-1.5">
                    <button onClick={() => onEdit?.(item)} className="text-blue-600 hover:text-blue-800">
                      <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-gray-500">No hay seguimientos ambulatorios registrados.</td></tr>
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
