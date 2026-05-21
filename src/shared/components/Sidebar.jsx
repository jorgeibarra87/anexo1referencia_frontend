import { useEffect, useState } from 'react';
import imgLogo from '../../img/favicon.ico'
import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
export default function Sidebar({ componente: Componente }) {

  const stateSidebar = useSelector(state => state.sidebar);
  const statelogin = useSelector(state => state.login);
  const [usuario, setUsuario] = useState(statelogin.decodeToken);
  const [submenuAbierto, setSubmenuAbierto] = useState(null);

  const toggleSubmenu = (nombre) => {
    setSubmenuAbierto(prev => prev === nombre ? null : nombre);
  };

    useEffect(() => {
  const token = localStorage.getItem('tokenhusjp');
  if (!token) return;

  const decoded = jwtDecode(token);

  let authorities = decoded.authorities;

  if (typeof authorities === "string") {
    authorities = authorities.split(","); 
  }

  setUsuario({
    ...decoded,
    authorities
  });
}, []);

    const opcionesMenu = [
        {
            nombre: 'InnoProduc',
            roles: ['ROLE_ADMINISTRADOR'], // Define los roles para esta opción
            submenu: [
                { nombre: 'Actualizar', ruta: '/innProduc/update', roles: ['ROLE_ADMINISTRADOR', 'ROLE_INNPRODUC'] }, // Roles permitidos para esta subopción
            ]
        },
        {
          nombre: 'Rehabilitación y Terapias',
          roles: ['ROLE_ADMINISTRADOR','ROLE_JEFE_REHABILITACION', 'ROLE_FISIOTERAPEUTA_REHABILITACION', 'ROLE_FACTURACION_REHABILITACION'],
          submenu: [
            { nombre: 'Indicadores', ruta: '/rehabilitacion/indicadores', roles: ['ROLE_ADMINISTRADOR','ROLE_JEFE_REHABILITACION'] },
            { nombre: 'Registro fases de atención consulta ambulatoria', ruta: '/rehabilitacion/tomaAsistencias', roles: ['ROLE_ADMINISTRADOR','ROLE_JEFE_REHABILITACION', 'ROLE_FISIOTERAPEUTA_REHABILITACION','ROLE_FACTURACION_REHABILITACION'] }
          ]
        },
        {
            nombre: 'Sistemas',
            roles: ['ROLE_ADMINISTRADOR','ROLE_SISTEMAS_MANTENIMIENTO'],
            submenu: [
                {
                    nombre: 'Mantenimiento chequeo', ruta: '/sistemas/mantenimientochequeo', roles: ['ROLE_ADMINISTRADOR', 'ROLE_SISTEMAS_MANTENIMIENTO'],
                    // submenuAdicional: [
                    //     { nombre: 'Mantenimiento preventivo chequeo', ruta: '/humanizacion/solicitudes', roles: ['ROLE_ADMINISTRADOR'] },
                    //     { nombre: 'solicitudes almacen', ruta: 'almacen', roles: ['ROLE_ADMINISTRADOR'] }
                    // ]
                },
                {
                    nombre: 'Ajustes', ruta: '/sistemas/ajustes', roles: ['ROLE_ADMINISTRADOR'],
                }
            ]
        },
        {
          nombre: 'Referencia Contrareferencia',
          roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_INDEX'],
          submenu: [
            { nombre: 'Formulario de datos', ruta: '/referenciacontrareferencia/formulario', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_FORMULARIO'] },
            { nombre: 'Tabla de referencias', ruta: '/referenciacontrareferencia/datos', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_EXPORTAR_DATA', 'ROLE_REFERENCIA_MODIFICAR_DATA', 'ROLE_REFERENCIA_COMENTARIO_TRIAGE'] },
            { nombre: 'Traslados de ambulancia', ruta: '/referenciacontrareferencia/totaltraslados', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_TRASLADOS_INDEX'] },
          ]
        },
        {
          nombre: 'Anexo 1 - Ref y Contraref',
          roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_INDEX'],
          submenu: [
            { nombre: 'Vista General', ruta: '/anexo1/general', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_EXPORTAR_DATA', 'ROLE_REFERENCIA_FORMULARIO'] },
            { nombre: 'Inicio de Trámite', ruta: '/anexo1/tramite', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_FORMULARIO'] },
            { nombre: 'Seg. Intrahospitalario', ruta: '/anexo1/seguimiento-intra', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_FORMULARIO'] },
            { nombre: 'Seg. Ambulatorio', ruta: '/anexo1/seguimiento-ambulatorio', roles: ['ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_FORMULARIO'] },
          ]
        },
        {
          nombre: 'Facturacion',
          roles: ['ROLE_ADMINISTRADOR','ROLE_FACTURACION'],
          submenu: [
            { nombre: 'Cambio estado servicio', ruta: '/facturacion/cambioestadoips', roles: ['ROLE_ADMINISTRADOR','ROLE_FACTURACION'] }
          ]
        },
        // {
        //     nombre: 'Asignación_de_camas',
        //     roles: ['ROLE_ADMINISTRADOR','ROLE_ADMINISTRADOR','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_MEDICO_ESPECIALISTA','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_FACTURACION','ROLE_CAMAS_ENFERMERO_URGENCIAS'],
        //     submenu: [
        //         {nombre: 'Solicitar cama', ruta: '/asginacioncamas/solicitud', roles: ['ROLE_ADMINISTRADOR','ROLE_ADMINISTRADOR','ROLE_CAMAS_MEDICO_ESPECIALISTA','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_FACTURACION','ROLE_CAMAS_ENFERMERO_URGENCIAS']},
        //         {nombre: 'Asignaciones', ruta: '/asginacioncamas/', roles: ['ROLE_ADMINISTRADOR','ROLE_ADMINISTRADOR','ROLE_CAMAS_ENFERMERO_INTERNACION','ROLE_CAMAS_COORD_INTERNACION','ROLE_CAMAS_ENFERMERO_URGENCIAS']}
        //     ]
        // },
        // {
        //     nombre: 'MesadeProcesos',
        //     roles: ['ROLE_ADMINISTRADOR','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER'],
        //     submenu: [
        //         {nombre: 'Procesos y subprocesos', ruta: '/mesaprocesos/procesosysubprocesos', roles: ['ROLE_ADMINISTRADOR','ROLE_MESADEPROCESOS_COORD']},
        //         {nombre: 'Usuarios procesos', ruta: '/mesaprocesos/usuarioprocesos', roles: ['ROLE_ADMINISTRADOR','ROLE_MESADEPROCESOS_COORD','ROLE_MESADEPROCESOS_USER']}
        //     ]
        // },
        {
            nombre: 'Nutricion',
            roles: ['ROLE_ADMINISTRADOR','ROLE_TAMIZAJE'],
            submenu:[
                {nombre: 'Tamizaje', ruta: '/nutricion/tamizaje', roles: ['ROLE_ADMINISTRADOR','ROLE_TAMIZAJE']}
            ]
        },
        {
            nombre: 'MonitorizacionHc',
            roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION'],
            submenu:[
                {nombre: 'Monitorizacion Medico', ruta: '/monitorizacionhc/preguntas/medico', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_MEDICO']},
                {nombre: 'Monitorizacion Enfermeria', ruta: '/monitorizacionhc/preguntas/enfermeria', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_ENFERMERIA']},
                {nombre: 'Monitorización Facturacion', ruta: '/monitorizacionhc/preguntas/facturacion', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_FACTURACION']},
                {nombre: 'Monitorización Rehabilitación', ruta: '/monitorizacionhc/preguntas/rehabilitacion', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION_REHABILITACION']},
                {nombre: 'Reportes', ruta: '/monitorizacionhc/reportes', roles: ['ROLE_ADMINISTRADOR','ROLE_MONITORIZACION']},
                {nombre: 'Ajustes', ruta: '/monitorizacionhc/ajustes', roles: ['ROLE_ADMINISTRADOR']}
            ]
        },
      {
        nombre: 'Aplicación Turnos',
        roles: ['ROLE_ADMINISTRADOR', 'ROLE_SUPERVISOR_TURNOS', 'ROLE_GESTOR_TURNOS'],
        submenu: [
          {
            nombre: 'Supervisión',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_SUPERVISOR_TURNOS'],
            submenuAdicional: [
              { nombre: 'Gestionar Contrato', ruta: '/turnos/contratos', roles: ['ROLE_ADMINISTRADOR', 'ROLE_SUPERVISOR_TURNOS'] },
              { nombre: 'Gestionar Reportes', ruta: '/turnos/reportesfiltro', roles: ['ROLE_ADMINISTRADOR', 'ROLE_SUPERVISOR_TURNOS'] },
              { nombre: 'Historial Cuadro', ruta: '/turnos/selectorCuadroHistorial', roles: ['ROLE_ADMINISTRADOR', 'ROLE_SUPERVISOR_TURNOS'] },
            ]
          },
          {
            nombre: 'Gestores',
            roles: ['ROLE_ADMINISTRADOR', 'ROLE_GESTOR_TURNOS'],
            submenuAdicional: [
              { nombre: 'Equipo Talento Humano', ruta: '/turnos/equipos', roles: ['ROLE_ADMINISTRADOR', 'ROLE_GESTOR_TURNOS'] },
              { nombre: 'Cuadros de Turno', ruta: '/turnos/cuadro-turnos', roles: ['ROLE_ADMINISTRADOR', 'ROLE_GESTOR_TURNOS'] },
              { nombre: 'Turnos', ruta: '/turnos/selector-cuadro-turno', roles: ['ROLE_ADMINISTRADOR', 'ROLE_GESTOR_TURNOS'] },
              { nombre: 'Calendario de Turno', ruta: '/turnos/calendarioturnos', roles: ['ROLE_ADMINISTRADOR', 'ROLE_GESTOR_TURNOS'] }
            ]
          },
          {
            nombre: 'Ajustes',
            roles: ['ROLE_ADMINISTRADOR'],
            submenuAdicional: [
              { nombre: 'Personas', ruta: '/turnos/personas', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Personas Títulos', ruta: '/turnos/personastitulos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Personas Roles', ruta: '/turnos/personasroles', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Personas Equipos', ruta: '/turnos/personasequipos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Macroprocesos', ruta: '/turnos/macroprocesos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Procesos', ruta: '/turnos/procesos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Servicios', ruta: '/turnos/servicios', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Procesos Atención', ruta: '/turnos/procesosatencion', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Secciones', ruta: '/turnos/secciones', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Subsecciones', ruta: '/turnos/subsecciones', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Contratos', ruta: '/turnos/contratos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Títulos', ruta: '/turnos/titulos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Tipo Formación', ruta: '/turnos/tipoformacion', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Turnos', ruta: '/turnos/selector-cuadro-turno', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Cuadros Turno', ruta: '/turnos/cuadro-turnos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Historial Cuadro', ruta: '/turnos/selectorCuadroHistorial', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Equipos', ruta: '/turnos/equipos', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Bloque Servicio', ruta: '/turnos/bloqueservicio', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Reportes', ruta: '/turnos/reportesfiltro', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Notificacion Correo', ruta: '/turnos/notificacionCorreo', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Notificacion Automática', ruta: '/turnos/notificacionAutomatica', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Entidades', ruta: '/turnos/entidades', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Tipos Personal', ruta: '/turnos/tipospersonal', roles: ['ROLE_ADMINISTRADOR'] },
              { nombre: 'Tipos Jornada', ruta: '/turnos/tipojornada', roles: ['ROLE_ADMINISTRADOR'] }
            ]
          }
        ]
      },
        {
            nombre: 'Ajustes',
            roles: ['ROLE_ADMINISTRADOR'],
            submenu: [
                { nombre: 'Usuario', ruta: '/ajustes/usuario', roles: ['ROLE_ADMINISTRADOR']}
            ]
        }
        // Agrega más opciones de menú aquí si es necesario
    ];

    // Filtra las opciones del menú principal según los roles del usuario
    const opcionesFiltradas = opcionesMenu.filter(opcion => {
        if (!opcion.roles) return true; // Si no se especifican roles, mostrar la opción
        return opcion.roles.some(rol => usuario.authorities?.includes(rol));
    });

    // Filtra las subopciones del menú según los roles del usuario
    const filtrarSubopciones = (subopciones) => {
        return subopciones.filter(subopcion => {
            if (!subopcion.roles) return true; // Si no se especifican roles, mostrar la subopción
            return subopcion.roles.some(rol => usuario.authorities?.includes(rol));
        });
    };

    const filtrarSubmenuAdicional = (subopcionesadicionales) => {
        return subopcionesadicionales.filter(subopcionadicional => {
            if (!subopcionadicional.roles) return true;
            return subopcionadicional.roles.some(rol => usuario.authorities?.includes(rol));
        });
    };

    return (
        <div className="wrapper">
      <nav id="sidebar" className={`${stateSidebar.state ? 'active' : ''} small`}>
        <div className="sidebar-header text-center">
          <img src={imgLogo} alt='logo' style={{ width: '40px', height: '40px' }} />
          <Link to='/' className="sin-estilo">Soluciones HUSJP</Link>
        </div>
        <ul className="list-unstyled components">
          {opcionesFiltradas.map((opcion, index) => (
            <li key={index}>
              <button
                className="dropdown-toggle w-full text-left px-3 py-2 text-white hover:bg-gray-200"
                onClick={() => toggleSubmenu(opcion.nombre)}
              >
                {opcion.nombre}
              </button>
              {submenuAbierto === opcion.nombre && (
                <ul className="list-unstyled pl-4">
                  {filtrarSubopciones(opcion.submenu).map((subopcion, subindex) => (
                    <li key={subindex}>
                      {subopcion.submenuAdicional ? (
                        <details className="pl-2">
                          <summary className="cursor-pointer">{subopcion.nombre}</summary>
                          <ul className="pl-4">
                            {filtrarSubmenuAdicional(subopcion.submenuAdicional).map((submenuadicional, subadcionalindex) => (
                              <li key={subadcionalindex}>
                                <Link to={submenuadicional.ruta}>{submenuadicional.nombre}</Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link to={subopcion.ruta} className="block px-2 py-1 hover:bg-gray-300">{subopcion.nombre}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div id="content" className="flex flex-col h-screen"> {/* Usa flexbox para un layout de columna */}
          <div className="navbar-fixed">
              <Navbar />
          </div>
          <div className="flex-grow overflow-y-auto p-4"> {/* El contenido principal con scroll propio */}
              {Componente && <Componente />}
          </div>
          <footer className="footer-dinamico flex-shrink-0"> {/* El footer queda fijo en la parte inferior */}
              <p className="text-muted text-center">
                  <small>Soluciones HUSJP © {import.meta.env.VITE_APP_VERSION} Hospital Universitario San Jose. Ing. Julio Alvarez. Todos los derechos reservados. EXT. 134</small>
              </p>
          </footer>
      </div>
    </div>
    )
}

//agregamos para que se valinden errores de prop.types
// Sidebar.propTypes = {
//     componente: PropTypes.elementType.isRequired,
// }