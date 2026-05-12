import { useEffect, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faAmbulance, faTruckMedical, faFileEdit, faFileAlt, faDollar, faBookMedical, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';
import { obtenerTrasladosCompletos } from '../../../referencia-contrareferencia/api/trasladosService';

const PAGE_SIZE = 50; // máximo por página

export default function TrasladosTotalPage() {
    const [datos, setDatos] = useState([]);
    const [expandido, setExpandido] = useState({});
    const [loading, setLoading] = useState(true);

    // Lee los roles del token directamente
    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // authorities: "ROLE_X" (string) o ["ROLE_X", "ROLE_Y"]
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

    // Estado de busqueda
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    //estados paginacion y tamaño texto
    const [page, setPage] = useState(0);
    const [fontSize, setFontSize] = useState(10);
    const aumentarTexto = () => setFontSize(prev => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize(prev => Math.max(prev - 1, 8));

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            const response = await obtenerTrasladosCompletos();
            setDatos(response);
            setLoading(false);
        };

        fetchData();
    }, []);

    const toggleFila = (id) =>
        setExpandido(prev => ({ ...prev, [id]: !prev[id] }));

    const datosFiltrados = datos
        // filtro por texto
        .filter(({ traslado }) => {
            if (busqueda.trim() === '') return true;
            const q = busqueda.toLowerCase();
            return (
                traslado.documento?.toLowerCase().includes(q) ||
                traslado.nomPaciente?.toLowerCase().includes(q) ||
                traslado.ingreso?.toString().toLowerCase().includes(q)
            );
        })
        // filtro por estado
        .filter(({ traslado }) => {
            if (filtroEstado === 'TODOS') return true;
            return traslado.estado === filtroEstado; // 'PENDIENTE' o 'VALIDADO'
        });

    const totalPages = Math.ceil(datosFiltrados.length / PAGE_SIZE);
    const paginatedData = datosFiltrados.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    if (loading) return <p className="text-center py-8 text-gray-500">Cargando...</p>;

    return (
        <div className="min-h-screen bg-white p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faAmbulance} className="mr-2 text-black" />
                Traslados Ambulancia
            </h1>

            {/* ✅ Botones con navegación */}
            <button
                onClick={() => navigate('/referenciacontrareferencia/totaltraslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                <FontAwesomeIcon icon={faTruckMedical} className="w-4 h-4 text-white pr-2" />Traslados
            </button>
            {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_LIDER', 'ROLE_REFERENCIA_ASISTENTE') && (<button
                onClick={() => navigate('/referenciacontrareferencia/traslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faFileEdit} className="w-4 h-4 text-white pr-2" />Referencia
            </button>)}
            {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_FACTURACION_LIDER', 'ROLE_FACTURACION_ASISTENTE') && (<button
                onClick={() => navigate('/referenciacontrareferencia/facturaciones')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faDollar} className="w-4 h-4 text-white pr-2" />Facturación
            </button>)}
            {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER', 'ROLE_CUENTAS_MEDICAS_ASISTENTE') && (<button
                onClick={() => navigate('/referenciacontrareferencia/cuentas-medicas')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
            </button>)}
            <button
                onClick={() => navigate('/referenciacontrareferencia/reporte')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 text-white pr-2" />Reporte
            </button>

            <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                {/* Buscador */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" />Buscar:</span>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => {
                            setBusqueda(e.target.value);
                            setPage(0); // ✅ resetea a página 1 al buscar
                        }}
                        placeholder="Documento o paciente o ingreso"
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                        style={{ width: '200px' }}
                    />
                    {busqueda && (
                        <button
                            onClick={() => { setBusqueda(''); setPage(0); }}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        >
                            ✕ Limpiar
                        </button>
                    )}
                </div>

                {/* Filtro estado */}
                <div className="flex items-center space-x-4">
                    {/* Filtro estado */}
                    <div className="flex items-center space-x-1">
                        <span>Estado:</span>
                        <select
                            value={filtroEstado}
                            onChange={e => { setFiltroEstado(e.target.value); setPage(0); }}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="TODOS">Todos</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="VALIDADO">Validado</option>
                        </select>
                    </div>

                    {/* Tamaño texto */}
                    <div className="flex items-center space-x-2">
                        <span>Tamaño texto:</span>
                        <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A–</button>
                        <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A+</button>
                    </div>
                </div>
            </div>

            {/* ✅ Contenedor con scroll + paginación al fondo */}
            <div className="relative mb-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col"
                style={{ minHeight: '400px', maxHeight: '900px' }}>

                <div className="overflow-x-auto shadow border border-gray-200">
                    <table className="min-w-full text-xs text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                        <thead className=" bg-gray-800 text-white text-xs">
                            <tr>
                                <th className="px-2 py-2"></th>
                                <th className="px-2 py-2 text-left">ID</th>
                                <th className="px-2 py-2 text-left">Documento</th>
                                <th className="px-2 py-2 text-left">Paciente</th>
                                <th className="px-2 py-2 text-left">EPS</th>
                                <th className="px-2 py-2 text-left">Ingreso</th>
                                <th className="px-2 py-2 text-left">Fecha Traslado</th>
                                <th className="px-2 py-2 text-left">Tipo Traslado</th>
                                <th className="px-2 py-2 text-left">Servicio</th>
                                <th className="px-2 py-2 text-left">Destino</th>
                                <th className="px-2 py-2 text-left">Ciudad</th>
                                <th className="px-2 py-2 text-left">A. Referencia</th>
                                <th className="px-2 py-2 text-left">A. Ambulancia</th>
                                <th className="px-2 py-2 text-left">Archivo</th>
                                <th className="px-2 py-2 text-left">Estado</th>
                                <th className="px-2 py-2 text-left">Facturaciones</th>
                                <th className="px-2 py-2 text-left">Cuentas Médicas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(({ traslado, facturaciones, cuentasMedicas }) => (
                                <Fragment key={traslado.id}>
                                    {/* ── Fila principal del traslado ── */}
                                    <tr
                                        key={traslado.id}
                                        className="border-t hover:bg-blue-50 cursor-pointer"
                                        onClick={() => toggleFila(traslado.id)}
                                    >
                                        <td className="border-r border-b px-2 py-2 text-gray-400">
                                            <FontAwesomeIcon icon={expandido[traslado.id] ? faChevronDown : faChevronRight} />
                                        </td>
                                        {/* <td className="px-2 py-2 font-semibold text-blue-700">{traslado.id}</td> */}
                                        <td className="border-r border-b px-2 py-2">{traslado.id}</td>
                                        <td className="border-r border-b px-2 py-2 font-semibold text-blue-700">{traslado.documento}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.nomPaciente}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.eps}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.ingreso}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.fechaTraslado?.slice(0, 16).replace('T', ' ')}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.tipoTraslado}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.servicio}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.destino}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.ciudad}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.auxiliarReferencia}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.auxiliarAmbulancia}</td>
                                        <td className="border-r border-b px-2 py-2">{traslado.archivo}</td>
                                        <td className={`border-r border-b px-2 py-2 ${traslado.estado === "PENDIENTE" ? "bg-yellow-300" : ""} ${traslado.estado === "VALIDADO" ? "bg-green-400" : ""}`}
                                        >
                                            {traslado.estado}
                                        </td>
                                        <td className="border-r border-b px-2 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${facturaciones.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {facturaciones.length}
                                            </span>
                                        </td>
                                        <td className="border-r border-b px-2 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cuentasMedicas.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {cuentasMedicas.length}
                                            </span>
                                        </td>
                                    </tr>

                                    {/* ── Fila expandida ── */}
                                    {expandido[traslado.id] && (
                                        <tr key={`exp-${traslado.id}`}>
                                            <td colSpan={9} className="bg-gray-50 px-6 py-3 border-t">

                                                {/* Facturaciones */}
                                                <p className="text-xs font-bold text-green-700 uppercase mb-1"><FontAwesomeIcon icon={faDollar} className="w-4 h-4" />Facturación</p>
                                                {facturaciones.length === 0 ? (
                                                    <p className="text-xs text-gray-400 mb-3">Sin facturación</p>
                                                ) : (
                                                    <table className="w-full text-xs mb-3 border rounded">
                                                        <thead className="bg-green-50 text-green-800">
                                                            <tr>
                                                                {/* <th className="px-2 py-1 text-left">ID</th> */}
                                                                <th className="border-r px-2 py-1 text-left">Prefactura</th>
                                                                <th className="border-r px-2 py-1 text-left">Factura</th>
                                                                <th className="border-r px-2 py-1 text-left">Valor</th>
                                                                <th className="border-r px-2 py-1 text-left">Facturador</th>
                                                                <th className="border-r px-2 py-1 text-left">F. Factura</th>
                                                                <th className="border-r px-2 py-1 text-left">Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {facturaciones.map(f => (
                                                                <tr key={f.id} className="border-t">
                                                                    {/* <td className="px-2 py-1">{f.id}</td> */}
                                                                    <td className="border-r  px-2 py-1">{f.prefactura}</td>
                                                                    <td className="border-r px-2 py-1">{f.factura}</td>
                                                                    <td className="border-r px-2 py-1">${f.valor?.toLocaleString()}</td>
                                                                    <td className="border-r px-2 py-1">{f.nombreFacturador}</td>
                                                                    <td className="border-r px-2 py-1">{f.fechaFactura?.slice(0, 10)}</td>
                                                                    <td className={`px-2 py-1 ${f.estado === "PENDIENTE" ? "bg-yellow-300" : ""} ${f.estado === "FACTURADO" ? "bg-green-400" : ""}`}
                                                                    >
                                                                        {f.estado}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        {datosFiltrados.length === 0 && (
                                                            <tr>
                                                                <td colSpan={14} className="text-center py-4 text-gray-500">
                                                                    {busqueda
                                                                        ? `No se encontraron traslados con "${busqueda}"`
                                                                        : 'No hay traslados registrados.'
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )}

                                                    </table>
                                                )}

                                                {/* Cuentas Médicas */}
                                                <p className="text-xs font-bold text-blue-700 uppercase mb-1"><FontAwesomeIcon icon={faBookMedical} className="w-4 h-4" />Cuentas Médicas</p>
                                                {cuentasMedicas.length === 0 ? (
                                                    <p className="text-xs text-gray-400">Sin cuentas médicas</p>
                                                ) : (
                                                    <table className="w-full text-xs border rounded">
                                                        <thead className="bg-blue-50 text-blue-800">
                                                            <tr>
                                                                {/* <th className="px-2 py-1 text-left">ID</th> */}
                                                                <th className="border-r px-2 py-1 text-left">Fecha Cuenta</th>
                                                                <th className="border-r px-2 py-1 text-left">Servicio Egreso</th>
                                                                <th className="border-r px-2 py-1 text-left">Responsable</th>
                                                                <th className="border-r px-2 py-1 text-left">Observaciones</th>
                                                                <th className="px-2 py-1 text-left">Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cuentasMedicas.map(c => (
                                                                <tr key={c.id} className="border-t">
                                                                    {/* <td className="px-2 py-1">{c.id}</td> */}
                                                                    <td className="border-r px-2 py-1">{c.fechaCuenta?.slice(0, 10)}</td>
                                                                    <td className="border-r px-2 py-1">{c.servicioEgreso}</td>
                                                                    <td className="border-r px-2 py-1">{c.responsableAuditoria}</td>
                                                                    <td className="border-r px-2 py-1">{c.observaciones}</td>
                                                                    <td className={`px-2 py-1 ${c.estado === "PENDIENTE" ? "bg-yellow-300" : ""} ${c.estado === "AUDITADO" ? "bg-green-400" : ""}`}
                                                                    >
                                                                        {c.estado}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ✅ Paginación al fondo */}
                <div className="flex-shrink-0 p-2 bg-gray-50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div >
    );
}