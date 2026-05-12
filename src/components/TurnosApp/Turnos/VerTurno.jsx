import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimesCircle, faUser, faClock, faCalendarAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { apiTurnoService } from '../../../api/turnos/apiTurnoService';

export function VerTurno() {
    const { turnoId } = useParams();
    const navigate = useNavigate();

    const [turno, setTurno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const cuadroNombre = searchParams.get('cuadroNombre');
    const equipoNombre = searchParams.get('equipoNombre');

    useEffect(() => {
        const loadTurno = async () => {
            if (!turnoId) {
                setError('ID de turno no válido');
                setLoading(false);
                return;
            }

            try {
                const turnoData = await apiTurnoService.turnos.getById(turnoId);
                setTurno(turnoData);
            } catch (err) {
                console.error('Error al cargar turno:', err);
                setError('Error al cargar los datos del turno');
            } finally {
                setLoading(false);
            }
        };

        loadTurno();
    }, [turnoId]);

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        return new Date(dateTimeString).toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className='w-full mx-auto p-4 bg-opacity-50 bg-blue-80 backdrop-blur-3xl flex justify-center items-center'>
                <div className='bg-white p-8 rounded-lg flex flex-col justify-center items-center gap-5 max-w-lg w-full mx-4'>
                    <div className='text-2xl font-bold'>Cargando turno...</div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !turno) {
        return (
            <div className='w-full mx-auto p-4 bg-opacity-50 bg-blue-80 backdrop-blur-3xl flex justify-center items-center'>
                <div className='bg-white p-8 rounded-lg flex flex-col justify-center items-center gap-5 max-w-lg w-full mx-4'>
                    <div className='text-2xl font-bold text-red-600'>Error</div>
                    <div className='text-center text-gray-600'>{error || 'Turno no encontrado'}</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex justify-center items-center gap-2 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-white" />
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full mx-auto p-4 bg-opacity-50 bg-blue-80 backdrop-blur-3xl flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg flex flex-col max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>

                {/* Header */}
                <div className='text-center mb-6'>
                    <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4  border-green-600 pl-4 pr-4 pb-1 pt-1 mb-1 w-fit mx-auto">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-10 h-10 text-green-500" />
                        <h1 className="text-2xl font-extrabold text-gray-800">
                            Detalles del Turno
                        </h1>
                    </div>

                    <div className='text-sm text-gray-600'>ID: {turnoId}</div>
                </div>

                {/* Información del Turno */}
                <div className='space-y-6'>

                    {/* Información General */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-2'>
                        <h3 className='text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
                            Información General
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-4 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Cuadro de Turno:</span>
                                <div className='mt-1 text-gray-900'>{cuadroNombre || 'N/A'}</div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Equipo:</span>
                                <div className='mt-1 text-gray-900'>{equipoNombre || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Información de la Persona */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-2'>
                        <h3 className='text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                            Persona Asignada
                        </h3>
                        <div className='text-sm'>
                            <div>
                                <div className='mt-1 text-gray-900 text-lg'>{turno.nombrePersona || 'No asignado'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-2'>
                        <h3 className='text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
                            Horarios
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Fecha/Hora Inicio:</span>
                                <div className='mt-1 text-gray-900 font-mono'>{formatDate(turno.fechaInicio)}</div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Fecha/Hora Fin:</span>
                                <div className='mt-1 text-gray-900 font-mono'>{formatDate(turno.fechaFin)}</div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Total de Horas:</span>
                                <div className='mt-1 text-gray-900 font-semibold text-lg flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                                    {turno.totalHoras || 0} horas
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del Turno */}
                    <div className='bg-blue-50 border border-purple-200 rounded-lg p-4'>
                        <h3 className='text-lg font-semibold text-blue-800 mb-4'>Detalles del Turno</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Jornada:</span>
                                <div className='mt-1'>
                                    <span className='inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full'>
                                        {turno.jornada || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Tipo de Turno:</span>
                                <div className='mt-1'>
                                    <span className='inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full'>
                                        {turno.tipoTurno || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Comentarios:</span>
                                <div className='mt-1'>
                                    <span className='inline-block  bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full'>
                                        {turno.comentarios || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className='flex justify-center items-center gap-4 mt-8'>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex justify-center items-center gap-2 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-white" />
                        Volver
                    </button>

                    <Link to="/turnos/selector-cuadro-turno">
                        <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex justify-center items-center gap-2 transition-colors">
                            <FontAwesomeIcon icon={faTimesCircle} className="w-5 h-5 text-white" />
                            Cancelar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}