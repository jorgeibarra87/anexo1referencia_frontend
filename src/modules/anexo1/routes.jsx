import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import Sidebar from '../../shared/components/Sidebar';
import Anexo1Table from './components/tables/Anexo1Table';
import TramiteForm from './components/forms/TramiteForm';
import SeguimientoIntraForm from './components/forms/SeguimientoIntraForm';
import SeguimientoAmbulatorioForm from './components/forms/SeguimientoAmbulatorioForm';

export const getAnexo1Routes = (isLogged, loading) => [
  <Route key="anexo1-general" path="general" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={Anexo1Table} />
    </RequireAuth>
  } />,
  <Route key="anexo1-tramite" path="tramite" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={TramiteForm} />
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-intra" path="seguimiento-intra" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={SeguimientoIntraForm} />
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-ambulatorio" path="seguimiento-ambulatorio" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={SeguimientoAmbulatorioForm} />
    </RequireAuth>
  } />,
];
