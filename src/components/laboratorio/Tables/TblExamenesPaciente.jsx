import { useEffect, useRef, useState } from 'react';
import usePacientesPorPrioridad from '../../../hooks/laboratorio/usePacientesPorPrioridad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFlask, faSync, faPaperPlane, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../Pagination';
import useSaveExamenTomados from '../../../hooks/laboratorio/useSaveExamenTomados';
import { obtenerExamenesTomadosPorIngresos, guardarExamenesImpresion, actualizarExamenesTomados } from '../../../api/laboratorio/examenesService';
import { toast } from 'react-toastify';


export default function TblExamenesPaciente({ tipo, titulo }) {

    const { data, loading: loadingData, error, fetchData } = usePacientesPorPrioridad();
    const { data: savedData, loading: loadingSave, error: saveError, saveExamenTomado } = useSaveExamenTomados();

    const [page, setPage] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    // Estado para exámenes tomados desde backend
    const [examenesTomados, setExamenesTomados] = useState([]);
    const [loadingTomados, setLoadingTomados] = useState(false);

    const colorHeaderMap = { "muy urgentes": "bg-red-700", urgentes: "bg-red-500", prioritarios: "bg-yellow-500", rutinarios: "bg-green-600" };
    // Tamaño de texto de la tabla
    const [fontSize, setFontSize] = useState(10); // por defecto pequeño
    // Funciones para ajustar tamaño
    const aumentarTexto = () => setFontSize((prev) => Math.min(prev + 1, 16));
    const reducirTexto = () => setFontSize((prev) => Math.max(prev - 1, 8));

    // Alturas mínima, máxima e inicial
    const MIN_HEIGHT = 300;
    const MAX_HEIGHT = 900;
    const INITIAL_HEIGHT = 400;

    // Referencias y estado
    const containerRef = useRef(null);
    const [height, setHeight] = useState(INITIAL_HEIGHT);
    const isResizingRef = useRef(false);
    const startYRef = useRef(0);
    const startHeightRef = useRef(0);

    // Función para limitar los valores
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // Inicia el redimensionamiento
    const startResizing = (e) => {
        e.preventDefault();
        isResizingRef.current = true;
        startYRef.current = e.clientY;
        startHeightRef.current = containerRef.current?.offsetHeight || INITIAL_HEIGHT;
        window.addEventListener("mousemove", handleResizing);
        window.addEventListener("mouseup", stopResizing);
    };

    // Mientras el mouse se mueve
    const handleResizing = (e) => {
        if (!isResizingRef.current) return;
        const dy = e.clientY - startYRef.current;
        const newHeight = clamp(startHeightRef.current + dy, MIN_HEIGHT, MAX_HEIGHT);
        setHeight(newHeight);
    };

    // Cuando se suelta el mouse
    const stopResizing = () => {
        isResizingRef.current = false;
        window.removeEventListener("mousemove", handleResizing);
        window.removeEventListener("mouseup", stopResizing);
    };

    // Cargar exámenes tomados desde backend
    useEffect(() => {
        const cargarExamenesTomados = async () => {
            if (!data?.content || data.content.length === 0) {
                setExamenesTomados([]);
                return;
            }

            try {
                setLoadingTomados(true);

                const ingresos = [...new Set(data.content.map(p => String(p.ingreso)))];

                if (ingresos.length === 0) {
                    console.warn('No hay ingresos válidos para consultar');
                    setExamenesTomados([]);
                    return;
                }

                const response = await obtenerExamenesTomadosPorIngresos(ingresos);
                setExamenesTomados(response || []);

            } catch (error) {
                console.error('Error cargando exámenes tomados:', error);

                // detalle del error
                if (error.response) {
                    console.error('Error del servidor:', error.response.data);
                    console.error('Status:', error.response.status);
                }

                // Continuar sin filtrado
                setExamenesTomados([]);
                console.warn('Continuando sin filtrado de exámenes tomados');
            } finally {
                setLoadingTomados(false);
            }
        };

        cargarExamenesTomados();
    }, [data?.content]);

    // Función para verificar si un examen ya fue tomado
    const estaExamenTomado = (paciente, examen) => {
        return examenesTomados.some(tomado =>
            tomado.documento === paciente.documento &&
            tomado.folio === examen.folio.toString() &&
            tomado.descCups?.trim().toLowerCase() === examen.descProcedimiento?.trim().toLowerCase()
        );
    };

    // Función para filtrar pacientes y sus exámenes (oculta los tomados automáticamente)
    const filtrarExamenesNoTomados = (pacientes) => {
        if (!pacientes) return [];

        return pacientes.map(paciente => ({
            ...paciente,
            examenes: paciente.examenes.filter(examen => !estaExamenTomado(paciente, examen))
        }))
            .filter(p => p.examenes.length > 0); // Eliminar pacientes sin exámenes pendientes
    };

    useEffect(() => {
        if (!loadingSave) return;
        toast.info("Guardando exámenes tomados...");
    }, [loadingSave]);

    useEffect(() => {
        fetchData(tipo, page);
    }, [page]);

    const colorHeader = colorHeaderMap[tipo] || "bg-gray-500";

    const handleSelect = (key, examenData) => {
        setCheckedItems((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            return updated;
        });
    };

    const handleSelectAll = (paciente, checked) => {
        setCheckedItems((prev) => {
            const updated = { ...prev };
            paciente.examenes.forEach((ex, idxExamen) => {
                const key = `${paciente.documento}-${ex.folio}-${idxExamen}`;
                updated[key] = checked;
            });
            return updated;
        });
    };

    const handleEnviarSeleccionados = async () => {
        if (!data?.content) return;
        const seleccionados = [];

        pacientesFiltrados.forEach((p) => {
            p.examenes.forEach((ex, idxExamen) => {
                const key = `${p.documento}-${ex.folio}-${idxExamen}`;
                if (checkedItems[key]) {
                    seleccionados.push({
                        documento: p.documento,
                        folio: ex.folio.toString(),
                        descProcedimiento: ex.descProcedimiento
                    });
                }
            });
        });

        if (seleccionados.length === 0) {
            toast.warning("Selecciona al menos un examen");
            return;
        }

        try {
            await actualizarExamenesTomados(seleccionados);
            toast.success('Exámenes marcados como tomados');
            desmarcarTodos();
            await fetchData(tipo, page);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al actualizar exámenes');
        }
    };


    const desmarcarTodos = () => {
        setCheckedItems({});
    };

    // Aplicar filtro automáticamente
    const pacientesFiltrados = filtrarExamenesNoTomados(data?.content);

    const totalSeleccionados = Object.values(checkedItems).filter(Boolean).length;

    const handleImprimirStickers = async () => {
        if (!data?.content) {
            toast.error("No hay pacientes cargados");
            return;
        }

        const seleccionados = [];
        pacientesFiltrados.forEach((p) => {
            p.examenes.forEach((ex, idxExamen) => {
                const key = `${p.documento}-${ex.folio}-${idxExamen}`;
                if (checkedItems[key]) {
                    seleccionados.push({
                        documento: p.documento,
                        historia: p.documento,
                        nomPaciente: p.nomPaciente,
                        sexo: p.sexo,
                        edad: p.edad,
                        numeroFolio: ex.folio.toString(),
                        numeroIngreso: p.ingreso.toString(),
                        codCups: ex.codCups,
                        descCups: ex.descProcedimiento,
                        observaciones: ex.observaciones,
                        codCama: ex.codCama,
                        cama: ex.cama,
                        diaCodigo: p.diaCodigo,
                        diaNombre: p.diaNombre,
                        tiposAislamiento: p.tiposAislamiento,
                        fechaSolicitudFolio: ex.fechaFolioSolicitud,
                        areaSolicitante: ex.areaSolicitante,
                        prioridad: tipo,
                    });
                }
            });
        });

        if (seleccionados.length === 0) {
            toast.warning("Selecciona al menos un examen");
            return;
        }

        try {
            toast.info(`Generando ${seleccionados.length} sticker(s)...`);
            await guardarExamenesImpresion(seleccionados);

            const response = await fetch('http://localhost:8084/reportes/stickers-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(seleccionados),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `stickers-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Stickers generados y guardados correctamente');
            desmarcarTodos();
            await fetchData(tipo, page); // Recargar datos
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al generar stickers: ' + error.message);
        }
    };

    if (error || saveError) return <div className='alert alert-danger'>Error: {error?.message || saveError?.message}</div>;

    return (
        <>
            {/* Controles de tamaño de texto */}
            <div className="flex justify-end items-center mb-2 space-x-2 text-xs text-gray-600">
                <span>Tamaño texto:</span>
                <button onClick={reducirTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold" > A- </button>
                <button onClick={aumentarTexto} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold" > A+ </button>
            </div>
            <div ref={containerRef} className="relative mb-8 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col overflow-hidden" style={{ height, minHeight: "400px", maxHeight: "900px" }}>
                {/* Encabezado */}
                <div className={`${colorHeader} text-white px-4 py-2 rounded-t-lg font-bold text-lg flex items-center justify-between flex-shrink-0`}>
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faFlask} className="text-white w-5 h-5" />
                        <span>{titulo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleImprimirStickers} disabled={loadingData} className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-sm transition-colors" >
                            <FontAwesomeIcon icon={faPrint} className="w-4 h-4 text-white" />
                            <span>Stickers</span>
                        </button>
                        {/* Contador */}
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">
                            Seleccionados: <b>{totalSeleccionados}</b>
                        </span>
                        {/* Desmarcar todos */}
                        <button onClick={desmarcarTodos} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors" >
                            <FontAwesomeIcon icon={faBroom} className="w-4 h-4 text-white rotate-90" />
                            <span>Limpiar</span>
                        </button>
                        <button onClick={() => fetchData(tipo, page)} disabled={loadingData} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors" >
                            <FontAwesomeIcon icon={faSync} spin={loadingData} className="w-4 h-4 text-white" />
                            <span>Actualizar</span>
                        </button>
                        <button onClick={handleEnviarSeleccionados} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors">
                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 text-white" />
                            <span>Enviar seleccionados</span>
                        </button>
                    </div>
                </div>

                {/* Contenido Scrollable (la tabla crece dinámicamente) */}
                <div className="flex-grow overflow-auto p-6">
                    {/* Sin datos */}
                    {data.content?.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <FontAwesomeIcon icon={faDatabase} className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No hay pacientes {titulo.toLowerCase()} en este momento</p>
                        </div>
                    )}
                    {/* Tabla */}
                    <table className="min-w-full text-gray-700" style={{ fontSize: `${fontSize}px` }}>
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-2 py-0.5 text-center font-semibold">✔</th>
                                <th className="px-2 py-0.5 font-semibold">Historia</th>
                                <th className="px-2 py-0.5 font-semibold">Ingreso</th>
                                <th className="px-2 py-0.5 font-semibold">Paciente</th>
                                <th className="px-2 py-0.5 font-semibold">Sexo</th>
                                <th className="px-2 py-0.5 font-semibold">Edad</th>
                                <th className="px-2 py-0.5 text-center font-semibold">✔</th>
                                <th className="px-2 py-0.5 font-semibold">Folio</th>
                                <th className="px-2 py-0.5 font-semibold">Exámenes</th>
                                <th className="px-2 py-0.5 font-semibold">Observaciones</th>
                                <th className="px-2 py-0.5 font-semibold">CodCama</th>
                                <th className="px-2 py-0.5 font-semibold">Cama</th>
                                <th className="px-2 py-0.5 font-semibold">Cod Dx</th>
                                <th className="px-2 py-0.5 font-semibold">Diagnóstico</th>
                                <th className="px-2 py-0.5 font-semibold">Aislamiento</th>
                                <th className="px-2 py-0.5 font-semibold">Fecha Solicitud</th>
                                <th className="px-2 py-0.5 font-semibold">Área Sol.</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {loadingData ? (
                                <tr>
                                    <td colSpan={17} className="text-center py-6">
                                        <div className="flex justify-center items-center">
                                            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pacientesFiltrados?.map((p, index) => {
                                    const count = p.examenes?.length ?? 0;
                                    if (count === 0) return null;
                                    const isOddGroup = index % 2 !== 0;
                                    const groupBgClass = isOddGroup ? "bg-gray-200" : "bg-white";
                                    const allChecked = p.examenes.every(
                                        (ex, idx) => checkedItems[`${p.documento}-${ex.folio}-${idx}`]
                                    );
                                    return p.examenes.map((ex, idxExamen) => {
                                        const key = `${p.documento}-${ex.folio}-${idxExamen}`;
                                        const isChecked = !!checkedItems[key];

                                        const examenData = {
                                            documento: p.documento,
                                            nomPaciente: p.nomPaciente,
                                            sexo: p.sexo,
                                            edad: p.edad,
                                            folio: ex.folio,
                                            ingreso: p.ingreso,
                                            descProcedimiento: ex.descProcedimiento,
                                            observaciones: ex.observaciones,
                                            codCama: ex.codCama,
                                            cama: ex.cama,
                                            diaCodigo: p.diaCodigo,
                                            diaNombre: p.diaNombre,
                                            tiposAislamiento: p.tiposAislamiento,
                                            fechaSolicitudFolio: ex.fechaFolioSolicitud,
                                            areaSolicitante: ex.areaSolicitante,
                                            prioridad: tipo
                                        };

                                        if (idxExamen === 0) {
                                            return (
                                                <tr key={key} className={`${groupBgClass} hover:bg-gray-500/100 hover:text-white`}>
                                                    <td rowSpan={count} className="text-center border-r px-1 py-0.5">
                                                        <input type="checkbox" checked={allChecked} onChange={(e) => handleSelectAll(p, e.target.checked)} />
                                                    </td>
                                                    <td rowSpan={count} className="border-r px-1 py-0.5">{p.documento}</td>
                                                    <td rowSpan={count} className="border-r px-1 py-0.5">{p.ingreso}</td>
                                                    <td rowSpan={count} className="border-r px-1 py-0.5">{p.nomPaciente}</td>
                                                    <td rowSpan={count} className="border-r px-1 py-0.5">{p.sexo == 1 ? 'M' : p.sexo == 2 ? 'F' : ''}</td>
                                                    <td rowSpan={count} className="border-r px-1 py-0.5 text-center">{p.edad}</td>
                                                    <td className="border-r px-1 py-0.5 text-center">
                                                        <input type="checkbox" checked={isChecked} onChange={() => handleSelect(key, examenData)} />
                                                    </td>
                                                    <td className="border-r px-1 py-0.5 text-center">{ex.folio}</td>
                                                    <td className="border-r px-1 py-0.5">{ex.descProcedimiento}</td>
                                                    <td className="border-r px-1 py-0.5">{ex.observaciones}</td>
                                                    <td className="border-r px-1 py-0.5">{ex.codCama}</td>
                                                    <td className="border-r px-1 py-0.5">{ex.cama}</td>
                                                    <td className="border-r px-1 py-0.5">{p.diaCodigo}</td>
                                                    <td className="border-r px-1 py-0.5">{p.diaNombre}</td>
                                                    <td className="border-r px-1 py-0.5">
                                                        <ul>{p.tiposAislamiento.map((t, i) => <li key={i}>{t}</li>)}</ul>
                                                    </td>
                                                    <td className="border-r px-1 py-0.5">{new Date(ex.fechaFolioSolicitud).toLocaleString()}</td>
                                                    <td className="border-r px-1 py-0.5">{ex.areaSolicitante}</td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr key={key} className={`${groupBgClass} hover:bg-gray-500/100 hover:text-white`}>
                                                <td className="border-r text-center px-1 py-0.5">
                                                    <input type="checkbox" checked={isChecked} onChange={() => handleSelect(key, examenData)} />
                                                </td>
                                                <td className="border-r text-center px-1 py-0.5">{ex.folio}</td>
                                                <td className="border-r px-1 py-0.5">{ex.descProcedimiento}</td>
                                                <td className="border-r px-1 py-0.5">{ex.observaciones}</td>
                                                <td className="border-r px-1 py-0.5">{ex.codCama}</td>
                                                <td className="border-r px-1 py-0.5">{ex.cama}</td>
                                                <td className="border-r px-1 py-0.5">{p.diaCodigo}</td>
                                                <td className="border-r px-1 py-0.5">{p.diaNombre}</td>
                                                <td className="border-r px-1 py-0.5">
                                                    <ul>{p.tiposAislamiento.map((t, i) => <li key={i}>{t}</li>)}</ul>
                                                </td>
                                                <td className="border-r px-1 py-0.5">{new Date(ex.fechaFolioSolicitud).toLocaleString()}</td>
                                                <td className="border-r px-1 py-0.5">{ex.areaSolicitante}</td>
                                            </tr>
                                        );
                                    });
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Paginador fijo al fondo */}
                <div className="flex-shrink-0 p-2 border-t bg-gray-50">
                    <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
                {/* Barra de redimensionamiento */}
                <div onMouseDown={startResizing} className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize bg-transparent" ></div>
            </div>
        </>
    );
}