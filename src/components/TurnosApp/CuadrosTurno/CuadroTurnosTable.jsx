import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faUsers, faBoxes, faChevronLeft, faChevronRight, faCalendarTimes, faCalendarAlt, faCalendarCheck, faTable, faMagic } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiCuadroService } from '../../../api/turnos/apiCuadroService';

export default function TurnosTable() {
    const [cuadros, setCuadros] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    // Cargar cuadros usando apiService
    const loadCuadros = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const cuadrosAbiertos = await apiCuadroService.cuadros.getCuadros();
            setCuadros(cuadrosAbiertos);

            // Resetear página si es necesario
            const totalPages = Math.ceil(cuadrosAbiertos.length / itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }
        } catch (err) {
            console.error('Error al cargar cuadros:', err);
            setError('Error al cargar los cuadros. Intenta nuevamente.');
            setCuadros([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    // Función para manejar la eliminación (cerrar cuadro)
    const handleDelete = useCallback(async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres cerrar el cuadro "${nombre}"? La versión actual se mantendrá.`)) {
            try {
                await apiCuadroService.cuadros.cerrar(id);
                await loadCuadros();
                alert('Cuadro cerrado exitosamente. La versión se ha mantenido.');
            } catch (error) {
                console.error('Error al cerrar el cuadro:', error);

                if (error.response?.status === 409) {
                    alert('No se puede cerrar el cuadro porque tiene dependencias asociadas');
                } else if (error.response?.status === 404) {
                    alert('El cuadro no fue encontrado');
                } else {
                    alert('Error al cerrar el cuadro');
                }
            }
        }
    }, [loadCuadros]);

    // Función para re-abrir un cuadro
    const handleUnDelete = useCallback(async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres re-abrir el cuadro "${nombre}"? Esto creará una nueva versión del cuadro.`)) {
            try {
                await apiCuadroService.cuadros.abrir(id);
                await loadCuadros();
                alert('Cuadro re-abierto exitosamente con nueva versión.');
            } catch (error) {
                console.error('Error al re-abrir el cuadro:', error);

                if (error.response?.status === 409) {
                    alert('No se puede re-abrir el cuadro porque tiene dependencias asociadas');
                } else if (error.response?.status === 404) {
                    alert('El cuadro no fue encontrado');
                } else {
                    alert('Error al re-abrir el cuadro');
                }
            }
        }
    }, [loadCuadros]);


    useEffect(() => {
        loadCuadros();
    }, [loadCuadros]);

    // Lógica de paginación
    const totalPages = Math.ceil(cuadros.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCuadros = cuadros.slice(startIndex, endIndex);

    // Funciones para cambiar página
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Función para generar números de página visibles
    const getVisiblePageNumbers = () => {
        const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
        const range = [];
        const rangeWithDots = [];

        // Calcular el rango de páginas a mostrar
        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        // Agregar primera página
        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        // Agregar páginas del rango
        rangeWithDots.push(...range);

        // Agregar última página
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="m-3 p-3 bg-white shadow rounded min-w-max min-h-max">
            <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4  border-green-600 pl-4 pr-4 pb-1 pt-1 mb-6 w-fit mx-auto">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-10 h-10 text-green-500" />
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Gestion Cuadros de Turno
                </h1>
            </div>


            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Link to="/turnos/crearCuadro">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-white" />
                            Crear Cuadro
                        </button>
                    </Link>
                    <Link to="/turnos/importar-completo">
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-2xl hover:bg-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMagic} className="w-5 h-5 text-white" />
                            Importar + Crear Todo
                        </button>
                    </Link>
                </div>

                {/* Selector de elementos por página */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Mostrar:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // Resetear a primera página
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">por página</span>
                </div>
            </div>

            <table className="w-full mx-auto text-left text-sm">
                <thead className="bg-black text-white">
                    <tr>
                        <th className="p-3">Id</th>
                        <th className="p-3">Cuadro</th>
                        <th className="p-3">Entidad</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3 flex items-center gap-2"><FontAwesomeIcon icon={faUsers} className="w-4 h-4" />Equipo</th>
                        <th className="p-3">Versión</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCuadros.map((cuadro) => (
                        <tr key={cuadro.idCuadroTurno} className="border-b">
                            <td className="p-3 text-xs">{cuadro.idCuadroTurno}</td>
                            <td className="p-3 text-xs">{cuadro.nombre}</td>
                            <td className="p-3 text-xs">
                                {cuadro.entidad ? (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{cuadro.entidad}</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="p-3 text-xs">
                                {cuadro.tipoPersonal ? (
                                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">{cuadro.tipoPersonal}</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="p-3 text-xs">{cuadro?.nombreEquipo || 'Sin equipo'}</td>
                            <td className="p-3 text-xs">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    {cuadro.version || 'N/A'}
                                </span>
                            </td>
                            <td className="p-3 text-xs">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${cuadro.estadoCuadro === 'abierto'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {cuadro.estadoCuadro}
                                </span>
                            </td>
                            <td className="p-3 space-x-2">
                                <Link
                                    to={`/turnos/VerCuadro/${cuadro.idCuadroTurno}`}
                                    title={`Ver cuadro: ${cuadro.nombre}`}
                                    className="inline-block"
                                >
                                    <FontAwesomeIcon icon={faEye} className="text-green-600 hover:text-green-800 cursor-pointer transition-colors w-4 h-4" />
                                </Link>

                                <Link
                                    to={`/turnos/matriz/${cuadro.idCuadroTurno}`}
                                    title={`Matriz de turnos: ${cuadro.nombre}`}
                                    className="inline-block"
                                >
                                    <FontAwesomeIcon icon={faTable} className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors w-4 h-4" />
                                </Link>

                                {/* Botón editar cuadro */}
                                {cuadro.estadoCuadro === 'abierto' && (
                                    <Link
                                        to={`/turnos/crearCuadro/editar/${cuadro.idCuadroTurno}`}
                                        title={`Editar cuadro: ${cuadro.nombre}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors w-4 h-4" />
                                    </Link>
                                )}

                                {/* Botón cerrar cuadro */}
                                {cuadro.estadoCuadro === 'abierto' && (
                                    <button
                                        onClick={() => handleDelete(cuadro.idCuadroTurno, cuadro.nombre)}
                                        title={`Cerrar cuadro: ${cuadro.nombre}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faCalendarTimes} className="text-red-600 hover:text-red-800 cursor-pointer transition-colors w-4 h-4" />
                                    </button>
                                )}

                                {/* Botón abrir cuadro */}
                                {cuadro.estadoCuadro === 'cerrado' && (
                                    <button
                                        onClick={() => handleUnDelete(cuadro.idCuadroTurno, cuadro.nombre)}
                                        title={`Re-Abrir cuadro: ${cuadro.nombre}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faCalendarCheck} className="text-yellow-600 hover:text-yellow-800 cursor-pointer transition-colors w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Información de paginación y controles */}
            {cuadros.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Información de registros */}
                    <div className="text-sm text-gray-600">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, cuadros.length)} de {cuadros.length} registros
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            {/* Botón anterior */}
                            <button
                                onClick={goToPrevious}
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
                            </button>

                            {/* Números de página */}
                            {getVisiblePageNumbers().map((pageNumber, index) => (
                                <button
                                    key={index}
                                    onClick={() => pageNumber !== '...' && goToPage(pageNumber)}
                                    disabled={pageNumber === '...'}
                                    className={`px-3 py-1 rounded text-sm ${pageNumber === currentPage
                                        ? 'bg-blue-500 text-white'
                                        : pageNumber === '...'
                                            ? 'text-gray-400 cursor-default'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            {/* Botón siguiente */}
                            <button
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Mensaje cuando no hay cuadros */}
            {cuadros.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <FontAwesomeIcon icon={faBoxes} className="mx-auto mb-4 text-gray-300 w-12 h-12" />
                    <p className="text-lg">No hay cuadros de turno disponibles</p>
                    <p className="text-sm">Crea tu primer cuadro usando el botón de arriba</p>
                </div>
            )}
        </div>
    );
}