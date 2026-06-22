import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { listarTramites, cambiarEstadoTramite } from '../../api/tramiteService';
import Pagination from '../../../../components/Pagination';
import TextoColapsable from '../../../../components/utilities/TextoColapsable';

const PAGE_SIZE = 50;

export default function TramiteTable({ onEdit = () => {}, reloadFlag }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(0);
  const [filtroSolicitud, setFiltroSolicitud] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const token = localStorage.getItem('tokenhusjp');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const roles = Array.isArray(payload.authorities)
    ? payload.authorities
    : payload.authorities?.split(',').map(r => r.trim()) || [];

  const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await listarTramites();
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [reloadFlag]);

  const opcionesSolicitud = [...new Set(data.map(t => t.tipoSolicitudDescripcion).filter(Boolean))].sort();
  const opcionesEstado = ["CERRADO", "PENDIENTE"];
  const dataFiltrada = data.filter((t) => {
    if (filtroSolicitud && t.tipoSolicitudDescripcion !== filtroSolicitud) return false;
    if (filtroEstado && t.estado !== filtroEstado) return false;
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      String(t.id).includes(q) ||
      t.pacienteNombre?.toLowerCase().includes(q) ||
      t.servicio?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(dataFiltrada.length / PAGE_SIZE);
  const paginatedData = dataFiltrada.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const getEstadoBadge = (estado) => {
    const colores = {
      PENDIENTE: "bg-yellow-300",
      EN_PROCESO: "bg-blue-300",
      CERRADO: "bg-green-400",
      ANULADO: "bg-red-300",
    };
    return colores[estado] || "bg-gray-200";
  };

  if (loading) return <p className="text-center py-4">Cargando trámites...</p>;

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
                <th className="px-3 py-2 text-left border-r border-gray-300">ID</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Fecha Trámite</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Nombre</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Documento</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Ingreso</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">EPS</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Servicio</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Tipo Solicitud</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Descripción</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Estado</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Auxiliar</th>
                <th className="px-3 py-2 text-left border-r border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((t, i) => (
                <tr key={t.id || i} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-1.5 font-semibold text-blue-700 border-r border-gray-300">{t.id}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.fechaTramite ? new Date(t.fechaTramite).toLocaleDateString() : ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.pacienteNombre || ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.pacienteDocumento || ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.ingreso || ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.pacienteEps || ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.servicio || ""}</td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.tipoSolicitudDescripcion || ""}</td>
                  <td className="px-3 py-1.5 max-w-xs border-r border-gray-300"><TextoColapsable texto={t.descripcion} /></td>
                  <td className="px-3 py-1.5 border-r border-gray-300">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getEstadoBadge(t.estado)}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 border-r border-gray-300">{t.auxiliarReferencia || ""}</td>
                  <td className="px-3 py-1.5">
                    {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_ANEXO1') && (
                      <button onClick={() => onEdit?.(t)} className="text-blue-600 hover:text-blue-800">
                        <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={12} className="text-center py-4 text-gray-500">No hay trámites registrados.</td></tr>
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
