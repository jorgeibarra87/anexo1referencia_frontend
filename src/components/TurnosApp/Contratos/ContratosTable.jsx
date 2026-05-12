import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faUsers, faCog, faFileAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { apiService } from '../../../api/turnos/apiContratoService';

export default function ContratosTable() {
    const [contratos, setContratos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar contratos usando apiService
    const loadContratos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const contratosData = await apiService.contratos.getAll();

            // Obtener especialidades y procesos para cada contrato
            const contratosConDetalles = await Promise.all(
                contratosData.map(async (contrato) => {
                    try {
                        const [especialidades, procesos] = await Promise.all([
                            apiService.contratos.getEspecialidades(contrato.idContrato),
                            apiService.contratos.getProcesos(contrato.idContrato)
                        ]);

                        return {
                            ...contrato,
                            especialidades: especialidades || [],
                            procesos: procesos || []
                        };
                    } catch (error) {
                        console.warn(`Error al obtener detalles del contrato ${contrato.idContrato}:`, error);
                        return {
                            ...contrato,
                            especialidades: [],
                            procesos: []
                        };
                    }
                })
            );

            setContratos(contratosConDetalles);

            // Resetear página si es necesario
            const totalPages = Math.ceil(contratosConDetalles.length / itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }
        } catch (err) {
            console.error('Error al cargar contratos:', err);
            setError('Error al cargar los contratos. Intenta nuevamente.');
            setContratos([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    // Función para manejar la eliminación
    const handleDelete = useCallback(async (id, numeroContrato) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el contrato "${numeroContrato}"?`)) {
            try {
                await apiService.contratos.delete(id);
                await loadContratos();
                alert('Contrato eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar contrato:', error);

                if (error.response?.status === 409) {
                    alert('No se puede eliminar el contrato porque tiene dependencias asociadas');
                } else if (error.response?.status === 404) {
                    alert('El contrato no fue encontrado');
                } else {
                    alert('Error al eliminar el contrato');
                }
            }
        }
    }, [loadContratos]);

    // Formatear especialidades
    const getEspecialidadesDisplay = (contrato) => {
        if (contrato.especialidades && contrato.especialidades.length > 0) {
            return contrato.especialidades
                .map(titulo => titulo.titulo || titulo.descripcion || 'Sin nombre')
                .join(', ');
        }
        return 'Sin especialidades';
    };

    // Formatear procesos
    const getProcesosDisplay = (contrato) => {
        if (contrato.procesos && contrato.procesos.length > 0) {
            return contrato.procesos
                .map(proceso => proceso.nombre || 'Sin nombre')
                .join(', ');
        }
        return 'Sin procesos';
    };

    useEffect(() => {
        loadContratos();
    }, [loadContratos]);

    // Lógica de paginación
    const totalPages = Math.ceil(contratos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentContratos = contratos.slice(startIndex, endIndex);

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

    // Loading spinner
    if (loading) {
        return (
            <div className="m-8 p-6 bg-white shadow rounded">
                <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4 border-green-600 pl-4 pr-4 pb-1 pt-1 mb-6 w-fit mx-auto">
                    <FontAwesomeIcon icon={faFileAlt} className="text-green-500 w-10 h-10" />
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Ver Todos los Contratos
                    </h1>
                </div>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-500">Cargando contratos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="m-8 p-6 bg-white shadow rounded">
            <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4 border-green-600 pl-4 pr-4 pb-1 pt-1 mb-6 w-fit mx-auto">
                <FontAwesomeIcon icon={faFileAlt} className="text-green-500 w-10 h-10" />
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Ver Todos los Contratos
                </h1>
            </div>

            <div className="flex justify-between items-center mb-4">
                <Link to="/turnos/crearContrato">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 flex items-center gap-2 transition-colors">
                        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                        Crear Contrato
                    </button>
                </Link>

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

            {/* Mostrar error si existe */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={loadContratos}
                        className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Tabla de contratos */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Número Contrato</th>
                            <th className="p-3">Especialidades</th>
                            <th className="p-3">Procesos</th>
                            <th className="p-3">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
                                    Acciones
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContratos.map((contrato) => (
                            <tr key={contrato.idContrato} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-xs">{contrato.idContrato}</td>
                                <td className="p-3 text-xs font-medium">
                                    {contrato.numContrato || 'Sin número'}
                                </td>
                                <td className="p-3 text-xs">
                                    {getEspecialidadesDisplay(contrato)}
                                </td>
                                <td className="p-3 text-xs">
                                    {getProcesosDisplay(contrato)}
                                </td>
                                <td className="p-3 space-x-3">
                                    {/* Ver */}
                                    <Link
                                        to={`/turnos/verContrato/${contrato.idContrato}`}
                                        title={`Ver contrato: ${contrato.numContrato}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="text-green-500 hover:text-green-600 cursor-pointer transition-colors w-4 h-4" />
                                    </Link>

                                    {/* Editar */}
                                    <Link
                                        to={`/turnos/crearContrato/editar/${contrato.idContrato}`}
                                        title={`Editar contrato: ${contrato.numContrato}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-blue-600 hover:text-sky-800 cursor-pointer transition-colors w-4 h-4" />
                                    </Link>

                                    {/* Eliminar */}
                                    {/* <button
                                        onClick={() => handleDelete(contrato.idContrato, contrato.numContrato)}
                                        title={`Eliminar contrato: ${contrato.numContrato}`}
                                        className="inline-block"
                                    >
                                        <FontAwesomeIcon icon={faTrash}
                                            className="text-red-500 hover:text-red-700 cursor-pointer transition-colors w-4 h-4"
                                        />
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Información de paginación y controles */}
            {contratos.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Información de registros */}
                    <div className="text-sm text-gray-600">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, contratos.length)} de {contratos.length} registros
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

            {/* Mensaje cuando no hay contratos */}
            {contratos.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    <FontAwesomeIcon icon={faUsers} className="mx-auto mb-4 text-gray-300 w-12 h-12" />
                    <p className="text-lg font-medium">No hay contratos disponibles</p>
                    <p className="text-sm">Crea tu primer contrato usando el botón de arriba</p>
                </div>
            )}
        </div>
    );
}
