import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import Error404 from '../Error404'
import { useEffect, useState } from 'react';
import RequireAuth from './RequireAuth';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../shared/components/Sidebar';
import UpdateInnProduc from '../innProduc/UpdateInnProduc';
import FormSolDocumento from '../forgetpass/FormSolDocumento';
import HumanizacionSolicitudes from '../humanizacion/HumanizacionSolicitudes';
import OpcionesUsuario from '../ajustes/OpcionesUsuario';
import UsuariosProceso from '../mesaDeProcesos/UsuariosProceso';
import ProcesosSubprocesos from '../mesaDeProcesos/ProcesosSubprocesos';
import { obtenerToken } from '../../actions/loginActions';
import Tamizaje from '../tamizaje/Tamizaje';
import FormPreguntas from '../monitorizacionHc/FormPreguntas';
import AjustesMhc from '../monitorizacionHc/AjustesMhc';
import FormManteEquipos from '../sistemas/FormManteEquipos';
import AjustesSistemas from '../sistemas/AjustesSistemas';
import ProtectedWithIdle from './ProtectedWithIdle';
import ReportesIndex from '../monitorizacionHc/ReportesIndex';
import GenSerRipsCambioSipEstado from '../facturacion/GenSerRipsCambioSipEstado';
import { getRehabilitacionRoutes } from '../../modules/rehabilitacion/routes';
import { getReferenciacontrarreferenciaRoutes } from '../../modules/referencia-contrareferencia/routes';
import { getAnexo1Routes } from '../../modules/anexo1/routes';
import TurnosMainLayout from '../TurnosApp/TurnosMainLayout';

export default function RutasConfig() {

    const state = useSelector(state => state.login);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        // Maneja la carga del token y actualiza el estado de carga
        setLoading(true);
        //dispatch({ type: 'OBTENER_TOKEN' }); // Acción síncrona
        dispatch(obtenerToken());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (state.token !== null) {
            setIsLogged(true);
        }
        else {
            setIsLogged(false);
        }
    }, [state])

    useEffect(() => {
        const isDevMode = window.env?.VITE_DEV_MODE === "true";

        if (isDevMode && !state.token) {
            const tokenReal = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NzA2OTY0MCIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTklTVFJBRE9SIiwibmFtZV91c2VyIjoiSk9SR0UgQVJNQU5ETyBJQkFSUkEgUEFMQUNJT1MiLCJpYXQiOjE3NzU3Mzc4ODcsImV4cCI6MTc3NTczODQ4N30.sZ8Hq27bsosfrsNWnv6uq36bsqp4uP06sLMGdLSQn08";

            dispatch({
                type: "INICIAR_SESION",
                payload: {
                    jwt: tokenReal,
                    refreshToken: "fake-refresh"
                }
            });
        }
    }, [dispatch, state.token]);

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<RequireAuth isLogged={isLogged} loading={loading}>
                    <ProtectedWithIdle>
                        <Sidebar />
                    </ProtectedWithIdle>
                </RequireAuth>} />
                <Route path='/login' element={isLogged ? <Navigate to='/' /> : <Login />} />
                <Route path='/innProduc'>
                    <Route path='update' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={UpdateInnProduc} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='/mesaprocesos'>
                    <Route path='usuarioprocesos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={UsuariosProceso} /></RequireAuth>} />
                    <Route path='procesosysubprocesos' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={ProcesosSubprocesos} /></RequireAuth>} />
                </Route>
                <Route path='/nutricion'>
                    <Route path='tamizaje' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={Tamizaje} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='/password'>
                    <Route path='documento' element={<FormSolDocumento />} />
                </Route>
                <Route path='/humanizacion'>
                    <Route path='solicitudes' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={HumanizacionSolicitudes} /></RequireAuth>} />
                </Route>
                <Route path='/monitorizacionhc'>
                    <Route path='preguntas/:tipo' element={
                        <RequireAuth isLogged={isLogged} loading={loading} >
                            <ProtectedWithIdle>
                                <Sidebar componente={FormPreguntas} />
                            </ProtectedWithIdle>
                        </RequireAuth>}
                    />
                    <Route path='reportes' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={ReportesIndex} />
                        </ProtectedWithIdle></RequireAuth>} />
                    <Route path='ajustes' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={AjustesMhc} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='/rehabilitacion'>
                    {getRehabilitacionRoutes(isLogged, loading)}
                </Route>
                <Route path="/sistemas">
                    <Route path='mantenimientochequeo' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={FormManteEquipos} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                    <Route path='ajustes' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={AjustesSistemas} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='/facturacion'>
                    <Route path='cambioestadoips' element={<RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={GenSerRipsCambioSipEstado} />
                        </ProtectedWithIdle>
                    </RequireAuth>} />
                </Route>
                <Route path='/referenciacontrareferencia'>
                    {getReferenciacontrarreferenciaRoutes(isLogged, loading)}
                </Route>
                <Route path='/anexo1'>
                    {getAnexo1Routes(isLogged, loading)}
                </Route>
                
                <Route path='/turnos/*' element={
                    <RequireAuth isLogged={isLogged} loading={loading}>
                        <ProtectedWithIdle>
                            <Sidebar componente={TurnosMainLayout} />
                        </ProtectedWithIdle>
                    </RequireAuth>
                } />

                <Route path='/ajustes'>
                    <Route path='usuario' element={<RequireAuth isLogged={isLogged} loading={loading}><Sidebar componente={OpcionesUsuario} /></RequireAuth>}></Route>
                </Route>
                <Route path='*' element={<Error404 />} />
            </Routes>
        </HashRouter>
    )
}
