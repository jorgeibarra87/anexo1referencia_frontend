import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiReporteService } from '../../../api/turnos/apiReporteService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import SearchableDropdown from '../Turnos/SearchableDropdown';

export default function ReportesFiltro() {
    // Array de meses
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const [anio, setAnio] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [cuadroId, setCuadroId] = useState(1);
    const [personaSeleccionada, setPersonaSeleccionada] = useState('');
    const [reporte, setReporte] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [cuadros, setCuadros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCuadro, setSelectedCuadro] = useState(null);
    const [selectedPersona, setSelectedPersona] = useState(null);

    // Función para manejar selección de cuadro
    const handleCuadroSelect = (cuadro) => {
        setSelectedCuadro(cuadro);
        setCuadroId(cuadro.idCuadroTurno);
    };

    // Función para limpiar selección de cuadro
    const handleCuadroClear = () => {
        setSelectedCuadro(null);
        if (cuadros.length > 0) {
            setCuadroId(cuadros[0].idCuadroTurno);
            setSelectedCuadro(cuadros[0]);
        }
    };

    // Función para manejar selección de persona
    const handlePersonaSelect = (persona) => {
        setSelectedPersona(persona);
        setPersonaSeleccionada(persona.nombre);
    };

    // Función para limpiar selección de persona
    const handlePersonaClear = () => {
        setSelectedPersona(null);
        setPersonaSeleccionada('');
    };

    // Función para preparar datos de personas para el dropdown
    const getPersonasParaDropdown = () => {
        if (!reporte || !reporte.detalleTurnos.length) return [];
        const personas = new Set();
        reporte.detalleTurnos.forEach(turno => personas.add(turno.usuario || "Sin asignar"));
        return Array.from(personas).sort().map(nombre => ({
            id: nombre,
            nombre: nombre
        }));
    };

    useEffect(() => {
        const loadCuadros = async () => {
            try {
                setLoading(true);
                const cuadrosData = await apiReporteService.auxiliares.getCuadrosTurno();
                setCuadros(cuadrosData);
                if (cuadrosData.length > 0) {
                    if (!cuadroId) {
                        setCuadroId(cuadrosData[0].idCuadroTurno);
                    }
                    // Encuentra el cuadro seleccionado inicialmente
                    const cuadroInicial = cuadrosData.find(c => c.idCuadroTurno == (cuadroId || cuadrosData[0].idCuadroTurno));
                    setSelectedCuadro(cuadroInicial);
                }
            } catch (err) {
                setError("Error al cargar los cuadros de turno");
            } finally {
                setLoading(false);
            }
        };
        loadCuadros();
    }, []);

    const fetchReporte = async () => {
        try {
            setLoading(true);
            setError(null);
            const reporteData = await apiReporteService.reportes.getReporte(anio, mes, cuadroId);
            setReporte(reporteData);
            setCurrentPage(1);
            setPersonaSeleccionada('');
        } catch (err) {
            setError("Error al cargar el reporte. Verifique los parámetros seleccionados.");
            setReporte(null);
        } finally {
            setLoading(false);
        }
    };


    // Función para obtener el nombre del mes en español
    const obtenerNombreMes = (mes) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[mes - 1];
    };

    const Tabla = ({ usuario, turnos, totalHoras }) => (
        <div className="mb-6 shadow-lg rounded-lg overflow-hidden border border-gray-200">
            {/* Encabezado del usuario */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    {/* Nombre */}
                    <h3 className="text-lg font-semibold break-words max-w-full sm:max-w-2xl">{usuario}</h3>
                    <div className="flex gap-6 text-sm bg-black bg-opacity-20 px-3 py-1 rounded">
                        <span className="font-medium">Turnos: <span className="text-green-300">{turnos.length}</span></span>
                        <span className="font-medium">Total Horas: <span className="text-blue-300">{totalHoras}</span></span>
                    </div>
                </div>
            </div>

            {/* Tabla responsive y bordes */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50 border-b-2 border-blue-200">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-800 bg-blue-100">Jornada</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-800 bg-blue-100">Fecha Inicio</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-800 bg-blue-100">Hora Inicio</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-800 bg-blue-100">Fecha Fin</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-blue-800 bg-blue-100">Hora Fin</th>
                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-800 bg-blue-100">Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos
                            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
                            .map((turno, index) => (
                                <tr key={index} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                    <td className="border border-gray-300 px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${turno.jornada === 'Mañana' ? 'bg-green-100 text-green-800 border border-green-200' :
                                            turno.jornada === 'Tarde' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                turno.jornada === 'Noche' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                            {turno.jornada || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{formatearFecha(turno.fechaInicio)}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-mono text-sm">{formatearHora(turno.fechaInicio)}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{formatearFecha(turno.fechaFin)}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700 font-mono text-sm">{formatearHora(turno.fechaFin)}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-lg text-gray-800">
                                        <span className="bg-gray-100 px-2 py-1 rounded">{turno.horas || 0}</span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Resto del código de paginación y utilidades...
    let totalPages = 1, currentPersonas = [], startIndex = 0, endIndex = 0, totalPersonas = 0;

    if (reporte && reporte.detalleTurnos.length > 0) {
        const turnosPorUsuario = reporte.detalleTurnos.reduce((acc, turno) => {
            const usuario = turno.usuario || "Sin asignar";
            if (!acc[usuario]) acc[usuario] = [];
            acc[usuario].push(turno);
            return acc;
        }, {});

        let personas = Object.keys(turnosPorUsuario);
        if (personaSeleccionada) {
            personas = personas.filter(persona => persona === personaSeleccionada);
        }

        totalPersonas = personas.length;
        totalPages = Math.ceil(personas.length / itemsPerPage);
        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
        currentPersonas = personas.slice(startIndex, endIndex);
    }

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getVisiblePageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const formatearFecha = (fecha) => {
        return !fecha ? 'N/A' : new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatearHora = (fecha) => {
        return !fecha ? 'N/A' : new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const COLORS = ['#4CAF50', '#FF9800', '#2196F3'];

    return (
        <div className="p-6 space-y-6 bg-blue-80 min-h-screen">
            {/* Filtros */}
            <Card className="shadow-lg border-0">
                <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4 border-green-600 pl-4 pr-4 pb-1 pt-1 mb-6 w-fit mx-auto">
                    <FontAwesomeIcon icon={faFileAlt} className="w-10 h-10 text-green-500" />
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Reportes de Turnos
                    </h1>
                </div>
                <CardContent className="p-6 bg-white">
                    <div className="space-y-4">
                        {/* Primera fila: Año y Mes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-sm font-semibold mb-1">Año</label>
                                <select
                                    className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 box-border"
                                    value={anio}
                                    onChange={e => setAnio(e.target.value)}
                                >
                                    {[2023, 2024, 2025, 2026].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-semibold mb-1">Mes</label>
                                <select
                                    className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 box-border"
                                    value={mes}
                                    onChange={e => setMes(e.target.value)}
                                >
                                    {meses.map((m, index) => (
                                        <option key={index + 1} value={index + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Segunda fila: Cuadro y Persona */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-sm font-semibold mb-1">Cuadro</label>
                                <SearchableDropdown
                                    options={cuadros}
                                    placeholder="Seleccionar cuadro..."
                                    onSelect={handleCuadroSelect}
                                    onClear={handleCuadroClear}
                                    value={selectedCuadro?.nombre || ""}
                                    displayProperty="nombre"
                                    idProperty="idCuadroTurno"
                                    loading={loading}
                                    error={error}
                                    className="w-full"
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-semibold mb-1">Persona</label>
                                <SearchableDropdown
                                    options={getPersonasParaDropdown()}
                                    placeholder="Todas las personas"
                                    onSelect={handlePersonaSelect}
                                    onClear={handlePersonaClear}
                                    value={selectedPersona?.nombre || ""}
                                    displayProperty="nombre"
                                    idProperty="id"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={fetchReporte}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg px-6 py-2 transition-colors font-medium shadow-md"
                        >
                            {loading ? 'Generando...' : 'Generar Reporte'}
                        </button>
                        {reporte && reporte.detalleTurnos.length > 0 && (
                            <button
                                onClick={() => apiReporteService.reportes.descargarExcel(reporte.anio, reporte.mes, cuadroId)}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 transition-colors flex items-center gap-2 font-medium shadow-md"
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="w-8 h-8" /> Exportar a Excel
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error o Loading */}
            {error && (
                <Card className="shadow-lg border-red-200">
                    <CardContent className="p-4 text-red-600 bg-red-50">
                        <p className="font-medium">{error}</p>
                    </CardContent>
                </Card>
            )}

            {loading && (
                <Card className="shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando reporte...</p>
                    </CardContent>
                </Card>
            )}

            {/* Reporte */}
            {reporte && !loading && (
                <div className="space-y-6">
                    {/* Resumen */}
                    <Card className="col-span-2 shadow-lg border-0">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Resumen del Período - {obtenerNombreMes(reporte.mes)} {reporte.anio}
                                </h2>
                                <div className="h-1 w-24 bg-blue-600 mx-auto rounded"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="text-lg font-bold text-blue-800">Año</h3>
                                    <p className="text-3xl font-bold text-blue-600">{reporte.anio}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="text-lg font-bold text-green-800">Mes</h3>
                                    <p className="text-3xl font-bold text-green-600">{reporte.mes}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800">Turnos</h3>
                                    <p className="text-3xl font-bold text-gray-600">{reporte.detalleTurnos.length}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h3 className="text-lg font-bold text-orange-800">Horas Totales</h3>
                                    <p className="text-3xl font-bold text-orange-600">{reporte.detalleTurnos.reduce((sum, t) => sum + (t.horas || 0), 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Horas por Persona</h2>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={Object.entries(reporte.horasPorUsuario).map(([nombre, horas]) => ({
                                        nombre: nombre.length > 15 ? nombre.substring(0, 15) + '...' : nombre,
                                        horas,
                                        nombreCompleto: nombre
                                    }))}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} fontSize={11} />
                                        <YAxis />
                                        <Tooltip labelFormatter={(value, payload) => payload && payload[0] ? payload[0].payload.nombreCompleto : value} />
                                        <Legend />
                                        <Bar dataKey="horas" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Distribución por Jornada</h2>
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={['Mañana', 'Tarde', 'Noche'].map(j => ({
                                                jornada: j,
                                                valor: reporte.detalleTurnos.filter(t => t.jornada === j).length
                                            }))}
                                            dataKey="valor"
                                            nameKey="jornada"
                                            outerRadius={120}
                                            label={({ jornada, valor }) => `${jornada}: ${valor}`}
                                        >
                                            {['Mañana', 'Tarde', 'Noche'].map((entry, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detalle de personas con tabla */}
                    <Card className="shadow-lg border-0">
                        {reporte && reporte.detalleTurnos.length > 0 && (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 border-b">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Detalle de Turnos{personaSeleccionada ? ` - ${personaSeleccionada}` : ''} por Persona
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 font-medium">Mostrar</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value={1}>1</option>
                                            <option value={3}>3</option>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                        </select>
                                        <span className="text-sm text-gray-600 font-medium">personas por página</span>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {(() => {
                                            const turnosPorUsuario = reporte.detalleTurnos.reduce((acc, turno) => {
                                                const usuario = turno.usuario || "Sin asignar";
                                                if (!acc[usuario]) acc[usuario] = [];
                                                acc[usuario].push(turno);
                                                return acc;
                                            }, {});

                                            return currentPersonas.map(usuario => {
                                                const turnos = turnosPorUsuario[usuario];
                                                const totalHoras = turnos.reduce((sum, t) => sum + (t.horas || 0), 0);
                                                return (
                                                    <Tabla
                                                        key={usuario}
                                                        usuario={usuario}
                                                        turnos={turnos}
                                                        totalHoras={totalHoras}
                                                    />
                                                );
                                            });
                                        })()}

                                        {reporte.detalleTurnos.length === 0 && (
                                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                                                <div className="text-6xl mb-4">📋</div>
                                                <h3 className="text-xl font-medium mb-2">No hay datos disponibles</h3>
                                                <p>No hay turnos registrados para el período seleccionado</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                {/* Paginación */}
                                {reporte && totalPersonas > 0 && (
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 border-t">
                                        <div className="text-sm text-gray-600">
                                            Mostrando <span className="font-semibold">{startIndex + 1}</span> a <span className="font-semibold">{Math.min(endIndex, totalPersonas)}</span> de <span className="font-semibold">{totalPersonas}</span> personas
                                            {personaSeleccionada && <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Filtrado: {personaSeleccionada}</span>}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={goToPrevious}
                                                    disabled={currentPage === 1}
                                                    className={`p-2 rounded-md transition-colors ${currentPage === 1
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                    title="Página anterior"
                                                >
                                                    ‹
                                                </button>

                                                {getVisiblePageNumbers().map((pageNumber, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => pageNumber !== '...' && goToPage(pageNumber)}
                                                        disabled={pageNumber === '...'}
                                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${pageNumber === currentPage
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : pageNumber === '...'
                                                                ? 'text-gray-400 cursor-default'
                                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={goToNext}
                                                    disabled={currentPage === totalPages}
                                                    className={`p-2 rounded-md transition-colors ${currentPage === totalPages
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                    title="Página siguiente"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
