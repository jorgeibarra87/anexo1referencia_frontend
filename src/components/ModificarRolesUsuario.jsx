import { useEffect, useState } from 'react';
import Select from 'react-select';
import useUpdateUsuarioRoles from '../hooks/authService/useUpdateUsuarioRoles';
import SincronizarUsuario from './SincronizarUsuario';
import { toast } from 'react-toastify';
import Loader from './Loader';

function ModificarRolesUsuario({ listRoles, onData }) {
  const { data, loading, error, updateUsuarioRoles } = useUpdateUsuarioRoles();

  const [documento, setDocumento] = useState('');
  const [showSincronizar, setShowSincronizar] = useState(false);
  const [roles, setRoles] = useState([]);

  const opcionesRoles = listRoles?.map((rol) => ({ value: rol.id, label: rol.rol }));

  // Mostrar modal de sincronización si el usuario no esta en la db de authenticacion
  useEffect(() => {
    if (error?.response?.data.codigoError == 'AUS-US-01') {
      setShowSincronizar(true);
    } else if (error) {
      toast.error('Ocurrió un error al actualizar los roles del usuario');
      console.error('Error al actualizar los roles del usuario:', error);
    }
  }, [error]);

  // Llamar a la función onData cuando se recibe data
  useEffect(() => {
    if (!data) return;
    onData(data);
  }, [data]);

  // Actualizar la lista de roles del usuario sincronizado
  const handleSubmit = (e) => {
    e.preventDefault();
    const doc = documento.trim();
    const rolesSeleccionados = roles.map((role) => ({ id: role.value }));
    if (!doc || rolesSeleccionados.length === 0) {
      toast.error('Debe ingresar un número de documento y seleccionar al menos un rol');
      return;
    }
    updateUsuarioRoles(doc, rolesSeleccionados, 'agregar');
  };

  return (
    <div className="p-6 bg-white space-y-6">
      <SincronizarUsuario show={showSincronizar} handleClose={() => setShowSincronizar(false)} documento={documento} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm text-gray-600">Agregar un usuario con un rol del microservicio</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
          {/* Documento */}
          <div className="flex-1">
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
              Documento
            </label>
            <input type="text" id="documento" placeholder="Ingrese el documento" onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>

          {/* Roles */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
            <Select isMulti options={opcionesRoles} placeholder="Seleccione los roles" onChange={(selectedOptions) => setRoles(selectedOptions)} className="text-sm" classNamePrefix="react-select" />
          </div>

          {/* Botón */}
          <div>
            <button type="submit" disabled={loading} 
              className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? (
                <>
                  Sincronizando...
                </>
              ) : (
                'Sincronizar'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default ModificarRolesUsuario;
