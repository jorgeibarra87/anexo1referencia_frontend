import { Route } from 'react-router-dom';
import RequireAuth from '../../components/config/RequireAuth';
import ProtectedWithIdle from '../../components/config/ProtectedWithIdle';
import Sidebar from '../../shared/components/Sidebar';
import indexRehabilitacion from './components/IndexRehabilitacion';
import RegistroAsistenciaAmbulatoria from './components/RegistroAsistenciaAmbulatoria';

export const getRehabilitacionRoutes = (isLogged, loading) => [
    <Route key='rehabilitacion-indicadores' path='indicadores' element={
        <RequireAuth isLogged={isLogged} loading={loading}>
            <ProtectedWithIdle>
                <Sidebar componente={indexRehabilitacion} />
            </ProtectedWithIdle>
        </RequireAuth>
    }/>,
    <Route key='rehabilitacion-asistencias' path='tomaAsistencias' element={
        <RequireAuth isLogged={isLogged} loading={loading}>
            <Sidebar componente={RegistroAsistenciaAmbulatoria} />
        </RequireAuth>
    }/>
];