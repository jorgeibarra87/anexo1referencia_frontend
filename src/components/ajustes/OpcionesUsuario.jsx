import { useEffect, useState } from 'react';
import Select from 'react-select';
import useFetchUsuario from '../../hooks/authService/useFetchUsuario';
import Loader from '../Loader';
import useFetchRol from '../../hooks/authService/useFetchRol';
import SincronizarUsuario from '../SincronizarUsuario';
import useUpdateUsuarioRoles from '../../hooks/authService/useUpdateUsuarioRoles';

function OpcionesUsuario() {
  const { usuarios, loading: loadingU, error: errorU } = useFetchUsuario();
  const { roles, loading: loadingRoles, error: errorRoles } = useFetchRol();
  const { data: dataUpdateU, loading: loadingUpdateU, error: errorUpdateU, updateUsuarioRoles } = useUpdateUsuarioRoles();
  const [showSincronizar, setShowSincronizar] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [inputFind, setInputFind] = useState('');

  useEffect(() => {
    if (usuarios.length == 0) return;
    const data = usuarios.map((entry) => ({
      ...entry,
      roles: entry.roles.map((role) => ({value: role.id,label: role.rol,})),
    }));
    setTableData(data);
  }, [usuarios]);

  // actualizar los roles en la tabla despues de actualizar
  useEffect(() => {
    if (dataUpdateU) {
      const nuevosUsuario = tableData.map((u => {
        if (u.username == dataUpdateU.username) {
          return {
            ...u,
            roles: dataUpdateU.roles.map((role) => ({value: role.id,label: role.rol,})),
          };
        } else {
          return u;
        }
      }))
      setTableData(nuevosUsuario);
    }
  }, [dataUpdateU]);

  const opcionesRoles = roles.map((rol) => ({ value: rol.id, label: rol.rol }));

  // manejo el select roles, elimina o agrega los roles
  const handleRolesChange = (selectOption, usuario) => {
    const rolesseleccionados = selectOption.map((option) => ({ id: option.value, rol: option.label}));
    const rolesActuales = tableData.find((u) => u.username === usuario).roles;
    const rolesQuitados = rolesActuales.filter((r) => !rolesseleccionados.some((r2) => r2.id === r.value));
    const rolesAgregados = rolesseleccionados.filter((r) => !rolesActuales.some((r2) => r2.value === r.id));
    if (rolesQuitados.length > 0) {
      const rolesfinales = rolesQuitados.map((r) => ({ id: r.value, rol: r.label }));
      updateUsuarioRoles(usuario, rolesfinales, 'eliminar');
    }if (rolesAgregados.length > 0){
      updateUsuarioRoles(usuario, rolesAgregados, 'agregar');
    }
  };

  if (loadingU || loadingRoles) return <Loader />;
  if (errorU || errorRoles)return ( <div> Error al cargar los {errorU ? 'usuarios' : 'roles'} {errorU?.message || errorRoles?.message} </div> );

  
  return (
    <>
      <SincronizarUsuario show={showSincronizar} handleClose={() => setShowSincronizar(false)} />
      <div className="mt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onClick={() => setShowSincronizar(true)}>
          Agregar Usuario 
        </button>
      </div>

      <input type="text" className="mt-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar..." value={inputFind} onChange={(e) => setInputFind(e.target.value)} />

      <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Documento</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nombre Completo</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Roles</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData
              .filter((u) => u.username.includes(inputFind) || u.nombreCompleto.includes(inputFind.toLocaleUpperCase()))
              .map((u) => {
                return (
                  <tr key={u.username} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{u.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{u.nombreCompleto}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Select isMulti options={opcionesRoles} value={u.roles} onChange={(selectOpci) => handleRolesChange(selectOpci, u.username)} classNamePrefix="select" className="w-full" />
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </>
  );
}
export default OpcionesUsuario;