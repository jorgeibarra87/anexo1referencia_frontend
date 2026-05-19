import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { apiTipoJornadaService } from '../../../../api/turnos/apiTipoJornadaService';

export default function TipoJornadaTable() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ codigo: '', nombre: '', horaInicio: '', horaFin: '', esDescanso: false, esTrabajo: true, color: '#3B82F6', orden: 0, estado: true });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        const data = await apiTipoJornadaService.getAll();
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const openCreate = () => {
        setEditando(null);
        setFormData({ codigo: '', nombre: '', horaInicio: '', horaFin: '', esDescanso: false, esTrabajo: true, color: '#3B82F6', orden: 0, estado: true });
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditando(item);
        setFormData({
            codigo: item.codigo,
            nombre: item.nombre,
            horaInicio: item.horaInicio || '',
            horaFin: item.horaFin || '',
            esDescanso: item.esDescanso || false,
            esTrabajo: item.esTrabajo !== false,
            color: item.color || '#3B82F6',
            orden: item.orden || 0,
            estado: item.estado !== false
        });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!formData.codigo.trim() || !formData.nombre.trim()) return;
        const payload = { ...formData, codigo: formData.codigo.trim().toUpperCase() };
        if (editando) {
            await apiTipoJornadaService.update(editando.codigo, payload);
        } else {
            await apiTipoJornadaService.create(payload);
        }
        setShowForm(false);
        setEditando(null);
        load();
    };

    const handleDelete = async (codigo) => {
        if (!window.confirm('¿Eliminar este tipo de jornada?')) return;
        await apiTipoJornadaService.delete(codigo);
        load();
    };

    const paginated = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tipos de Jornada</h2>
                <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} /> Nueva Jornada
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4">{editando ? 'Editar' : 'Nueva'} Tipo de Jornada</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Código *</label>
                                <input type="text" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})}
                                    disabled={!!editando}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
                                <input type="text" value={formData.horaInicio} onChange={e => setFormData({...formData, horaInicio: e.target.value})} placeholder="HH:mm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
                                <input type="text" value={formData.horaFin} onChange={e => setFormData({...formData, horaFin: e.target.value})} placeholder="HH:mm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
                                    className="w-full h-9 p-0.5 border border-gray-300 rounded-md cursor-pointer" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Orden</label>
                                <input type="number" value={formData.orden} onChange={e => setFormData({...formData, orden: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.esDescanso} onChange={e => setFormData({...formData, esDescanso: e.target.checked})} />
                                <label className="text-sm text-gray-700">Es descanso</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.esTrabajo} onChange={e => setFormData({...formData, esTrabajo: e.target.checked})} />
                                <label className="text-sm text-gray-700">Es trabajo</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.estado} onChange={e => setFormData({...formData, estado: e.target.checked})} />
                                <label className="text-sm text-gray-700">Activo</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => { setShowForm(false); setEditando(null); }} className="px-4 py-2 bg-gray-300 rounded-lg text-sm">Cancelar</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left">Código</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Hora Inicio</th>
                            <th className="p-3 text-left">Hora Fin</th>
                            <th className="p-3 text-left">Color</th>
                            <th className="p-3 text-center">Orden</th>
                            <th className="p-3 text-center">Descanso</th>
                            <th className="p-3 text-center">Trabajo</th>
                            <th className="p-3 text-center">Estado</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} className="p-6 text-center text-gray-500">Cargando...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={10} className="p-6 text-center text-gray-500">Sin registros</td></tr>
                        ) : paginated.map(item => (
                            <tr key={item.codigo} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="p-3 font-mono font-medium">{item.codigo}</td>
                                <td className="p-3">{item.nombre}</td>
                                <td className="p-3">{item.horaInicio || '-'}</td>
                                <td className="p-3">{item.horaFin || '-'}</td>
                                <td className="p-3">
                                    <span className="inline-block w-5 h-5 rounded border" style={{backgroundColor: item.color || '#ccc'}} />
                                </td>
                                <td className="p-3 text-center">{item.orden || 0}</td>
                                <td className="p-3 text-center">{item.esDescanso ? '✅' : '❌'}</td>
                                <td className="p-3 text-center">{item.esTrabajo ? '✅' : '❌'}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs ${item.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 mx-1"><FontAwesomeIcon icon={faEdit} /></button>
                                    <button onClick={() => handleDelete(item.codigo)} className="text-red-600 hover:text-red-800 mx-1"><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-3 border-t">
                        <span className="text-sm text-gray-500">{items.length} registros</span>
                        <div className="flex items-center gap-2">
                            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"><FontAwesomeIcon icon={faChevronLeft} /></button>
                            <span className="text-sm">{currentPage}/{totalPages}</span>
                            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
