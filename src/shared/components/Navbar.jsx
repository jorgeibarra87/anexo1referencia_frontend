import { useDispatch, useSelector } from 'react-redux';
import { mostrarBarraLateral, ocultarBarraLateral } from '../../actions/sidebarActions';
import { useState } from 'react';
import { cerrarSesionAction } from '../../actions/loginActions';

export default function Navbar() {
  const stateSidebar = useSelector((state) => state.sidebar);
  const statelogin = useSelector((state) => state.login);
  const [usuario] = useState(statelogin.decodeToken);
  const dispatch = useDispatch();

  const handleSidebar = () => {
    if (stateSidebar.state == false) {
      dispatch(ocultarBarraLateral());
    } else {
      dispatch(mostrarBarraLateral());
    }
  };

  const handleLogout = () => {
    dispatch(cerrarSesionAction());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button type="button" onClick={handleSidebar} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <i className="bi bi-distribute-vertical"></i>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <ul className="flex items-center space-x-4">
            <li>
              <a className="text-gray-700 hover:text-gray-900">Usuario: {usuario.name_user}</a>
            </li>
            <li>
                <button type="button" onClick={handleLogout} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Salir</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
