import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookMedical, faDollar, faFileEdit, faFileAlt, faPencilAlt, faTruckMedical, faSearch, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';
//import { obtenerCuentasMedicas, cambiarEstadoCuentaMedica } from '../../../api/referenciaContrareferencia/cuentasMedicasService';
import { obtenerCuentasMedicas, cambiarEstadoCuentaMedica } from '../../api/cuentasMedicasService';
const PAGE_SIZE = 50; // máximo por página

export default function CuentasMedicasTable({ onEdit = () => { }, reloadFlag }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [seleccionados, setSeleccionados] = useState(new Set());
    const [procesando, setProcesando] = useState(false);

    // Lee los roles del token
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

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerCuentasMedicas();
            setData(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle individual
    const toggleCheck = (id) => {
        setSeleccionados(prev => {
            const nuevo = new Set(prev);
            nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
            return nuevo;
        });
    };

    // Cambiar estado
    const cambiarEstado = async (nuevoEstado) => {
        if (seleccionados.size === 0) {
            alert('Selecciona al menos un traslado');
            return;
        }

        // ✅ Confirmación antes de proceder
        const confirmacion = window.confirm(
            `¿Estás seguro de que deseas ${nuevoEstado === 'AUDITADO' ? 'AUDITAR' : 'PENDIENTE'} 
${seleccionados.size} cuenta(s) médica(s)?`
        );

        if (!confirmacion) return; // ← Si cancela, no hace nada

        setProcesando(true);
        try {
            await Promise.all(
                [...seleccionados].map(id =>
                    cambiarEstadoCuentaMedica(id, nuevoEstado)
                )
            );
            setSeleccionados(new Set());
            loadData();
            alert(`✅ ${seleccionados.size} cuenta(s) médica(s) ${nuevoEstado === 'AUDITADO' ? 'auditada(s)' : 'pendiente(s)'} correctamente`);
        } catch (err) {
            alert('❌ Error al cambiar estado: ' + err.message);
        } finally {
            setProcesando(false);
        }
    };

    useEffect(() => { loadData(); }, [reloadFlag]);

    const dataFiltrada = data
        // filtro por texto
        .filter(t => {
            if (busqueda.trim() === '') return true;
            const q = busqueda.toLowerCase();
            return (
                t.documento?.toLowerCase().includes(q) ||
                t.nomPaciente?.toLowerCase().includes(q) ||
                t.ingreso?.toString().toLowerCase().includes(q)
            );
        })
        // filtro por estado
        .filter(t => {
            if (filtroEstado === 'TODOS') return true;
            return t.estado === filtroEstado; // 'PENDIENTE' o 'AUDITADO'
        });

    const totalPages = Math.ceil(dataFiltrada.length / PAGE_SIZE);
    const paginatedData = dataFiltrada.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    if (loading) return <p>Cargando cuentas medicas...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-2 w-full max-w-none">

            {/* ✅ Botones con navegación */}
            <button
                onClick={() => navigate('/referenciacontrareferencia/totaltraslados')}
                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
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
                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                    <span className="font-medium"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" /> Buscar:</span>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => {
                            setBusqueda(e.target.value);
                            setPage(0); // resetea a página 1 al buscar
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
                            <option value="AUDITADO">Auditado</option>
                        </select>
                    </div>

                    {/* ✅ Control tamaño texto */}
                    <div className="flex justify-end items-center mb-2 space-x-2">
                        <span>Tamaño texto:</span>
                        <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A–</button>
                        <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">A+</button>
                    </div>
                </div>
            </div>

            {/* ✅ Contenedor con scroll */}
            <div
                className="relative mb-8 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col w-full"
                style={{ minHeight: '400px', maxHeight: '900px' }}>

                <div className="flex justify-end">
                    <span className="text-sm text-gray-500 my-auto mr-2">
                        {seleccionados.size > 0 && `${seleccionados.size} seleccionado(s)`}
                    </span>
                    {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<button
                        onClick={() => cambiarEstado('AUDITADO')}
                        disabled={procesando || seleccionados.size === 0}
                        className="hover:cursor-pointer text-xs font-semibold mx-1 my-2 px-1 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-white" /> Auditado
                    </button>)}
                    {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<button
                        onClick={() => cambiarEstado('PENDIENTE')}
                        disabled={procesando || seleccionados.size === 0}
                        className="hover:cursor-pointer text-xs font-semibold mx-1 my-2 px-1 py-1 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-white font-bold" /> Pendiente
                    </button>)}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full table-auto text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<th className="hover:cursor-pointer px-2 py-0.5">
                                    {/* Seleccionar todos */}
                                    <input
                                        type="checkbox"
                                        className="hover:cursor-pointer"
                                        onChange={e => {
                                            if (e.target.checked) setSeleccionados(new Set(data.map(t => t.id)));
                                            else setSeleccionados(new Set());
                                        }}
                                        checked={seleccionados.size === data.length && data.length > 0}
                                    />
                                </th>)}
                                <th className="px-2 py-0.5 font-semibold">Traslado ID</th>
                                <th className="px-2 py-0.5 font-semibold">Documento</th>
                                <th className="px-2 py-0.5 font-semibold">Paciente</th>
                                <th className="px-2 py-0.5 font-semibold">Fecha Cuenta</th>
                                <th className="px-2 py-0.5 font-semibold">Servicio Egreso</th>
                                <th className="px-2 py-0.5 font-semibold">Fecha Egreso</th>
                                <th className="px-2 py-0.5 font-semibold">Responsable Auditoria</th>
                                <th className="px-2 py-0.5 font-semibold">Observaciones</th>
                                <th className="px-2 py-0.5 font-semibold">Estado</th>
                                {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<th className="px-2 py-0.5 font-semibold">Acciones</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(t => (
                                <tr
                                    key={t.id}
                                    className={`border-b hover:bg-gray-50 ${seleccionados.has(t.id) ? 'bg-blue-50' : ''}`}
                                >
                                    {/* Checkbox */}
                                    {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<td className="px-2 py-0.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={seleccionados.has(t.id)}
                                            onChange={() => toggleCheck(t.id)}
                                            className="hover:cursor-pointer"
                                        />
                                    </td>)}
                                    <td className="border-r px-1 py-0.5">{t.trasladoId}</td>
                                    <td className="border-r px-1 py-0.5">{t.documento}</td>
                                    <td className="border-r px-1 py-0.5">{t.nomPaciente}</td>
                                    <td className="border-r px-1 py-0.5">
                                        {t.fechaCuenta?.replace('T', ' ').slice(0, 16)}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.servicioEgreso}</td>
                                    <td className="border-r px-1 py-0.5">
                                        {t.fechaEgreso?.replace('T', ' ').slice(0, 16)}
                                    </td>
                                    <td className="border-r px-1 py-0.5">{t.responsableAuditoria}</td>
                                    <td className="border-r px-1 py-0.5">{t.observaciones}</td>
                                    <td className={`border-r px-1 py-0.5 font-semibold ${t.estado === "PENDIENTE" ? "bg-yellow-300" : ""} ${t.estado === "AUDITADO" ? "bg-green-400" : ""}`}
                                    >
                                        {t.estado}
                                    </td>
                                    {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER') && (<td className="px-3 py-2">
                                        <button onClick={() => onEdit(t)}>
                                            <FontAwesomeIcon
                                                icon={faPencilAlt}
                                                className="w-4 h-4 text-blue-600 cursor-pointer hover:-translate-y-1 transition duration-300"
                                            />
                                        </button>
                                    </td>)}
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="text-center py-4 text-gray-500">
                                        No hay Cuentas Medicas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* ✅ Paginación al fondo */}
                <div className="flex-shrink-0 p-2 border-t bg-gray-50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
}
