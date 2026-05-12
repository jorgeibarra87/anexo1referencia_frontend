import { Routes, Route } from "react-router-dom";

// Cuadros
import TurnosTable from './CuadrosTurno/CuadroTurnosTable';
import CrearCuadro from './CuadrosTurno/CrearCuadro';
import VerCuadro from './CuadrosTurno/VerCuadro';
import CrearCuadroMulti from './CuadrosTurno/CrearCuadroMulti';
import CrearCuadroMulti2 from './CuadrosTurno/CrearCuadroMulti2';
import CrearCuadroMulti3 from './CuadrosTurno/CrearCuadroMulti3';
import { SelectorCuadroHistorial } from './CuadrosTurno/SelectorCuadroHistorial';
import GestionCuadroHistoria from './CuadrosTurno/GestionCuadroHistoria';

// Equipos
import CrearEquipo from './Equipos/CrearEquipos';
import EquiposTable from './Equipos/EquiposTable';
import VerEquipo from './Equipos/VerEquipo';

// Contratos
import VerContrato from './Contratos/VerContratos';
import CrearContrato from './Contratos/CrearContratos';
import ContratosTable from './Contratos/ContratosTable';

// Turnos
import CrearTurnos from './Turnos/CrearTurnos';
import GestionTurnos from './Turnos/GestionTurnos';
import { SelectorCuadroTurno } from './Turnos/SelectorCuadroTurno';
import { FormularioTurno } from './Turnos/FormularioTurno';
import { VerTurno } from './Turnos/VerTurno';
import CalendarioTurnos from './Turnos/Calendario/CalendarioTurnos';

// Administrador
import ProcesosTable from './Administrador/Procesos/ProcesosTable';
import MacroprocesosTable from './Administrador/Macroprocesos/MacroprocesosTable';
import ServiciosTable from './Administrador/Servicios/ServiciosTable';
import BloqueServicioTable from './Administrador/Servicios/BloqueServicioTable';
import ProcesosAtencionTable from './Administrador/ProcesosAtencion/ProcesosAtencionTable';
import PersonasTable from './Administrador/Personas/PersonasTable';
import PersonasTitulosTable from './Administrador/Personas/PersonasTitulosTable';
import PersonasRolesTable from './Administrador/Personas/PersonaRolesTable';
import PersonasEquiposTable from './Administrador/Personas/PersonasEquiposTable';
import SeccionesTable from './Administrador/Secciones/SeccionesTable';
import SubseccionesTable from './Administrador/Subsecciones/SubseccionesTable';
import TitulosTable from './Administrador/Titulos/TitulosTable';
import TipoFormacionTable from './Administrador/Titulos/TipoFormacionTable';

// Reportes
import ReportesFiltro from './Reportes/ReportesFiltro';

// Notificaciones
import GestionNotificaciones from './Notificaciones/GestionNotificaciones';
import NotificacionAutomatica from './Notificaciones/NotificacionAutomatica';

const TurnosMainLayout = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 relative">
            <Routes>
                {/* Ruta principal */}
                <Route path="cuadro-turnos" element={<TurnosTable />} />

                {/* Rutas de Cuadros */}
                <Route path="crearCuadro" element={<CrearCuadro />} />
                <Route path="crearCuadro/editar/:id" element={<CrearCuadro />} />
                <Route path="crearCuadro/crear" element={<CrearCuadro />} />
                <Route path="CrearCuadroMulti" element={<CrearCuadroMulti />} />
                <Route path="CrearCuadroMulti2" element={<CrearCuadroMulti2 />} />
                <Route path="CrearCuadroMulti3" element={<CrearCuadroMulti3 />} />
                <Route path="selectorCuadroHistorial" element={<SelectorCuadroHistorial />} />
                <Route path="gestionCuadroHistoria/:id" element={<GestionCuadroHistoria />} />
                <Route path="VerCuadro/:id" element={<VerCuadro />} />

                {/* Rutas de Equipos */}
                <Route path="equipos" element={<EquiposTable />} />
                <Route path="crearEquipo" element={<CrearEquipo />} />
                <Route path="crearEquipo/editar/:id" element={<CrearEquipo />} />
                <Route path="crearEquipo/crear" element={<CrearEquipo />} />
                <Route path="VerEquipo/:id" element={<VerEquipo />} />

                {/* Rutas de Contratos */}
                <Route path="contratos" element={<ContratosTable />} />
                <Route path="crearContrato" element={<CrearContrato />} />
                <Route path="crearContrato/editar/:id" element={<CrearContrato />} />
                <Route path="crearContrato/crear" element={<CrearContrato />} />
                <Route path="VerContrato/:id" element={<VerContrato />} />

                {/* Rutas de Turnos */}
                <Route path="crearTurnos" element={<CrearTurnos />} />
                <Route path="crearTurnos/editar/:id" element={<CrearTurnos />} />
                <Route path="crearTurnos/crear" element={<CrearTurnos />} />
                <Route path="gestionTurnos" element={<GestionTurnos />} />
                <Route path="selector-cuadro-turno" element={<SelectorCuadroTurno />} />
                <Route path="gestionar-turnos" element={<GestionTurnos />} />
                <Route path="crear-turno" element={<FormularioTurno />} />
                <Route path="editar-turno/:turnoId" element={<FormularioTurno />} />
                <Route path="ver-turno/:turnoId" element={<VerTurno />} />
                <Route path="calendarioturnos" element={<CalendarioTurnos />} />

                {/* Rutas de Administrador */}
                <Route path="procesos" element={<ProcesosTable />} />
                <Route path="macroprocesos" element={<MacroprocesosTable />} />
                <Route path="servicios" element={<ServiciosTable />} />
                <Route path="procesosatencion" element={<ProcesosAtencionTable />} />
                <Route path="personas" element={<PersonasTable />} />
                <Route path="personastitulos" element={<PersonasTitulosTable />} />
                <Route path="personasroles" element={<PersonasRolesTable />} />
                <Route path="personasequipos" element={<PersonasEquiposTable />} />
                <Route path="secciones" element={<SeccionesTable />} />
                <Route path="subsecciones" element={<SubseccionesTable />} />
                <Route path="titulos" element={<TitulosTable />} />
                <Route path="tipoformacion" element={<TipoFormacionTable />} />
                <Route path="bloqueservicio" element={<BloqueServicioTable />} />

                {/* Rutas de Reportes */}
                <Route path="reportesfiltro" element={<ReportesFiltro />} />

                {/* Rutas de Notificaciones */}
                <Route path="notificacionCorreo" element={<GestionNotificaciones />} />
                <Route path="notificacionAutomatica" element={<NotificacionAutomatica />} />
            </Routes>
        </div>
    );
};

export default TurnosMainLayout;
