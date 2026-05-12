import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faFile, faFileEdit, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { guardarFactura, actualizarFactura } from '../../api/facturacionService';
import { obtenerTraslados, obtenerTrasladoPorId } from '../../../referencia-contrareferencia/api/trasladosService';
import { obtenerInformacionPacienteEgreso } from '../../../../api/dinamica/genPacienService';
const INPUT_CLASS = "border-2 border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const INPUT_READONLY = "border-2 border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-gray-500";

export default function FacturacionForm({ facturacion, onSaved }) {

    const statelogin = useSelector((state) => state.login);
    const usuario = statelogin.decodeToken;


    const [formData, setFormData] = useState({
        trasladoId: '',
        produccion: '',
        fechaFactura: '',
        factura: '',
        valor: '',
        nombreFacturador: usuario?.name_user || ''
    });

    // Datos del traslado (solo lectura, para referencia visual)
    const [infoTraslado, setInfoTraslado] = useState({
        nomPaciente: '',
        ingreso: '',
        documento: '',
        eps: ''
    });

    const [ingreso, setIngreso] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trasladosEncontrados, setTrasladosEncontrados] = useState([]);
    const [infoMessage, setInfoMessage] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const buscarPorTrasladoId = async (trasladoId) => {
        if (!trasladoId) return;
        try {
            const traslado = await obtenerTrasladoPorId(trasladoId);
            setInfoTraslado({
                nomPaciente: traslado.nomPaciente || '',
                ingreso: traslado.ingreso || '',
                documento: traslado.documento || '',
                eps: traslado.eps || ''
            });
            setIngreso(String(traslado.ingreso || ''));
        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError('Error al cargar datos del traslado: ' + (backendMessage || err.message));
        }
    };

    // Busca en la tabla traslados por ingreso
    const buscarPorIngreso = async (ingresoRaw) => {
        const ingresoBuscado = ingresoRaw.trim();
        if (!ingresoBuscado || ingresoBuscado.length < 3) return;

        setBuscando(true);
        setError('');
        setInfoMessage('');

        try {
            const encontrado = await obtenerInformacionPacienteEgreso(ingresoBuscado);

            if (!encontrado) {
                setInfoTraslado({ nomPaciente: '', ingreso: '', documento: '', eps: '' });
                setTrasladosEncontrados([]);
                setFormData(prev => ({ ...prev, trasladoId: '' }));
                setError(`No se encontró información para el ingreso: ${ingresoBuscado}`);
                return;
            }

            setInfoTraslado({
                nomPaciente: encontrado.nombreCompleto || '',
                ingreso: encontrado.ingreso || '',
                documento: encontrado.pacNumDoc || '',
                eps: encontrado.entidad || ''
            });

            const lista = await obtenerTraslados();

            const coincidencias = lista
                .filter(t => String(t.ingreso).trim() === ingresoBuscado)
                .sort((a, b) => new Date(b.fechaTraslado || b.fecha_traslado) - new Date(a.fechaTraslado || a.fecha_traslado));

            setTrasladosEncontrados(coincidencias);

            if (coincidencias.length === 1) {
                const traslado = coincidencias[0];
                setFormData(prev => ({
                    ...prev,
                    trasladoId: traslado.id_traslado || traslado.id
                }));
            } else if (coincidencias.length > 1) {
                setFormData(prev => ({
                    ...prev,
                    trasladoId: ''
                }));
                setInfoMessage('Se encontraron varios traslados para este ingreso. Selecciona el correcto.');
            } else {
                setFormData(prev => ({
                    ...prev,
                    trasladoId: ''
                }));
                setError(`Se encontró el ingreso ${ingresoBuscado}, pero no hay traslados asociados.`);
            }
        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrió un error al consultar el ingreso.');
        } finally {
            setBuscando(false);
        }
    };

    const handleSubmit = async (e) => {
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
                valor: Number(formData.valor)
            };

            if (facturacion) {
                await actualizarFactura(facturacion.id, payload);
            } else {
                await guardarFactura(payload);
            }

            onSaved && onSaved();
        } catch (err) {
            const backendMessage = err?.response?.data?.mensaje || err?.response?.data?.error;
            setError(backendMessage || err.message || 'Ocurrio un error al guardar la factura.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (facturacion) {
            setFormData({
                trasladoId: facturacion.trasladoId || '',
                produccion: facturacion.produccion || '',
                fechaFactura: facturacion.fechaFactura?.slice(0, 16) || '',
                factura: facturacion.factura || '',
                valor: facturacion.valor || '',
                nombreFacturador: facturacion.nombreFacturador || ''
            });
            // ✅ Carga automática de datos del traslado al editar
            setIngreso(String(facturacion.ingreso || ''));
            buscarPorTrasladoId(facturacion.trasladoId);
        } else {
            const now = new Date();
            const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setFormData({
                trasladoId: '',
                produccion: '',
                fechaFactura: local,
                factura: '',
                valor: '',
                nombreFacturador: usuario?.name_user || ''
            });
            setInfoTraslado({ nomPaciente: '', ingreso: '', documento: '', eps: '' });
            setIngreso('');
            setTrasladosEncontrados([]);
            setInfoMessage('');
        }
    }, [facturacion]);

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
                        readOnly={!!facturacion} className={facturacion ? INPUT_READONLY : INPUT_CLASS} required
                    />
                    {buscando && <p className="text-xs text-blue-500 mt-1">Buscando...</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Traslado</label>
                    <input type="text" value={formData.trasladoId} readOnly className={INPUT_READONLY} />
                </div>
                {trasladosEncontrados.length > 1 && (
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar traslado</label>
                        <select value={formData.trasladoId} onChange={e => handleChange('trasladoId', e.target.value)}
                            className={INPUT_CLASS} required >
                            <option value="">-- Seleccionar traslado --</option>
                            {trasladosEncontrados.map((t) => (
                                <option key={t.id_traslado || t.id} value={t.id_traslado || t.id}>
                                    {`ID: ${t.id_traslado || t.id} | fecha: ${t.fechaTraslado || t.fecha_traslado} | tipo: ${t.tipoTraslado || t.tipo_traslado} | destino: ${t.destino} | estado: ${t.estado}`}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded px-3 py-2">
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
                    <input type="text" value={infoTraslado.documento} readOnly className={INPUT_READONLY} required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EPS</label>
                    <input type="text" value={infoTraslado.eps} readOnly className={INPUT_READONLY} required/>
                </div>

                {/* ── SECCIÓN: Datos de facturación ── */}
                <div className="col-span-2 mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <FontAwesomeIcon icon={faFile} className="text-sm w-4 h-4 " /> Datos de facturación
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Producción</label>
                    <input type="text" value={formData.produccion}
                        onChange={e => handleChange('produccion', e.target.value)} className={INPUT_CLASS}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha factura</label>
                    <input type="datetime-local" value={formData.fechaFactura} 
                        onChange={e => handleChange('fechaFactura', e.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Factura</label>
                    <input type="text" value={formData.factura} onChange={e => handleChange('factura', e.target.value)}
                        className={INPUT_CLASS}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input type="number" min="0" step="0.01" value={formData.valor}
                        onChange={e => handleChange('valor', e.target.value)} className={INPUT_CLASS} required/>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre facturador</label>
                    <div className={INPUT_READONLY + ' ' + INPUT_CLASS}> {formData.nombreFacturador || ''}</div>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                    <button type="submit" disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        {loading ? 'Guardando...' : (
                            facturacion
                                ? <span><FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />Actualizar</span>
                                : <span><FontAwesomeIcon icon={faPlus} className="mr-2" />Crear</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
