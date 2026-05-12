import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilter, faTable, faSpinner, faChevronDown, faChevronRight, faAmbulance, faTruckMedical, faFileEdit, faFileAlt, faDollar, faBookMedical, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { obtenerReporteTraslados } from '../../../referencia-contrareferencia/api/trasladosService';

export default function ReporteTraslado() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Lee los roles del token directamente
    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // authorities: "ROLE_X" (string) o ["ROLE_X", "ROLE_Y"]
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

    const validarRangoFechas = (inicio, fin) => {
        if (!inicio || !fin) {
            return 'Debes seleccionar fecha inicio y fecha fin';
        }

        const fechaInicioObj = new Date(inicio);
        const fechaFinObj = new Date(fin);

        if (fechaFinObj < fechaInicioObj) {
            return 'La fecha fin no puede ser menor que la fecha inicio';
        }

        const maxFecha = new Date(fechaInicioObj);
        maxFecha.setMonth(maxFecha.getMonth() + 3);

        if (fechaFinObj > maxFecha) {
            return 'El rango máximo permitido es de 3 meses';
        }

        return '';
    };

    const formatearFecha = (valor) => {
        if (!valor) return '';
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) return valor;
        return fecha.toLocaleDateString('es-CO');
    };

    const formatearFechaHora = (valor) => {
        if (!valor) return '';
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) return valor;
        return fecha.toLocaleString('es-CO');
    };

    const formatearMedicamentos = (medicamentos) => {
        if (!medicamentos) return '';
        if (Array.isArray(medicamentos)) return medicamentos.join(', ');
        return medicamentos;
    };

    const handleGenerar = async () => {
        const mensajeValidacion = validarRangoFechas(fechaInicio, fechaFin);

        if (mensajeValidacion) {
            setError(mensajeValidacion);
            setData([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await obtenerReporteTraslados(fechaInicio, fechaFin);
            setData(Array.isArray(response) ? response : []);
        } catch (err) {
            const backendMessage =
                err?.response?.data?.message || err?.response?.data?.error;
            setError(backendMessage || 'No fue posible generar el reporte');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExportarExcel = () => {
        if (!data.length) {
            setError('No hay datos para exportar');
            return;
        }

        const exportData = [...data]
            .sort((a, b) => new Date(b.fechaTraslado) - new Date(a.fechaTraslado))
            .map((item) => ({
                'ID TRASLADO': item.idTraslado || '',
                'FECHA TRASLADO': item.fechaTraslado ? formatearFechaHora(item.fechaTraslado) : '',
                NOMBRE: item.nomPaciente || '',
                DOCUMENTO: item.documento || '',
                INGRESO: item.ingreso || '',
                EPS: item.eps || '',
                'TIPO DE TRASLADO': item.tipoTraslado || '',
                SERVICIO: item.servicio || '',
                DESTINO: item.destino || '',
                CIUDAD: item.ciudad || '',
                AUTORIZACION: item.autorizacion || '',
                'AUXILIAR REFERENCIA': item.auxiliarReferencia || '',
                'AUXILIAR AMBULANCIA': item.auxiliarAmbulancia || '',
                MEDICAMENTOS: formatearMedicamentos(item.medicamentos),
                ARCHIVO: item.archivo || '',
                'OBSERVACION TRASLADO': item.observacionTraslado || '',
                'ESTADO TRASLADO': item.estadoTraslado || '',
                'FECHA PREFACTURA': item.fechaPrefactura ? formatearFecha(item.fechaPrefactura) : '',
                PREFACTURA: item.prefactura || '',
                PRODUCCION: item.produccion || '',
                'FECHA FACTURA': item.fechaFactura ? formatearFecha(item.fechaFactura) : '',
                FACTURA: item.factura || '',
                VALOR: item.valor !== null && item.valor !== undefined && item.valor !== ''
                    ? Number(item.valor)
                    : '',
                FACTURADOR: item.nombreFacturador || '',
                'ESTADO FACTURACION': item.estadoFacturacion || '',
                'FECHA CUENTA': item.fechaCuenta ? formatearFechaHora(item.fechaCuenta) : '',
                'SERVICIO EGRESO': item.servicioEgreso || '',
                'RESPONSABLE AUDITORIA': item.responsableAuditoria || '',
                'OBSERVACION CUENTAS': item.observacionCuentas || '',
                'ESTADO CUENTA': item.estadoCuenta || '',
                'FECHA EGRESO': item.fechaEgreso ? formatearFechaHora(item.fechaEgreso) : ''
            }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const colWidths = Object.keys(exportData[0]).map((key) => {
            const maxLength = Math.max(
                key.length,
                ...exportData.map((row) => String(row[key] ?? '').length)
            );

            return { wch: Math.min(maxLength + 2, 45) };
        });

        worksheet['!cols'] = colWidths;

        worksheet['!autofilter'] = {
            ref: worksheet['!ref']
        };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Traslados');

        XLSX.writeFile(
            workbook,
            `reporte_traslados_${fechaInicio}_a_${fechaFin}.xlsx`
        );
    };

    return (
        <div className="p-2 md:p-2">
            <div className="bg-white shadow-md rounded-lg p-2 md:p-2">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-4xl font-bold text-gray-800">
                        <FontAwesomeIcon icon={faTable} className="mr-2 text-green-700" />
                        Reporte de Traslados
                    </h1>
                </div>

                <p className="text-sm text-gray-600">
                    Consulta y exporta la información consolidada de traslados,
                    facturación y cuentas médicas.
                </p>

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
                                className="font-bold mx-2 my-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                            >
                                <FontAwesomeIcon icon={faBookMedical} className="w-4 h-4 text-white pr-2" />Cuentas Medicas
                            </button>)}
                            <button
                                onClick={() => navigate('/referenciacontrareferencia/reporte')}
                                className="font-bold mx-2 my-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 text-white pr-2" />Reporte
                            </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha inicio
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha fin
                        </label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        onClick={handleGenerar}
                        disabled={loading}
                        className="font-bold px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                    >
                        <FontAwesomeIcon
                            icon={loading ? faSpinner : faFilter}
                            className={`pr-2 ${loading ? 'animate-spin' : ''}`}
                        />
                        {loading ? 'Generando...' : 'Generar'}
                    </button>

                    <button
                        onClick={handleExportarExcel}
                        disabled={!data.length}
                        className="font-bold px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 disabled:bg-gray-300"
                    >
                        <FontAwesomeIcon icon={faFileExcel} className="pr-2" />
                        Exportar Excel
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-6">
                    <div className="mb-3 text-sm text-gray-600">
                        Total registros:{' '}
                        <span className="font-semibold">{data.length}</span>
                    </div>

                    <div className="overflow-auto border rounded-lg">
                        <table className="min-w-full text-xs text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border">ID Traslado</th>
                                    <th className="px-3 py-2 border">Fecha Traslado</th>
                                    <th className="px-3 py-2 border">Nombre</th>
                                    <th className="px-3 py-2 border">Documento</th>
                                    <th className="px-3 py-2 border">Ingreso</th>
                                    <th className="px-3 py-2 border">EPS</th>
                                    <th className="px-3 py-2 border">Tipo Traslado</th>
                                    <th className="px-3 py-2 border">Servicio</th>
                                    <th className="px-3 py-2 border">Destino</th>
                                    <th className="px-3 py-2 border">Ciudad</th>
                                    <th className="px-3 py-2 border">Autorización</th>
                                    <th className="px-3 py-2 border">Aux. Referencia</th>
                                    <th className="px-3 py-2 border">Aux. Ambulancia</th>
                                    <th className="px-3 py-2 border">Medicamentos</th>
                                    <th className="px-3 py-2 border">Archivo</th>
                                    <th className="px-3 py-2 border">Obs. Traslado</th>
                                    <th className="px-3 py-2 border">Estado Traslado</th>
                                    <th className="px-3 py-2 border">Fecha Prefactura</th>
                                    <th className="px-3 py-2 border">Prefactura</th>
                                    <th className="px-3 py-2 border">Producción</th>
                                    <th className="px-3 py-2 border">Fecha Factura</th>
                                    <th className="px-3 py-2 border">Factura</th>
                                    <th className="px-3 py-2 border">Valor</th>
                                    <th className="px-3 py-2 border">Facturador</th>
                                    <th className="px-3 py-2 border">Estado Facturación</th>
                                    <th className="px-3 py-2 border">Fecha Cuenta</th>
                                    <th className="px-3 py-2 border">Servicio Egreso</th>
                                    <th className="px-3 py-2 border">Responsable Auditoría</th>
                                    <th className="px-3 py-2 border">Obs. Cuentas</th>
                                    <th className="px-3 py-2 border">Estado Cuenta</th>
                                    <th className="px-3 py-2 border">Fecha Egreso</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.idTraslado || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearFechaHora(item.fechaTraslado)}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.nomPaciente || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.documento || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.ingreso || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.eps || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.tipoTraslado || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.servicio || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.destino || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.ciudad || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.autorizacion || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.auxiliarReferencia || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.auxiliarAmbulancia || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearMedicamentos(item.medicamentos)}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.archivo || ''}
                                            </td>
                                            <td className="px-3 py-2 border">
                                                {item.observacionTraslado || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.estadoTraslado || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearFecha(item.fechaPrefactura)}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.prefactura || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.produccion || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearFecha(item.fechaFactura)}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.factura || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.valor || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.nombreFacturador || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.estadoFacturacion || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearFechaHora(item.fechaCuenta)}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.servicioEgreso || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.responsableAuditoria || ''}
                                            </td>
                                            <td className="px-3 py-2 border">
                                                {item.observacionCuentas || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {item.estadoCuenta || ''}
                                            </td>
                                            <td className="px-3 py-2 border whitespace-nowrap">
                                                {formatearFechaHora(item.fechaEgreso)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={31}
                                            className="text-center py-6 text-gray-500"
                                        >
                                            No hay datos para mostrar
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}