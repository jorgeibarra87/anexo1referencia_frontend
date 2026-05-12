import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import Sidebar from '../../shared/components/Sidebar';
import FormDatos from './components/forms/FormDatos';
import ReferenciaTable from './components/tables/ReferenciaTable';
import TrasladosTotalPage from './components/pages/TrasladosTotalPage';
import TrasladosPage from './components/pages/TrasladosPage';
import FacturacionPage from './components/pages/FacturacionPage';
import CuentasMedicasPage from './components/pages/CuentasMedicasPage';
import ReporteTraslado from './components/pages/ReporteTraslado';
import HospitalTableRefContraRef from './components/tables/HospitalTableRefContraRef';

export const getReferenciacontrarreferenciaRoutes = (isLogged, loading) => [
    <Route key='refcontraref-formulario' path='formulario' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={FormDatos} /></RequireAuth>} />,
    <Route key='refcontraref-datos' path='datos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={ReferenciaTable} /></RequireAuth>} />,
    <Route key='refcontraref-hospitales' path='hospitales' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={HospitalTableRefContraRef} /></RequireAuth>} />,
    <Route key='refcontraref-totaltraslados' path='totaltraslados' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={TrasladosTotalPage} /></RequireAuth>} />,
    <Route key='refcontraref-traslados' path='traslados' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={TrasladosPage} /></RequireAuth>} />,
    <Route key='refcontraref-facturaciones' path='facturaciones' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={FacturacionPage} /></RequireAuth>} />,
    <Route key='refcontraref-cuentas-medicas' path='cuentas-medicas' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={CuentasMedicasPage} /></RequireAuth>} />,
    <Route key='refcontraref-reporte' path='reporte' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={ReporteTraslado} /></RequireAuth>} />
];
