import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUser, faArrowLeft, faEdit, faTimesCircle, faClock, faFileAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { apiTurnoService } from '../../../api/turnos/apiTurnoService';

export function FormularioTurno() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const cuadroNombre = searchParams.get('cuadroNombre');
    const equipoNombre = searchParams.get('equipoNombre');
    const equipoId = searchParams.get('equipoId');
    const { turnoId } = useParams();

    // Detectar modo edición
    const isEditMode = !!turnoId;

    // Estados principales del formulario
    const [cuadroTurno, setCuadroTurno] = useState("");
    const [equipo, setEquipo] = useState("");
    const [fechaHoraInicio, setFechaHoraInicio] = useState("");
    const [fechaHoraFin, setFechaHoraFin] = useState("");
    const [selectedPersona, setSelectedPersona] = useState("");
    const [jornada, setJornada] = useState("");
    const [tipoTurno, setTipoTurno] = useState("Presencial");
    const [comentarios, setComentarios] = useState("");
    const [estadoTurno, setEstadoTurno] = useState("abierto");

    // Estados para cargar datos
    const [personasEquipo, setPersonasEquipo] = useState([]);
    const [loadingPersonas, setLoadingPersonas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Estados para datos del cuadro y equipo
    const [cuadroData, setCuadroData] = useState({
        id: "",
        nombre: "",
        equipoId: ""
    });

    // Estados para modo edición
    const [loadingTurnoData, setLoadingTurnoData] = useState(false);
    const [turnoOriginal, setTurnoOriginal] = useState(null);

    // Calcular total de horas
    const calcularTotalHoras = () => {
        if (!fechaHoraInicio || !fechaHoraFin) return 0;

        const inicio = new Date(fechaHoraInicio);
        const fin = new Date(fechaHoraFin);

        if (fin <= inicio) return 0;

        // Usar UTC para evitar problemas de zona horaria
        const diffMs = fin.getTime() - inicio.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.round(diffHours * 100) / 100;
    };

    // useEffect para obtener datos de la URL (modo creación)
    useEffect(() => {
        if (!isEditMode) {
            const cuadroId = searchParams.get('cuadroId');
            const cuadroNombre = searchParams.get('cuadroNombre');
            const equipoId = searchParams.get('equipoId');

            if (cuadroId && cuadroNombre && equipoId) {
                setCuadroData({
                    id: cuadroId,
                    nombre: cuadroNombre,
                    equipoId: equipoId
                });

                setCuadroTurno(cuadroNombre);
                loadPersonasEquipo(equipoId);
                loadEquipoInfo(equipoId);
            }
        }
    }, [searchParams, isEditMode]);

    // useEffect para cargar datos del turno en modo edición
    useEffect(() => {
        const loadTurnoForEdit = async () => {
            if (!isEditMode || !turnoId) return;

            try {
                setLoadingTurnoData(true);

                //Usar servicio
                const turnoData = await apiTurnoService.turnos.getById(turnoId);

                setTurnoOriginal(turnoData);
                setCuadroTurno(turnoData.cuadroTurno || "");
                setEquipo(equipoId);
                setFechaHoraInicio(turnoData.fechaInicio || "");
                setFechaHoraFin(turnoData.fechaFin || "");
                setSelectedPersona(turnoData.idPersona || "");
                setJornada(turnoData.jornada || "");
                setTipoTurno(turnoData.tipoTurno || "Presencial");
                setComentarios(turnoData.comentarios || "");
                setEstadoTurno(turnoData.estadoTurno || "abierto");
                if (equipoId) {
                    setCuadroData(prev => ({
                        ...prev,
                        equipoId: equipoId,
                        id: turnoData.idCuadroTurno,
                        nombre: turnoData.cuadroTurno
                    }));
                    loadPersonasEquipo(equipoId);
                }

            } catch (err) {
                console.error('Error al cargar turno para editar:', err);
                setError('Error al cargar los datos del turno');
            } finally {
                setLoadingTurnoData(false);
            }
        };

        loadTurnoForEdit();
    }, [isEditMode, turnoId]);

    // Función para cargar personas del equipo
    const loadPersonasEquipo = async (equipoId) => {
        try {
            setLoadingPersonas(true);

            //Usar servicio
            const personasData = await apiTurnoService.auxiliares.getUsuariosEquipo(equipoId);
            setPersonasEquipo(personasData);

        } catch (err) {
            console.error('Error al cargar personas del equipo:', err);
            setError('Error al cargar las personas del equipo');
        } finally {
            setLoadingPersonas(false);
        }
    };

    // Función para cargar info del equipo
    const loadEquipoInfo = async (equipoId) => {
        try {
            //Usar servicio
            const equipoInfo = await apiTurnoService.auxiliares.getEquipoInfo(equipoId);
            setEquipo(equipoInfo.nombre);

        } catch (err) {
            console.error('Error al cargar info del equipo:', err);
        }
    };

    // Función para formatear fecha para input datetime-local
    const formatDateForInput = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);

        // Ajustar para hora local
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    // Función para guardar el turno
    const handleGuardarTurno = async () => {
        setSaving(true);
        setError("");

        try {
            if (!fechaHoraInicio || !fechaHoraFin || !selectedPersona) {
                throw new Error('Todos los campos son requeridos');
            }

            if (new Date(fechaHoraFin) <= new Date(fechaHoraInicio)) {
                throw new Error('La fecha/hora de fin debe ser posterior a la de inicio');
            }

            const turnoData = {
                cuadroNombre: cuadroNombre,
                idCuadroTurno: cuadroData.id,
                idPersona: selectedPersona,
                fechaInicio: fechaHoraInicio,
                fechaFin: fechaHoraFin,
                totalHoras: calcularTotalHoras(),
                tipoTurno: tipoTurno,
                jornada: jornada,
                estadoTurno: estadoTurno,
                comentarios: comentarios,
                //equipo: equipo,
                idEquipo: equipoId,






            };

            let response;

            if (isEditMode) {
                await apiTurnoService.turnos.update(turnoId, turnoData);
            } else {
                await apiTurnoService.turnos.create(turnoData);
            }

            alert(`Turno ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);

            // Regresar a la gestión de turnos
            const params = new URLSearchParams({
                cuadroId: cuadroData.id,
                cuadroNombre: cuadroNombre,
                equipoId: cuadroData.equipoId
            });
            navigate(`/turnos/gestionar-turnos?${params.toString()}`);

        } catch (err) {
            setError(err.response?.data?.message || err.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el turno`);
            console.error('Error:', err);
        } finally {
            setSaving(false);
        }
    };

    if (isEditMode && loadingTurnoData) {
        return (
            <div className='w-full mx-auto p-4 bg-opacity-50 bg-blue-80 backdrop-blur-3xl flex justify-center items-center'>
                <div className='bg-white p-8 rounded-lg flex flex-col justify-center items-center gap-5 max-w-lg w-full mx-4'>
                    <div className='text-2xl font-bold'>Cargando datos del turno...</div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    // Función para calcular jornada
    const calcularJornadaPreview = () => {
        if (!fechaHoraInicio || !fechaHoraFin) {
            return "Sin definir";
        }

        const inicio = new Date(fechaHoraInicio);
        const fin = new Date(fechaHoraFin);

        // Calcular duración del turno
        const diffMs = fin.getTime() - inicio.getTime();
        const horasDuracion = diffMs / (1000 * 60 * 60);

        // Si es turno de 24 horas
        if (horasDuracion === 24) {
            return "24 Horas";
        }

        // Obtener hora de inicio (0-23)
        const horaInicio = inicio.getHours();

        // Definir jornadas según hora de inicio
        if (horaInicio >= 6 && horaInicio < 12) {
            return "Mañana";
        } else if (horaInicio >= 12 && horaInicio < 18) {
            return "Tarde";
        } else {
            // 18:00 - 05:59 (incluye madrugada y noche)
            return "Noche";
        }
    };

    // Función para mostrar las reglas de jornada
    const obtenerReglasJornada = () => {
        return (
            <div className="text-xs bg-blue-50 p-3 rounded border mt-2">
                <div className="font-medium text-blue-800 mb-2">📋 Reglas de Cálculo Automático:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>🌅 Mañana:</strong> 06:00 - 11:59</div>
                    <div><strong>🌆 Tarde:</strong> 12:00 - 17:59</div>
                    <div><strong>🌙 Noche:</strong> 18:00 - 05:59</div>
                    <div><strong>⏰ 24 Horas:</strong> Turnos completos</div>
                </div>
            </div>
        );
    };

    return (
        <div className='w-full mx-auto p-4 bg-opacity-50 bg-blue-80 backdrop-blur-3xl flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg flex flex-col justify-center items-center gap-4 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
                <div className="flex items-center justify-center gap-3 rounded-2xl border-b-4  border-green-600 pl-4 pr-4 pb-1 pt-1 mb-1 w-fit mx-auto">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-10 h-10 text-green-500" />
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        {isEditMode ? 'Editar Turno' : 'Crear Turno'}
                    </h1>
                </div>

                {isEditMode && turnoId && (
                    <div className='text-xs bg-blue-50 border border-blue-200 rounded px-3 py-2 w-full'>
                        <div className='flex items-center gap-2 mb-2'>
                            <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
                            <span className='font-semibold text-blue-800'>Modo Edición Turno</span>
                        </div>
                        <div className='text-xs text-gray-700'>
                            <div><span className='font-medium'>ID:</span> {turnoId}</div>
                        </div>
                    </div>
                )}

                <div className='w-full space-y-4'>
                    {/* Cuadro de Turno y Equipo */}
                    <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cuadro de Turno:
                            </label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
                                {cuadroNombre || 'No especificado'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Equipo:
                            </label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
                                {equipoNombre || 'Cargando...'}
                            </div>
                        </div>
                    </div>

                    {/* Fechas y Horas */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha/Hora Inicio:
                            </label>
                            <input
                                type="datetime-local"
                                id="fecha-inicio"
                                value={formatDateForInput(fechaHoraInicio)}
                                onChange={(e) => setFechaHoraInicio(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha/Hora Fin:
                            </label>
                            <input
                                type="datetime-local"
                                id="fecha-fin"
                                value={formatDateForInput(fechaHoraFin)}
                                onChange={(e) => setFechaHoraFin(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Persona */}
                    <div>
                        <label htmlFor="persona-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Persona:
                        </label>
                        {loadingPersonas ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                                <p className="text-gray-500 text-sm">Cargando personas...</p>
                            </div>
                        ) : (
                            <select
                                id="persona-select"
                                value={selectedPersona}
                                onChange={(e) => setSelectedPersona(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecciona Persona</option>
                                {personasEquipo.map((persona) => (
                                    <option key={persona.idPersona} value={persona.idPersona}>
                                        {persona.nombreCompleto} - {persona.documento}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Jornada y Tipo de Turno */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* JORNADA  */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jornada:
                            </label>
                            <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-semibold text-blue-800 flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${calcularJornadaPreview() === "Mañana" ? "bg-yellow-500" :
                                    calcularJornadaPreview() === "Tarde" ? "bg-green-500" :
                                        calcularJornadaPreview() === "Noche" ? "bg-blue-500" :
                                            "bg-green-500"
                                    }`}></span>
                                {calcularJornadaPreview()}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tipo-turno-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo Turno:
                            </label>
                            <select
                                id="tipo-turno-select"
                                value={tipoTurno}
                                onChange={(e) => setTipoTurno(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Mixto">Mixto</option>
                            </select>
                        </div>
                    </div>

                    {/* Total de Horas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Horas:
                        </label>
                        <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-semibold text-blue-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                            {calcularTotalHoras()} horas
                        </div>
                    </div>
                </div>

                {/* Comentarios */}
                <div className='w-full'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {/* <FileText size={16} className="inline mr-2" /> */}
                        Comentarios
                    </label>
                    <textarea
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="comentarios"
                    />
                </div>

                {error && (
                    <div className='w-full p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center text-sm'>
                        {error}
                    </div>
                )}

                <div className='flex justify-center items-center gap-4 mt-6'>
                    <button
                        onClick={handleGuardarTurno}
                        disabled={saving || !fechaHoraInicio || !fechaHoraFin || !selectedPersona}
                        className={`px-6 py-2 text-white rounded-lg flex justify-center items-center gap-2 transition-colors ${saving || !fechaHoraInicio || !fechaHoraFin || !selectedPersona
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        <FontAwesomeIcon icon={faSave} className="w-5 h-5 text-white" />
                        {saving ? (isEditMode ? 'Actualizando...' : 'Guardando...') : 'Guardar'}
                    </button>

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