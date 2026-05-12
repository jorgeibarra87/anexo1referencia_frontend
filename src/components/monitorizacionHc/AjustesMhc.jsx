import Select from 'react-select';
import { useEffect, useState } from 'react';
import useFetchProcesoServicioConPreguntas from '../../hooks/monitorizacionHC/useFetchProcesoServicioConPreguntas';
import useFetchRolesByMicroservice from '../../hooks/authService/useFetchRolesByMicroservice';
import useFetchUsuariosProcServ from '../../hooks/monitorizacionHC/useFetchUsuariosProcServ';
import useFetchUsuarioPageable from '../../hooks/authService/useFetchUsuarioPageable';
import useSaveUsuarioProcServ from '../../hooks/monitorizacionHC/useSaveUsuarioProcServ';
import useEditUsuarioProcServ from '../../hooks/monitorizacionHC/useEditUsuarioProcServ';
import useUpdateUsuarioRoles from '../../hooks/authService/useUpdateUsuarioRoles';
import ModificarRolesUsuario from '../ModificarRolesUsuario';
import useSaveUsuarioMHC from '../../hooks/monitorizacionHC/useSaveUsuarioMHC';
import Pagination from '../Pagination';
import Loader from '../Loader';
import { toast } from 'react-toastify';

function AjustesMhc() {
  const MONITORIZACION = 'MONITORIZACIONHC';

  //MONITORIZACIONHC
  const { usuariosProServ, setUsuariosProcServ, loadingUps } = useFetchUsuariosProcServ();
  const { procesosServicios, loadingPs } = useFetchProcesoServicioConPreguntas();
  const { data: dataU, loading: loadingU, error: errorU, fetchUsuarios } = useFetchUsuarioPageable();
  const { data: dataR, loading: loadingR, error: errorR, fetchRolesByMycroservice } = useFetchRolesByMicroservice();
  const { loading: loadingSU, response: responseSU, error: errorSU, saveUsuario } = useSaveUsuarioMHC();
  const { data: dataUpdateU, loading: loadingUpdateU, error: errorUpdateU, updateUsuarioRoles } = useUpdateUsuarioRoles();
  const { loadingRPS, saveUsuarioRelacionProcesoServicio, response: responseUsuRelPro, error: errorRPS } = useSaveUsuarioProcServ();
  const { editarUsuarioProcServ } = useEditUsuarioProcServ();

  const [documento, setDocumento] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openTabla, setOpenTabla] = useState(true);
  const [usuarioSincronizado, setUsuarioSincronizado] = useState(null);
  const [page, setPage] = useState(0);

  // Cambiar el título de la página al montar el componente
  useEffect(() => {
    document.title = 'Monitorición HC - Ajustes';
  }, []);

  // Cargar roles al montar el componente del microservicio
  useEffect(() => {
    fetchRolesByMycroservice(MONITORIZACION);
  }, []);

  // manejo de todos los errores de las peticiones
  useEffect(() => {
    if (errorU) {toast.error(`Error al cargar usuarios: ${errorU.message}`);}
    if (errorR) {toast.error(`Error al cargar roles: ${errorR.message}`);}
    if (errorSU) {toast.error(`Error al guardar usuario: ${errorSU.message}`);}
    if (errorRPS) {toast.error(`Error al guardar relación usuario-proceso-servicio: ${errorRPS.message}`);}
    if (errorUpdateU) {toast.error(`Error al actualizar roles del usuario: ${errorUpdateU.message}`);}
  }, [errorU, errorR, errorSU, errorRPS, errorUpdateU]);

  const opcionesRoles = dataR?.map((rol) => ({ value: rol.id, label: rol.rol }));

  // Cargar usuarios al montar el componente y al cambiar de página
  useEffect(() => {
    fetchUsuarios(MONITORIZACION, page, 100);
  }, [page]);

  // fusionar los usuarios con procesos y servicios con los roles del usuario
  useEffect(() => {
    if (usuariosProServ && dataU) {
      const usuariosConRoles = usuariosProServ.map((usuario) => {
        const usuarioData = dataU.content.find((u) => u.username == usuario.usuario.documento);
        return {
          ...usuario,
          roles: usuarioData ? usuarioData.roles : [],
        };
      });
      setUsuariosProcServ(usuariosConRoles);
    }
  }, [dataU]);

  // maneja la respuesta al guardar la relacion de usuario con procesos y servicios
  useEffect(() => {
    if (responseUsuRelPro && responseUsuRelPro.respuesta) {
      toast.success(responseUsuRelPro?.respuesta);
    }
  }, [responseUsuRelPro]);

  // Actualizar la relación de usuario con procesos y servicios
  const handleSelectChange = (documento, tipo, selected) => {
    setUsuariosProcServ((prev) => {
      const updatedState = prev.map((u) => (u.usuario.documento === documento ? { ...u, [tipo]: selected } : u));
      // Generar los items actualizados para el documento especificado
      const usuarioData = updatedState.find((u) => u.usuario.documento === documento);

      if (usuarioData) {
        const items = [...usuarioData.procesos, ...usuarioData.servicios];
        editarUsuarioProcServ(documento, items);
      }
      return updatedState;
    });
  };

  // Actualizar el estado de los usuarios con procesos y servicios al editar
  useEffect(() => {
    const newUsuarios = usuariosProServ?.map((u) => {
      if (u.usuario.documento === dataUpdateU?.username) {
        return {
          ...u,
          procesos: dataUpdateU.procesos,
          servicios: dataUpdateU.servicios,
          roles: dataUpdateU.roles,
        };
      }
      return u;
    });
    setUsuariosProcServ(newUsuarios);
  }, [dataUpdateU]);

  // maneja cambio de roles del usuario enviando peticion
  const handleRolesChange = (selectOption, usuario) => {
    const rolesseleccionados = selectOption.map((option) => ({ id: option.value, rol: option.label }));
    const rolesActuales = usuariosProServ.find((u) => u.usuario.documento === usuario.documento)?.roles || [];
    const rolesQuitados = rolesActuales.filter((r) => !rolesseleccionados.some((r2) => r2.id === r.id));
    const rolesAgregados = rolesseleccionados.filter((r) => !rolesActuales.some((r2) => r2.id === r.id));
    if (rolesQuitados.length > 0) {
      // si se quita un rol
      updateUsuarioRoles(usuario.documento, rolesQuitados, 'eliminar');
    } else if (rolesAgregados.length > 0) {
      // si se agrega un rol
      updateUsuarioRoles(usuario.documento, rolesAgregados, 'agregar');
    }
  };

  // cuando el usuario se sincroniza con el microservicio de auhtentication
  // se guarda el usuario en la base de datos de monitorizaciónHC
  useEffect(() => {
    if (!usuarioSincronizado) return;
    saveUsuario(usuarioSincronizado);
  }, [usuarioSincronizado]);

  // maneja notificación al guardar usuario
  useEffect(() => {
    if (!responseSU) return;
    toast.success(`Usuario ${responseSU.documento} sincronizado correctamente`);
  }, [responseSU]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUsuarioRelacionProcesoServicio(selectedOptions, documento);
  };

  // manejo de loading de las peticiones que se ejecutan al montar el componente
  if (loadingU || loadingR) return <Loader />;

  return (
    <>
      {(loadingUps || loadingPs || loadingRPS || loadingSU || loadingUpdateU) && <Loader />}
      {/* Título */}
      <p className="text-center bg-gray-100 text-gray-800 p-2 rounded-md text-lg font-medium">
        Ajustes <strong className="text-blue-600">MONITORIZACIONHC</strong>
      </p>

      {/* Acordeón - Formulario */}
      <div className="mb-4 border rounded-xl shadow">
        <button onClick={() => setOpenForm(!openForm)} className="w-full flex justify-between items-center px-6 py-2 bg-blue-100 hover:bg-blue-200 text-left transition-colors">
          <h6 className="text-lg font-semibold text-gray-800">Formulario de sincronización</h6>
          <span className="ml-2 text-gray-500">&#x25BC;</span>
        </button>

        {openForm && (
          <>
            <ModificarRolesUsuario listRoles={dataR} onData={(respuesta) => setUsuarioSincronizado(respuesta)} />
            <div className="p-6 bg-white space-y-6">
              <label className="block text-gray-700 font-medium">Agregar usuario y relaciones con procesos y/o servicios</label>
              <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
                <input type="text" onChange={(e) => setDocumento(e.target.value)} placeholder="Número de documento"
                  className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <div className="flex-1 min-w-[250px]">
                  <Select isMulti options={procesosServicios} onChange={setSelectedOptions} classNamePrefix="select" placeholder="Selecciona una opción" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition whitespace-nowrap">
                  Guardar
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Acordeón - Tabla */}
      <div className="mb-4 border rounded-xl shadow">
        <button onClick={() => setOpenTabla(!openTabla)} className="w-full flex justify-between items-center px-6 py-2 bg-blue-100 hover:bg-blue-200 text-left transition-colors">
          <h6 className="text-lg font-semibold text-gray-800">Usuarios sincronizados con el microservicio</h6>
          <span className="ml-2 text-gray-500">&#x25BC;</span>
        </button>

        {openTabla && (
          <div className="p-6 bg-gray-100 space-y-6">
            <div className="">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-left">Documento</th>
                    <th className="border p-2 text-left">Proceso</th>
                    <th className="border p-2 text-left">Servicio</th>
                    <th className="border p-2 text-left">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosProServ.map((u, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{u.usuario.documento}</td>
                      <td className="border p-2">
                        <Select isMulti options={procesosServicios.filter((i) => i.tipo === 'PROCESO')} value={u.procesos} classNamePrefix="select"
                          onChange={(selected) => handleSelectChange(u.usuario.documento, 'procesos', selected)} />
                      </td>
                      <td className="border p-2">
                        <Select isMulti options={procesosServicios.filter((i) => i.tipo === 'SERVICIO')} value={u.servicios} classNamePrefix="select"
                          onChange={(selected) => handleSelectChange(u.usuario.documento, 'servicios', selected)} />
                      </td>
                      <td className="border p-2">
                        {u.roles && (
                          <Select isMulti options={opcionesRoles} value={u.roles.map((r) => ({ value: r.id, label: r.rol }))} onChange={(selectOpci) => handleRolesChange(selectOpci, u.usuario)} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={page} totalPages={dataU.totalPages} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AjustesMhc;