import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faUpload, faCheck, faTimesCircle, faArrowLeft, faMagic, faDownload } from '@fortawesome/free-solid-svg-icons';
import { apiProgramacionDiariaService } from '../../../api/turnos/apiProgramacionDiariaService';

const ENTIDADES = [
    { valor: '', label: '-- Sin entidad --' },
    { valor: 'FUNCIONARIOS_PLANTA', label: 'Funcionarios de Planta' },
    { valor: 'ASICA', label: 'ASICA' }, { valor: 'SIMED', label: 'SIMED' },
    { valor: 'ASOCIRGE', label: 'ASOCIRGE' }, { valor: 'ASOMI', label: 'ASOMI' },
    { valor: 'ASOTERAPEUTAS', label: 'ASOTERAPEUTAS' }, { valor: 'ASTRASALUD', label: 'ASTRASALUD' },
    { valor: 'IMPORSALUD', label: 'IMPORSALUD' }, { valor: 'SAIRENA', label: 'SAIRENA' },
    { valor: 'SINTRAOEMPUH', label: 'SINTRAOEMPUH' }, { valor: 'SITSALUD', label: 'SITSALUD' },
    { valor: 'VHR', label: 'VHR' },
];

export default function ImportarCompleto() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [importando, setImportando] = useState(false);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState(null);

    const [formData, setFormData] = useState({
        anio: new Date().getFullYear().toString(),
        mes: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        entidad: '',
        tipoPersonal: '',
        observaciones: ''
    });

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (!selected.name.match(/\.xlsx?$/i)) {
                setError('Solo archivos .xlsx o .xls');
                return;
            }
            setFile(selected);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) { setError('Selecciona un archivo Excel'); return; }
        if (!formData.anio || !formData.mes) { setError('Año y mes son obligatorios'); return; }

        setImportando(true);
        setError(null);
        try {
            const params = {
                anio: formData.anio,
                mes: formData.mes,
                entidad: formData.entidad || null,
                tipoPersonal: formData.tipoPersonal || null,
                observaciones: formData.observaciones || null,
                categoria: 'servicio'
            };
            const res = await apiProgramacionDiariaService.importarCompleto(file, params);
            setResultado(res);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Error en la importación');
        } finally {
            setImportando(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 flex justify-center items-start pt-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
                <div className="flex items-center gap-3 mb-6">
                    <FontAwesomeIcon icon={faMagic} className="w-8 h-8 text-purple-500" />
                    <h1 className="text-2xl font-extrabold text-gray-800">Importación Completa</h1>
                </div>

                {step === 1 && (
                    <>
                        <p className="text-gray-600 mb-6">Sube un archivo Excel con los datos del personal y sus turnos. El sistema creará automáticamente las personas, el equipo, el cuadro y la matriz de turnos.</p>

                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" id="file-input" />
                            <label htmlFor="file-input" className="cursor-pointer">
                                <FontAwesomeIcon icon={faUpload} className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-700">
                                    {file ? file.name : 'Haz clic para seleccionar archivo'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Formato .xlsx o .xls'}
                                </p>
                            </label>
                        </div>

                        <div className="mt-4">
                            <a href={apiProgramacionDiariaService.descargarPlantilla(31)} download
                                className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1">
                                <FontAwesomeIcon icon={faDownload} className="w-3 h-3" /> Descargar plantilla
                            </a>
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">{error}</div>}

                        <div className="flex justify-between mt-6">
                            <button onClick={() => navigate('/turnos/cuadro-turnos')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-2">
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" /> Volver
                            </button>
                            <button onClick={() => setStep(2)} disabled={!file}
                                className={`px-6 py-2 rounded-lg text-sm ${!file ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                                Siguiente: Configurar →
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Archivo: {file?.name}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                                    <input type="text" value={formData.anio}
                                        onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mes *</label>
                                    <select value={formData.mes}
                                        onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                        {meses.map((m, i) => (
                                            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Entidad / Sindicato</label>
                                <select value={formData.entidad}
                                    onChange={(e) => setFormData({ ...formData, entidad: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    {ENTIDADES.map(e => (
                                        <option key={e.valor} value={e.valor}>{e.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Personal</label>
                                <select value={formData.tipoPersonal}
                                    onChange={(e) => setFormData({ ...formData, tipoPersonal: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option value="">-- Sin especificar --</option>
                                    <option value="ENFERMERO">Enfermero(a)</option>
                                    <option value="AUXILIAR">Auxiliar de Enfermería</option>
                                    <option value="MEDICO">Médico</option>
                                    <option value="TERAPEUTA">Terapeuta</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                <textarea value={formData.observaciones} rows={2}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                        </div>
                        {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">{error}</div>}
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm">← Atrás</button>
                            <button onClick={handleSubmit} disabled={importando}
                                className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 ${importando ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                                {importando ? (
                                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Importando...</>
                                ) : (
                                    <><FontAwesomeIcon icon={faMagic} className="w-4 h-4" /> Importar y Crear Todo</>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && resultado && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-green-700">¡Importación Exitosa!</h2>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 text-sm">
                            <p><strong>Cuadro creado:</strong> {resultado.nombreCuadro} (ID: {resultado.idCuadro})</p>
                            <p><strong>Equipo:</strong> ID {resultado.idEquipo}</p>
                            <p><strong>Personas creadas:</strong> {resultado.personasCreadas}</p>
                            <p><strong>Personas existentes:</strong> {resultado.personasExistentes}</p>
                            <p><strong>Total celdas importadas:</strong> {resultado.totalCeldas}</p>
                            {resultado.personasCreadasLista?.length > 0 && (
                                <div>
                                    <p className="font-medium mt-2">Nuevas personas creadas:</p>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {resultado.personasCreadasLista.map((n, i) => <li key={i}>{n}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <button onClick={() => navigate(`/turnos/matriz/${resultado.idCuadro}`)}
                                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">
                                Ver Matriz
                            </button>
                            <button onClick={() => navigate('/turnos/cuadro-turnos')}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">
                                Ir a Cuadros
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
