import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import Sidebar from '../../shared/components/Sidebar';
import Anexo1MainPage from './components/pages/Anexo1MainPage';
import TramitePage from './components/pages/TramitePage';
import SeguimientoIntraPage from './components/pages/SeguimientoIntraPage';
import SeguimientoAmbulatorioPage from './components/pages/SeguimientoAmbulatorioPage';

export const getAnexo1Routes = (isLogged, loading) => [
  <Route key="anexo1-general" path="general" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={Anexo1MainPage} />
    </RequireAuth>
  } />,
  <Route key="anexo1-tramite" path="tramite" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={TramitePage} />
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-intra" path="seguimiento-intra" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={SeguimientoIntraPage} />
    </RequireAuth>
  } />,
  <Route key="anexo1-seguimiento-ambulatorio" path="seguimiento-ambulatorio" element={
    <RequireAuth isLogged={isLogged} loading={loading}>
      <Sidebar componente={SeguimientoAmbulatorioPage} />
    </RequireAuth>
  } />,
];
