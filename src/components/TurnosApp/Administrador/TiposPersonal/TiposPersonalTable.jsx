import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { tipoPersonalService } from '../../../../api/turnos/apiTipoPersonalService';

export default function TiposPersonalTable() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', sigla: '', estado: true });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => { loadTipos(); }, []);

    const loadTipos = async () => {
        setLoading(true);
        const data = await tipoPersonalService.getAll();
        setTipos(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const openCreate = () => {
        setEditando(null);
        setFormData({ nombre: '', sigla: '', estado: true });
        setShowForm(true);
    };

    const openEdit = (tipo) => {
        setEditando(tipo);
        setFormData({ nombre: tipo.nombre, sigla: tipo.sigla || '', estado: tipo.estado });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!formData.nombre.trim()) return;
        if (editando) {
            await tipoPersonalService.update(editando.idTipoPersonal, formData);
        } else {
            await tipoPersonalService.create(formData);
        }
        setShowForm(false);
        setEditando(null);
        loadTipos();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este tipo de personal?')) return;
        await tipoPersonalService.delete(id);
        loadTipos();
    };

    const paginated = tipos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(tipos.length / itemsPerPage);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tipos de Personal</h2>
                <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} /> Nuevo Tipo
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{editando ? 'Editar' : 'Nuevo'} Tipo de Personal</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sigla</label>
                                <input type="text" value={formData.sigla} onChange={e => setFormData({...formData, sigla: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
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
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Sigla</th>
                            <th className="p-3 text-left">Estado</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Cargando...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Sin registros</td></tr>
                        ) : paginated.map(tp => (
                            <tr key={tp.idTipoPersonal} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="p-3">{tp.idTipoPersonal}</td>
                                <td className="p-3 font-medium">{tp.nombre}</td>
                                <td className="p-3 text-gray-500">{tp.sigla || '-'}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs ${tp.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {tp.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => openEdit(tp)} className="text-blue-600 hover:text-blue-800 mx-1"><FontAwesomeIcon icon={faEdit} /></button>
                                    <button onClick={() => handleDelete(tp.idTipoPersonal)} className="text-red-600 hover:text-red-800 mx-1"><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-3 border-t">
                        <span className="text-sm text-gray-500">{tipos.length} registros</span>
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
