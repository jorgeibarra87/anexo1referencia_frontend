import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { obtenerCitasConsolidadas, registrarFinalizacionCitaAmbulatoria, registrarInicioCitaAmbulatoria, registrarllegadaCitaAmbulatoria, registrarNoLLegadaCitaAmbulatoria } from '../../../modules/rehabilitacion/api/registroCitasAmbulatorias'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { toast } from 'react-toastify'
import Loader from '../../../components/Loader'

const EXTERNAL_REASONS = [
  'CALAMIDAD DOMESTICA',
  'PROBLEMAS DE TRANSPORTE',
  'INCAPACIDAD MEDICA',
  'DOMICILIO LEJANO',
  'ORDEN PUBLICO',
  'FACTORES SOCIOECONOMICOS',
  'OTRA CITA MEDICA o EXAMENES',
  'FACTORES CLIMATICOS',
  'PACIENTE NO SE PRESENTA AL LLAMADO',
  'PACIENTE OLVIDA FACTURAR',
  'CERRADO POR PARO NACIONAL',
  'CERRADO POR PARO REGIONAL',
  'CERRADO POR BLOQUEO DE VIA',
  'CERRADO POR CONFLICTO SOCIAL',
  'CERRADO POR PROTESTA SOCIAL',
  'CERRADO POR FALTA DE SEGURIDAD EN LA VIA',
  'CERRADO POR PARO DE TRANSPORTADORES',
  'CERRADO POR PARO EN EL SECTOR AGRARIO',
  'CERRADO POR PROTESTA DE COMUNIDADES INDIGENAS',
  'CERRADO POR DESASTRES NATURALES',
  'CAUSA LABORAL'
]

const INTERNAL_REASONS = [
  'RETRASO EN FACTURACION',
  'RETRASO EN PROCESOS INTERNOS',
  'FALLO DEL SISTEMA',
  'ERROR EN AGENDAMIENTO',
  'DEFICIENCIA EN INFRAESTRUCTURA',
  'SE ATIENDE A TIEMPO PERO SE OLVIDA REALIZAR REGISTRO',
  'RETRASO DEL TERAPEUTA',
  'ERRORES EN CODIFICACION',
  'LLEGADA TARDE AL SERVICIO'
]

function RegistroAsistenciaAmbulatoria() {

  const MINUTOS_TOLERANCIA_LLEGADA = 10
  const MINUTOS_TOLERANCIA_ATENCION = 10

  const stateLogin = useSelector(state => state.login)
  const roles = stateLogin?.decodeToken?.authorities?.split(',') || []
  const hasRole = (...rolesToCheck) => rolesToCheck.some(role => roles.includes(role))
  const rutaRehabilitacion = window.env.VITE_URL_MIROCERVICE_REHABILITACION;

  const canLlegada = hasRole('ROLE_ADMINISTRADOR', 'ROLE_FACTURACION_REHABILITACION','ROLE_JEFE_REHABILITACION')
  const canIniciar = hasRole('ROLE_ADMINISTRADOR','ROLE_FISIOTERAPEUTA_REHABILITACION','ROLE_JEFE_REHABILITACION')
  const canFinalizar = hasRole('ROLE_ADMINISTRADOR', 'ROLE_FISIOTERAPEUTA_REHABILITACION','ROLE_JEFE_REHABILITACION')
  const canNoLlego = hasRole('ROLE_ADMINISTRADOR', 'ROLE_FISIOTERAPEUTA_REHABILITACION','ROLE_JEFE_REHABILITACION')

  const [citas, setCitas] = useState([])
  const [verTodo, setVerTodo] = useState(false)
  const [showTardia, setShowTardia] = useState(null)
  const [loading, setLoading] = useState(false)

  // ============================
  // Fetch agenda
  // ============================
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true)
        const response = await obtenerCitasConsolidadas(verTodo) // Pasamos true para ver todas las citas, false para solo las del médico logueado
        setCitas(response)
      } catch (error) {
        console.error('Error al obtener las citas de rehabilitación', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCitas()
  }, [verTodo])

  useEffect(() => {
    if (!canIniciar) return;

    const socket = new SockJS(`${rutaRehabilitacion}ws`);

    const stompClient = new Client({
      webSocketFactory: () => socket, 
      reconnectDelay: 5000,

      onConnect: () => {
        
        const fisioterapeutaId = stateLogin?.decodeToken?.sub; 
        console.log('Suscribiéndose a canal de llegadas para fisioterapeuta ID:', fisioterapeutaId)
        stompClient.subscribe(`/topic/llegadas/${fisioterapeutaId}`, (message) => {
          const data = JSON.parse(message.body);

          toast.info(`Llegó el paciente ${data.nombreCompletoPaciente} a la cita de las ${data.horaProgramada}`, {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setCitas(prev =>
            prev.map(c => {
              const fechaCita = new Date(c.appoinmentDate).getTime();
              const fechaData = new Date(`${data.fechaProgramada}T${data.horaProgramada}`).getTime();

              return (
                c.patientId === data.documentoPaciente &&
                fechaCita === fechaData
              )
                ? { ...c, estadoSesion: 'LLEGADA' }
                : c;
            })
          );

          const mensaje = `Llegó ${data.nombreCompletoPaciente}`;

          const speech = new SpeechSynthesisUtterance(mensaje);
          speech.lang= 'es-CO';
          speech.rate = 1;
          speech.pitch = 1;

          window.speechSynthesis.speak(speech);

        });
      }
    });
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    }

  }, [])

  // ============================
  // Utils
  // ============================
  const yaPasoHora = (fechaHoraCita) => {
    return new Date() > new Date(fechaHoraCita)
  }

  const obtenerHora = (fechaHora) => {
    return new Date(fechaHora).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const esTardia = (fechaHoraCita, minutosTolerancia) => {
    const fechaCita = new Date(fechaHoraCita)
    const ahora = new Date()

    const limite = new Date(fechaCita.getTime() + minutosTolerancia * 60000)

    return ahora > limite
  }

  const badgeEstado = (estado) => {
    switch (estado) {
      case 'EN_PROCESO':
        return 'bg-blue-100 text-blue-700'
      case 'FINALIZADA':
        return 'bg-gray-200 text-gray-700'
      case 'NO_LLEGO':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  // ============================
  // Acciones
  // ============================
  const llegadaAtencion = async (cita) => {
    if(esTardia(cita.appoinmentDate, MINUTOS_TOLERANCIA_LLEGADA) && showTardia?.razon == null){ 
      setShowTardia({ citaId: cita.id, tipoRazon: 'EXTERNA', razones: EXTERNAL_REASONS })
      return;
    }


    try {
      const body = {
        nombreCompletoPaciente: cita.patientName,
        documentoPaciente: cita.patientId,
        fechaProgramada: cita.appoinmentDate.split('T')[0],
        horaProgramada: cita.appoinmentDate.split('T')[1].substring(0, 8),
        especialidad: cita.speciality,
        profesional: cita.doctor,
        docMedico: cita.docMedico,
        categoriaMotivoLlegadaTardia: 'EXTERNA',
        llegadaTardia: showTardia?.razon || null
      }

      const response = await registrarllegadaCitaAmbulatoria(body)

      setCitas(prev =>
        prev.map(c =>
          c.patientId === cita.patientId
            ? { ...c, estadoSesion: 'LLEGADA', id: response.id, llegadaTardia: response.llegadaTardia }
            : c
        )
      )
      setShowTardia(null);
    } catch (error) {
      console.error('Error al iniciar atención', error)
    }
  }

  const iniciarAtencion = async (cita) => {
    if (esTardia(cita.appoinmentDate, MINUTOS_TOLERANCIA_ATENCION) && showTardia?.razon == null && cita.llegadaTardia == null){
      setShowTardia({ citaId: cita.id, tipoRazon: 'INTERNA', razones: INTERNAL_REASONS })
      return; 
    }
    const body = {
      categoriaMotivoAtencionTardia: 'INTERNA',
      detalleMotivoAtencionTardia: showTardia?.razon || null
    }

    await registrarInicioCitaAmbulatoria(cita.id, body)

    setCitas(prev =>
      prev.map(c =>
        c.id === cita.id ? { ...c, estadoSesion: 'EN_PROCESO' } : c
      )
    )

    setShowTardia(null);
  }

  const finalizarAtencion = async (id) => {
    await registrarFinalizacionCitaAmbulatoria(id)

    setCitas(prev =>
      prev.map(c =>
        c.id === id ? { ...c, estadoSesion: 'FINALIZADA' } : c
      )
    )
  }

  const marcarNoLlegado = async (cita) => {
    const body = {
      nombreCompletoPaciente: cita.patientName,
      documentoPaciente: cita.patientId,
      fechaProgramada: cita.appoinmentDate.split('T')[0],
      horaProgramada: cita.appoinmentDate.split('T')[1].substring(0, 8),
      especialidad: cita.speciality,
      profesional: cita.doctor
    }

    await registrarNoLLegadaCitaAmbulatoria(body)

    setCitas(prev =>
      prev.map(c =>
        c.id === cita.id ? { ...c, estadoSesion: 'NO_LLEGO' } : c
      )
    )
  }

  // ============================
  // Render
  // ============================
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Registro de Asistencia Ambulatoria
      </h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <select className={`mb-4 p-2 border rounded ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`} value={verTodo} onChange={(e) => setVerTodo(e.target.value === 'true')} disabled={loading}>
          <option value={false}>Ver mis citas</option>
          <option value={true}>Ver todas las citas</option>
        </select>
        {loading ? <Loader /> : (
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Especialidad</th>
              <th className='px-4 py-3 text-left'>Medico</th>
              <th className="px-4 py-3 text-left">EPS</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {citas.map(cita => (
              <Fragment key={cita.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">{obtenerHora(cita.appoinmentDate)}</td>
                <td className="px-4 py-3 font-medium">{cita.patientName}</td>
                <td className="px-4 py-3">{cita.speciality}</td>
                <td className="px-4 py-3">{cita.doctor}</td>
                <td className="px-4 py-3 text-sm">{cita.eps}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeEstado(cita.estadoSesion)}`}>
                    {cita.estadoSesion}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                    {cita.estadoSesion === 'PENDIENTE_DE_LLEGADA' && canLlegada && (
                    <button onClick={() => llegadaAtencion(cita)} disabled={cita.estadoSesion !== 'PENDIENTE_DE_LLEGADA'}
                      className={`px-3 py-1 rounded text-white text-sm 
                        ${cita.estadoSesion === 'PENDIENTE_DE_LLEGADA' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`} >
                      Llegada
                    </button>
                  )}
                  {cita.estadoSesion === 'LLEGADA' && canIniciar && (
                    <button onClick={() => iniciarAtencion(cita)} 
                      className={`px-3 py-1 rounded text-white text-sm bg-blue-600 hover:bg-blue-700`} >
                      Iniciar
                    </button>
                  )}

                  {cita.estadoSesion === 'EN_PROCESO' && canFinalizar && (
                    <button onClick={() => finalizarAtencion(cita.id)} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-800 text-white text-sm" >
                      Finalizar
                    </button>
                  )}

                  {cita.estadoSesion === 'PENDIENTE_DE_LLEGADA' &&
                    esTardia(cita.appoinmentDate, MINUTOS_TOLERANCIA_LLEGADA) && canNoLlego && (
                      <button onClick={() => marcarNoLlegado(cita)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm" >
                        No llegó
                      </button>
                    )}
                </td>
              </tr>
              {showTardia?.citaId === cita.id && cita.llegadaTardia == null && (
                <tr className='bg-red-50'>
                    <td colSpan="7" className="px-4 py-3">
                      <div className='grid md:grid-cols-3 gap-3 items-end'>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>Motivo:</label>
                            <select value={showTardia.razon} 
                            onChange={(e) => setShowTardia(prev => ({...prev, razon: e.target.value}))}
                            className='w-full p-2 border rounded text-sm'>
                              <option value="">Seleccione un motivo</option>
                              {(showTardia.razones.map(opcion => (
                                <option key={opcion} value={opcion}>{opcion}</option>
                              )))}
                            </select>
                          </div>
                          <div className='flex gap-2'>
                            <button onClick={cita.estadoSesion == 'LLEGADA' ? () => iniciarAtencion(cita) : () => llegadaAtencion(cita)}
                            className='px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm'>
                              confirmar
                            </button>
                            <button onClick={() => setShowTardia(null)} className='px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm'>
                              cancelar
                            </button>
                          </div>
                      </div>
                    </td>
                </tr>
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  )
}

export default RegistroAsistenciaAmbulatoria