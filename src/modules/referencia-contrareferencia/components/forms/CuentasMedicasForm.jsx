import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faFile, faFileEdit, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { guardarCuentaMedica, actualizarCuentaMedica } from '../../../referencia-contrareferencia/api/cuentasMedicasService';
import { obtenerTraslados } from '../../../referencia-contrareferencia/api/trasladosService';
import { obtenerInformacionPacienteEgreso } from '../../../../api/dinamica/genPacienService';

const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-gray-500";

const toDatetimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
};

export default function CuentasMedicasForm({ cuentas, onSaved }) {

    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;

    const [formData, setFormData] = useState({
        trasladoId: '',
        fechaCuenta: '',
        fechaEgreso: '',
        servicioEgreso: '',
        responsableAuditoria: usuario?.name_user || '',
        observaciones: '',
    });

    // Datos del traslado (solo lectura, para referencia visual)
    const [infoTraslado, setInfoTraslado] = useState({
        nomPaciente: '',
        ingreso: '',
        documento: '',
        fechaEgreso: '',
        servicioEgreso: '',
        eps: ''
    });
    const [ingreso, setIngreso] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [trasladosEncontrados, setTrasladosEncontrados] = useState([]);
    const handleSeleccionTraslado = (trasladoId) => {
        handleChange('trasladoId', trasladoId);
    };

    const buscarPorIngreso = async (ingresoRaw) => {
        setError('');
        setInfoMessage('');
        const ingreso = ingresoRaw.trim();
        if (!ingreso || ingreso.length < 3) return;

        setBuscando(true);
        setError('');

        try {
            const encontrado = await obtenerInformacionPacienteEgreso(ingreso);

            if (!encontrado) {
                setInfoTraslado({
                    nomPaciente: '',
                    ingreso: '',
                    documento: '',
                    fechaEgreso: '',
                    servicioEgreso: '',
                    eps: ''
                });
                setTrasladosEncontrados([]);
                setFormData(prev => ({
                    ...prev,
                    trasladoId: '',
                    servicioEgreso: '',
                    fechaEgreso: ''
                }));
                setError(`No se encontró información para el ingreso: ${ingreso}`);
                return;
            }

            const fechaEgresoFormateada = toDatetimeLocal(encontrado.fechaEgreso);

            setInfoTraslado({
                nomPaciente: encontrado.nombreCompleto || '',
                ingreso: encontrado.ingreso ? String(encontrado.ingreso) : '',
                documento: encontrado.pacNumDoc || '',
                fechaEgreso: fechaEgresoFormateada,
                servicioEgreso: encontrado.servicio || '',
                eps: encontrado.entidad || ''
            });

            setFormData(prev => ({
                ...prev,
                servicioEgreso: encontrado.servicio || '',
                fechaEgreso: fechaEgresoFormateada,
                trasladoId: ''
            }));

            const listaTraslados = await obtenerTraslados();

            const coincidencias = listaTraslados
                .filter(t => String(t.ingreso).trim() === ingreso)
                .sort((a, b) => new Date(b.fechaTraslado) - new Date(a.fechaTraslado));

            setTrasladosEncontrados(coincidencias);

            if (coincidencias.length === 1) {
                setFormData(prev => ({
                    ...prev,
                    trasladoId: coincidencias[0].id
                }));
            } else if (coincidencias.length > 1) {
                setInfoMessage('Se encontraron varios traslados para este ingreso. Selecciona el correcto.');
            } else {
                setError(`Se encontró el ingreso ${ingreso}, pero no hay traslados asociados.`);
            }

        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrió un error al consultar el ingreso.');
        } finally {
            setBuscando(false);
        }
    };

    const handleSubmit = async (e) => {
        setError('');
        setInfoMessage('');
        e.preventDefault();
        if (!formData.trasladoId) {
            setError('Debes buscar un paciente válido antes de guardar');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                trasladoId: Number(formData.trasladoId),
            };

            if (cuentas) {
                await actualizarCuentaMedica(cuentas.id, payload);
            } else {
                await guardarCuentaMedica(payload);
            }

            onSaved && onSaved();
        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrio un error al guardar la cuenta medica.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cuentas) {
            setFormData({
                trasladoId: cuentas.trasladoId || '',
                fechaCuenta: cuentas.fechaCuenta?.slice(0, 16) || '',
                fechaEgreso: cuentas.fechaEgreso?.slice(0, 16) || '',
                servicioEgreso: cuentas.servicioEgreso || '',
                responsableAuditoria: cuentas.responsableAuditoria || '',
                observaciones: cuentas.observaciones || '',
            });
            // Carga automática de datos del traslado al editar
            setIngreso(cuentas.ingreso || '');
            buscarPorIngreso(cuentas.ingreso);
        } else {
            const now = new Date();
            const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            setFormData({
                trasladoId: '',
                fechaCuenta: local.toISOString().slice(0, 16),
                fechaEgreso: '',
                servicioEgreso: '',
                responsableAuditoria: usuario?.name_user || '',
                observaciones: '',
            });
            setInfoTraslado({ nomPaciente: '', ingreso: '', documento: '', fechaEgreso: '', servicioEgreso: '', eps: '' });
            setIngreso('');
        }
    }, [cuentas]);

    

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-2">
            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {/* ── SECCIÓN: Buscar paciente ── */}
                <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm w-4 h-4 text-black" /> Buscar paciente por ingreso
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso</label>
                    <input type="text" value={ingreso} onChange={e => setIngreso(e.target.value)} onBlur={e => buscarPorIngreso(e.target.value)}
                        placeholder="Ej: 5853765"
                        // Solo editable al crear, bloqueado al editar
                        readOnly={!!cuentas} className={cuentas ? INPUT_READONLY : INPUT_CLASS} required
                    />
                    {buscando && <p className="text-xs text-blue-500 mt-1">Buscando...</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Traslado</label>
                    <input type="text" value={formData.trasladoId} readOnly className={INPUT_READONLY} required />
                </div>
                {trasladosEncontrados.length > 1 && (
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar traslado</label>
                        <select value={formData.trasladoId} onChange={e => handleSeleccionTraslado(e.target.value)} className={INPUT_CLASS} required >
                            <option value="">-- Seleccionar traslado --</option>
                            {trasladosEncontrados.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {`ID: ${t.id} | fecha: ${t.fechaTraslado} | tipo: ${t.tipoTraslado} | destino: ${t.destino} | estado: ${t.estado}`}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                            Se encontraron varios traslados para este ingreso. Selecciona el correcto.
                        </p>
                    </div>
                )}

                {/* Datos del traslado - solo lectura */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                    <input type="text" value={infoTraslado.nomPaciente} readOnly className={INPUT_READONLY} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input type="text" value={infoTraslado.documento} readOnly className={INPUT_READONLY} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EPS</label>
                    <input type="text" value={infoTraslado.eps} readOnly className={INPUT_READONLY} required/>
                </div>
                {/* ── SECCIÓN: Datos de Cuentas Médicas ── */}
                <div className="col-span-2 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <FontAwesomeIcon icon={faFile} className="text-sm w-4 h-4 " /> Datos de Cuentas Médicas
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Cuenta</label>
                    <input type="datetime-local" value={formData.fechaCuenta} onChange={e => handleChange('fechaCuenta', e.target.value)}
                        readOnly className={INPUT_READONLY} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Servicio Egreso</label>
                    <input type="text" value={formData.servicioEgreso} onChange={e => handleChange('servicioEgreso', e.target.value)}
                        readOnly className={INPUT_READONLY} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Egreso</label>
                    <input type="datetime-local" value={formData.fechaEgreso} onChange={e => handleChange('fechaEgreso', e.target.value)}
                        readOnly className={INPUT_READONLY} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable Auditoria</label>
                    <div className={INPUT_READONLY + ' ' + INPUT_CLASS}> {formData.responsableAuditoria || ''}</div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                    <textarea rows={2} value={formData.observaciones} onChange={e => handleChange('observaciones', e.target.value)}
                        className="input-field border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                    <button type="submit" disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        {loading ? 'Guardando...' : (
                            cuentas
                                ? <span><FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />Actualizar</span>
                                : <span><FontAwesomeIcon icon={faPlus} className="mr-2" />Crear</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
