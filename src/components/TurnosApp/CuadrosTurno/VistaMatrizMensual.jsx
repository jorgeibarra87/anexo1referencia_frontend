import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faSave, faArrowLeft, faTimesCircle,
    faFileExcel, faCheck, faEdit, faDownload, faFileExport
} from '@fortawesome/free-solid-svg-icons';
import { apiProgramacionDiariaService } from '../../../api/turnos/apiProgramacionDiariaService';
import { apiTipoJornadaService } from '../../../api/turnos/apiTipoJornadaService';
import { apiCuadroService } from '../../../api/turnos/apiCuadroService';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function VistaMatrizMensual() {
    const { id } = useParams();
    const navigate = useNavigate();
    const tableRef = useRef(null);

    const [matriz, setMatriz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [tiposJornada, setTiposJornada] = useState([]);
    const [successMsg, setSuccessMsg] = useState(null);
    const [celdasEditadas, setCeldasEditadas] = useState(new Map());
    const [importando, setImportando] = useState(false);
    const [exportando, setExportando] = useState(false);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [matrizData, tiposData] = await Promise.all([
                apiProgramacionDiariaService.obtenerMatriz(id),
                apiTipoJornadaService.getAll()
            ]);
            setMatriz(matrizData);
            setTiposJornada(tiposData);
            setCeldasEditadas(new Map());
        } catch (err) {
            setError('Error al cargar la matriz: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const obtenerCodigoDia = (filaIdx, diaMes) => {
        const clave = `${filaIdx}_${diaMes}`;
        if (celdasEditadas.has(clave)) return celdasEditadas.get(clave);
        const fila = matriz?.filas?.[filaIdx];
        if (!fila) return '';
        const celda = fila.celdas?.find(c => c.diaMes === diaMes);
        return celda?.codigoJornada || '';
    };

    const handleCeldaChange = (filaIdx, diaMes, codigo) => {
        const clave = `${filaIdx}_${diaMes}`;
        setCeldasEditadas(prev => {
            const next = new Map(prev);
            if (codigo) next.set(clave, codigo);
            else next.delete(clave);
            return next;
        });
    };

    const getColorJornada = (codigo) => {
        const tj = tiposJornada.find(t => t.codigo === codigo);
        return tj?.color || '#FFFFFF';
    };

    const getNombreJornada = (codigo) => {
        const tj = tiposJornada.find(t => t.codigo === codigo);
        return tj?.nombre || codigo || '';
    };

    const handleGuardarMatriz = async () => {
        if (!matriz) return;
        try {
            setSaving(true);
            setError(null);

            const celdasExistentes = new Map();
            for (const fila of matriz.filas) {
                for (const celda of (fila.celdas || [])) {
                    if (celda.codigoJornada) {
                        celdasExistentes.set(`${fila.idPersona}_${celda.diaMes}`, celda.codigoJornada);
                    }
                }
            }
            for (const [clave, codigo] of celdasEditadas) {
                const [filaIdx, diaMes] = clave.split('_').map(Number);
                const fila = matriz.filas[filaIdx];
                if (fila) {
                    const key = `${fila.idPersona}_${diaMes}`;
                    if (codigo) celdasExistentes.set(key, codigo);
                    else celdasExistentes.delete(key);
                }
            }

            const celdas = [];
            for (const [key, codigo] of celdasExistentes) {
                const [idPersona, diaMes] = key.split('_').map(Number);
                celdas.push({ idPersona, diaMes, codigoJornada: codigo, observacion: null });
            }

            if (celdas.length === 0) {
                setError('No hay datos en la matriz para guardar');
                setSaving(false);
                return;
            }

            await apiProgramacionDiariaService.guardarMatriz(id, celdas);
            setSuccessMsg(`Matriz guardada (${celdas.length} celdas)`);
            setCeldasEditadas(new Map());
            await cargarDatos();
        } catch (err) {
            setError('Error al guardar: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleAutoLlenar = () => {
        if (!matriz || tiposJornada.length === 0) return;
        const trabajo = tiposJornada.filter(t => t.esTrabajo);
        if (trabajo.length === 0) return;
        const nuevaEdicion = new Map();
        matriz.filas.forEach((fila, fi) => {
            for (let dia = 1; dia <= matriz.diasDelMes; dia++) {
                const clave = `${fi}_${dia}`;
                const celdaExistente = fila.celdas?.find(c => c.diaMes === dia);
                if (!celdaExistente?.codigoJornada) {
                    nuevaEdicion.set(clave, trabajo[dia % trabajo.length].codigo);
                }
            }
        });
        setCeldasEditadas(nuevaEdicion);
    };

    const handleImportarExcel = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setImportando(true);
            setError(null);
            const resultado = await apiProgramacionDiariaService.importarExcel(id, file);
            setSuccessMsg(`Importación exitosa: ${resultado.filas} filas`);
            await cargarDatos();
        } catch (err) {
            setError('Error al importar: ' + (err.response?.data?.error || err.message));
        } finally {
            setImportando(false);
            e.target.value = '';
        }
    };

    const handleExportarExcel = async () => {
        if (!matriz) return;
        setExportando(true);
        try {
            const XLSX = await import('xlsx');

            const wsData = [];
            const headerRow = ['EMPLEADO', 'DOCUMENTO', 'PERFIL'];
            for (let d = 1; d <= matriz.diasDelMes; d++) headerRow.push(String(d));
            wsData.push(headerRow);

            for (const fila of matriz.filas) {
                const row = [fila.nombrePersona, fila.documento || '', fila.perfil || ''];
                for (let d = 1; d <= matriz.diasDelMes; d++) {
                    const celda = fila.celdas?.find(c => c.diaMes === d);
                    row.push(celda?.codigoJornada || '');
                }
                wsData.push(row);
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            const colWidths = [{ wch: 40 }, { wch: 15 }, { wch: 20 }];
            for (let d = 1; d <= matriz.diasDelMes; d++) colWidths.push({ wch: 5 });
            ws['!cols'] = colWidths;

            XLSX.utils.book_append_sheet(wb, ws, 'MATRIZ');
            const nombreArchivo = `MATRIZ_${matriz.nombreCuadro || 'turnos'}_${matriz.mes}_${matriz.anio}.xlsx`
                .replace(/[^a-zA-Z0-9_.\-]/g, '_');

            XLSX.writeFile(wb, nombreArchivo);
            setSuccessMsg('Matriz exportada a Excel');
        } catch (err) {
            setError('Error al exportar: ' + err.message);
        } finally {
            setExportando(false);
        }
    };

    const tieneCambios = celdasEditadas.size > 0;
    const matrizTieneDatos = matriz?.filas?.some(f => f.celdas?.some(c => c.codigoJornada)) || false;
    const diasDelMes = matriz?.diasDelMes || 30;
    const diasArray = Array.from({ length: diasDelMes }, (_, i) => i + 1);

    const getCodeDisplay = (codigo) => {
        if (!codigo) return { short: '', full: '', color: '#FFFFFF', textColor: '#6B7280' };
        const tj = tiposJornada.find(t => t.codigo === codigo);
        const bg = tj?.color || '#F3F4F6';
        const isLight = !tj?.esTrabajo;
        const text = isLight ? '#6B7280' : '#1F2937';
        return { short: codigo, full: tj?.nombre || codigo, color: bg, textColor: text };
    };

    if (loading) {
        return (
            <div className="w-full mx-auto p-4 flex justify-center items-center min-h-screen">
                <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="text-lg font-semibold">Cargando matriz...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faCalendarAlt} className="w-7 h-7 text-green-500" />
                            <h1 className="text-xl font-bold text-gray-800">Matriz de Turnos</h1>
                        </div>
                        {matriz && (
                            <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border">
                                <span className="font-semibold text-gray-700">{matriz.nombreCuadro}</span>
                                <span className="text-gray-400">|</span>
                                <span>{matriz.mes}/{matriz.anio}</span>
                                {matriz.entidad && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-medium">{matriz.entidad}</span>}
                                {matriz.tipoPersonal && <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-medium">{matriz.tipoPersonal}</span>}
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">{matriz.filas.length} pers.</span>
                                <span className="text-gray-500">{diasDelMes} días</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button onClick={handleAutoLlenar}
                            className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-xs font-medium flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faEdit} className="w-3 h-3" /> Auto-llenar
                        </button>
                        <label className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                            <FontAwesomeIcon icon={faFileExcel} className="w-3 h-3" />
                            {importando ? 'Importando...' : 'Importar Excel'}
                            <input type="file" accept=".xlsx,.xls" onChange={handleImportarExcel} className="hidden" disabled={importando} />
                        </label>
                        <a href={apiProgramacionDiariaService.descargarPlantilla(diasDelMes)} download
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-xs font-medium flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faDownload} className="w-3 h-3" /> Plantilla
                        </a>
                        <button onClick={handleExportarExcel} disabled={exportando || !matrizTieneDatos}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5
                                ${exportando || !matrizTieneDatos ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                            <FontAwesomeIcon icon={faFileExport} className="w-3 h-3" />
                            {exportando ? 'Exportando...' : 'Exportar Excel'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {tiposJornada.filter(t => t.estado).map(tj => (
                            <span key={tj.codigo}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border"
                                style={{ backgroundColor: tj.color || '#F3F4F6', borderColor: '#D1D5DB' }}>
                                <strong>{tj.codigo}</strong>
                                <span className="text-gray-600">{tj.nombre}</span>
                                {tj.horaInicio && <span className="text-gray-400 ml-0.5">{tj.horaInicio}-{tj.horaFin}</span>}
                            </span>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" /> {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mx-4 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex justify-between items-center">
                        <span><FontAwesomeIcon icon={faCheck} className="mr-1.5" />{successMsg}</span>
                        <button onClick={() => setSuccessMsg(null)} className="text-green-500 hover:text-green-700"><FontAwesomeIcon icon={faTimesCircle} /></button>
                    </div>
                )}

                {matriz && (
                    <div className="p-4">
                        {matriz.filas.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <FontAwesomeIcon icon={faCalendarAlt} className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">Matriz vacía</p>
                                <p className="text-sm">Usa "Importar Excel" o "Auto-llenar" para comenzar</p>
                            </div>
                        ) : (
                            <div className="overflow-auto border border-gray-200 rounded-lg shadow-inner max-h-[65vh]">
                                <table ref={tableRef} className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800 text-white sticky top-0 z-20">
                                            <th className="sticky left-0 z-30 bg-gray-800 px-3 py-2 text-left min-w-[180px] border-r border-gray-700">
                                                <div className="font-bold text-sm">Empleado</div>
                                                <div className="text-[10px] text-gray-300 font-normal">Documento / Perfil</div>
                                            </th>
                                            {diasArray.map(dia => {
                                                const fecha = new Date(parseInt(matriz.anio), parseInt(matriz.mes) - 1, dia);
                                                const ds = fecha.getDay();
                                                const esFinde = ds === 0 || ds === 6;
                                                return (
                                                    <th key={dia}
                                                        className={`px-1 py-1.5 text-center min-w-[38px] ${esFinde ? 'bg-red-700' : 'bg-gray-700'}`}>
                                                        <div className="font-bold text-[13px]">{dia}</div>
                                                        <div className="text-[9px] text-gray-300 font-normal">{DIAS_SEMANA[ds === 0 ? 6 : ds - 1]}</div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matriz.filas.map((fila, fi) => (
                                            <tr key={fila.idPersona} className={`${fi % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                                <td className="sticky left-0 z-10 bg-inherit px-3 py-1.5 border-r border-gray-200 min-w-[180px]">
                                                    <div className="font-semibold text-gray-800 text-sm truncate max-w-[200px]">{fila.nombrePersona}</div>
                                                    <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                                                        {fila.documento && <span className="mr-1">{fila.documento}</span>}
                                                        {fila.perfil && <span>| {fila.perfil.length > 30 ? fila.perfil.substring(0, 30) + '...' : fila.perfil}</span>}
                                                    </div>
                                                </td>
                                                {diasArray.map(dia => {
                                                    const clave = `${fi}_${dia}`;
                                                    const codigoActual = obtenerCodigoDia(fi, dia);
                                                    const celdaOrig = fila.celdas?.find(c => c.diaMes === dia);
                                                    const codigoOriginal = celdaOrig?.codigoJornada || '';
                                                    const esCambio = celdasEditadas.has(clave);
                                                    const display = getCodeDisplay(codigoActual || codigoOriginal);

                                                    return (
                                                        <td key={dia}
                                                            className={`p-0 text-center border border-gray-100 relative ${esCambio ? 'ring-2 ring-blue-400 ring-inset z-10' : ''}`}
                                                            style={{ backgroundColor: display.color }}>
                                                            <select
                                                                value={codigoActual || codigoOriginal || ''}
                                                                onChange={(e) => handleCeldaChange(fi, dia, e.target.value)}
                                                                className="w-full h-full min-h-[36px] text-center text-[12px] font-bold border-0 bg-transparent cursor-pointer appearance-none
                                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset px-1"
                                                                style={{ color: display.textColor }}
                                                                title={`${fila.nombrePersona} - Día ${dia}: ${display.full}`}
                                                            >
                                                                <option value="">-</option>
                                                                    {tiposJornada.filter(t => t.estado).map(tj => (
                                                                        <option key={tj.codigo} value={tj.codigo}>{tj.codigo}</option>
                                                                    ))}
                                                            </select>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {matriz && matriz.filas.length > 0 && (
                    <div className="px-4 pb-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                            <button onClick={handleGuardarMatriz} disabled={saving || matriz.filas.length === 0}
                                className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium
                                    ${saving || matriz.filas.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 text-white hover:bg-green-600'}`}>
                                <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                                {saving ? 'Guardando...' : 'Guardar Matriz'}
                            </button>
                            {tieneCambios && (
                                <>
                                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                        {celdasEditadas.size} cambio(s)
                                    </span>
                                    <button onClick={() => setCeldasEditadas(new Map())}
                                        className="px-3 py-2 text-gray-500 hover:text-red-500 text-sm flex items-center gap-1">
                                        <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" /> Deshacer
                                    </button>
                                </>
                            )}
                        </div>
                        <button onClick={() => navigate('/turnos/cuadro-turnos')}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" /> Volver
                        </button>
                    </div>
                )}

                {!matriz && !loading && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg">No se encontró el cuadro de turno</p>
                    </div>
                )}
            </div>
        </div>
    );
}
