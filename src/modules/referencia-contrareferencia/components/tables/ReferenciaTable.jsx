import { useEffect, useMemo, useState } from "react";
import useFetchDatosRefContraRef from "../../hooks/useFetchDatosRefContraRef";
import Pagination from "../../../../components/Pagination";
import Loader from "../../../../components/Loader";
import { obtenerIngresosPorDocumentos } from "../../../../api/dinamica/genPacienService";
import { actualizarDatosReferenciaFechaActualizacionBusquedaIngresos, actualizarDatosReferenciaIngresos, buscarDatosPorIdODocumento, obtenerDatosEntreFechasRefContraReferencia } from "../../api/datosReferenciaService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";
import usePostObservacionTriageRefContraRef from "../../hooks/usePostObservacionTriageRefContraRef";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { useSelector } from "react-redux";
import TextoColapsable from "../../../../components/utilities/TextoColapsable";
import ListaColapsable from "../../../../components/utilities/ListaColapsable";

export default function ReferenciaTable() {

  const statelogin = useSelector((state) => state.login);
  const authorities = statelogin.decodeToken?.authorities || [];

  const { data: datosRef, setData: setDatosRef, loading: loadingDatosRef, error: errorDatosRef, page, setPage } = useFetchDatosRefContraRef();
  const { putObservacionTriage, isPutting, putError } = usePostObservacionTriageRefContraRef();

  // Manejar el envío de la observación de triage
  const [observacionInput, setObservacionInput] = useState("");

  // Estado para rastrear el ID del elemento que tiene el cursor encima
  const [hoveredId, setHoveredId] = useState(null);
  const limite = 20; // El límite de caracteres

  const ALTURA_FIJA_ELEMENTOS = '250px';
  const UMBRAL_VERIFICACION_MS = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

  // procesar los datos recientes menores a 5 días para validar sus ingresos posteriores
  useEffect(() => {
    if (!datosRef || !datosRef.content) return;

    const isCaducadoPorFecha = (dato, UMBRAL_MS) => {
      // Caso 1: Si la fecha es null, se considera caducado.
      if (dato.fechaActualizacionBusquedaIngresos === null) {
        return true;
      }

      // Caso 2: Se calcula la diferencia de tiempo
      const fechaActMs = new Date(dato.fechaActualizacionBusquedaIngresos).getTime();
      const diferenciaMs = Date.now() - fechaActMs;

      // Se considera caducado si la diferencia supera el umbral
      return diferenciaMs > UMBRAL_MS;
    };

    const { documentosCaducados, idsCaducados } = datosRef.content.reduce(
      (acc, dato) => {
        // 1. Aplicamos la lógica de la fecha para determinar si está "caducado"
        if (isCaducadoPorFecha(dato, UMBRAL_VERIFICACION_MS)) {
          // 2. Si está caducado, se agregan tanto la identificación como el id
          acc.documentosCaducados.push(dato.identificacion);
          acc.idsCaducados.push(dato.id);
        }
        return acc;
      },
      // Valor inicial del acumulador (dos arrays vacíos)
      { documentosCaducados: [], idsCaducados: [] }
    );

    if (documentosCaducados.length === 0) return; // No hay documentos recientes

    const actualizarYRefrescar = async () => {
      const ingresosPorDocumento = await obtenerIngresosPorDocumentos(documentosCaducados);
      // construyendo data para poder hacer put
      const ingresosMap = ingresosPorDocumento.reduce((acc, item) => {
        acc[item.pacNumDoc] = item.adnIngresos;
        return acc;
      }, {});

      // construimos los datos finales para actualizar
      const datosFinales = datosRef.content
        .filter(itemRef => ingresosMap.hasOwnProperty(itemRef.identificacion))
        .map(itemRef => {
          const identificacion = itemRef.identificacion;

          return {
            id: itemRef.id,
            ingresos: ingresosMap[identificacion].map(ingreso => ({
              fechaIngreso: ingreso.ainFecIng,
            }))
          };
        });

      // actualizamos
      await actualizarDatosReferenciaIngresos(datosFinales);

      // actualizamos la fechaActualizacionBusquedaIngresos
      await actualizarDatosReferenciaFechaActualizacionBusquedaIngresos(idsCaducados);

    }

    actualizarYRefrescar();

  }, [datosRef]);

  // manejo del error al hacer put del comentario triage
  useEffect(() => {
    if (putError) {
      toast.error(`Error al guardar la observación: ${putError}`);
    }
  }, [putError]);

  const filasProcesadas = useMemo(() => {
    if (!datosRef || !datosRef.content) return [];
    return datosRef.content;
  }, [datosRef]);

  const handleSaveObservacionTriage = async (id) => {

    if (!observacionInput.trim()) {
      toast.error("La observación no puede estar vacía.");
      return;
    }
    const objActualizado = await putObservacionTriage(id, observacionInput);
    setDatosRef(prev => ({
      ...prev,
      content: prev.content.map((item) => item.id == objActualizado.id ? objActualizado : item),
    }));

    setObservacionInput("");
  }

  if (loadingDatosRef) return <Loader />
  if (errorDatosRef) return <div><h2>{`se presento un error ${errorDatosRef}`}</h2></div>

  // organizamos la data otebnida para exportar en formato plano
  const datosExportar = (datos) => {
    return datos.map(dato => {
      const hospitalPlano = dato.hospital ? `${dato.hospital.nombre}, ${dato.hospital.ciudad}` : '';

      const ingresosPlanos = dato.ingresos && dato.ingresos.length > 0
        ? dato.ingresos.map(ingreso => ingreso.fechaIngreso).join(', ') : 'No hay ingresos';

      return {
        "Número Referencia": dato.id,
        "Fecha Comentario": dato.fechaComentario,
        "Fecha y Hora Actualización": new Date(dato.fecha).toLocaleString(),
        "Nombres": dato.nombres,
        "Apellidos": dato.apellidos,
        "Identificación": dato.identificacion,
        "Edad": dato.edad,
        "Sexo": dato.sexo,
        "Entidad Social": dato.entidadSocial,
        "Hospital": hospitalPlano,
        "Médico que Solicita Remisión": dato.medicoSolicitanteRemision,
        "Especialidad Solicitante": dato.especialidadSolicitanteRemision,
        "Diagnóstico": dato.diagnosticoRemision,
        "Persona que Recibe Comentario": dato.nombrePersonaRecibeComentario,
        "Observaciones": dato.observaciones,
        "FC": dato.fc,
        "FR": dato.fr,
        "TA": dato.ta,
        "Temperatura": dato.temperatura,
        "SO2": dato.sodos,
        "Glasgow": dato.glasgow,
        "Escala Dolor /10": dato.escalaDolorVisual,
        "Requiere Aislamiento": dato.requiereAislamiento ? "Sí" : "No",
        "Urgencia Vital": dato.enviadaUrgenciaVital ? "Sí" : "No",
        "Estado": dato.estado ? "ACEPTADA" : "RECHAZADA",
        "Causa Remisión Nivel III": dato.causaRemisionNivelLLL,
        "Causa Rechazo": dato.causaRechazo,
        "Médico que Registra Decisión": dato.nombreMedicoRegistraDecision,
        "Ingresos": ingresosPlanos,
        "Observación Triage": dato.observacionTriage || "Sin observación",
      };
    });
  };

  // exportamos la data obtenida por fechas a un excel
  const handleExport = async (event) => {
    event.preventDefault();

    const formFechas = new FormData(event.target);
    const fechaInicio = formFechas.get("fechaInicio");
    const fechaFin = formFechas.get("fechaFin");

    if (!fechaInicio || !fechaFin) {
      toast.error("Por favor, ingrese ambas fechas.");
      return;
    }

    try {
      const response = await obtenerDatosEntreFechasRefContraReferencia(fechaInicio, fechaFin);
      const worksheet = XLSX.utils.json_to_sheet(datosExportar(response));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
      XLSX.writeFile(workbook, 'reporte_referencia_contrareferencia.xlsx');
    } catch (error) {
      toast.error(`Error al obtener datos: ${error.message}`);
      return;
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault();
    const formBuscar = new FormData(event.target);
    const terminoBusqueda = formBuscar.get("terminoBusqueda").toLowerCase();

    if (!terminoBusqueda || terminoBusqueda.trim() === "") {
      toast.info("Por favor, ingrese un término de búsqueda.");
      return;
    }

    const response = await buscarDatosPorIdODocumento(terminoBusqueda);
    if (response.length > 0) {
      setDatosRef((prev) => ({
        ...prev, content: response
      }));
    }
    else {
      toast.info("No se encontraron resultados para el término de búsqueda ingresado.");
      setDatosRef((prev) => (
        { ...prev, content: [] }
      ));
    }

  }

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg pb-4">
        <div className={`overflow-y-auto`} style={{ maxHeight: `calc(100vh - ${ALTURA_FIJA_ELEMENTOS})` }}>
          <div className="flex justify-between items-center space-x-4 p-1 rounded-lg">
            <div className="flex items-center space-x-2">
              <form id="formBuscar" className="flex items-center space-x-2" onSubmit={handleSearch}>
                <input className="border border-gray-300 rounded-md p-1" placeholder="Buscar" name="terminoBusqueda" required />
                <button type="submit" className="text-white rounded-lg px-1.5 py-1 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900">Buscar</button>
              </form>
            </div>
            <div className="flex items-center space-x-2">
              <form id='formFechas' onSubmit={handleExport}>
                <input name="fechaInicio" className="border border-gray-300 rounded-md p-1" type="date" required />
                <input name="fechaFin" className="border border-gray-300 rounded-md p-1" type="date" required />
                <button type="submit" className="text-white rounded-lg px-1.5 py-1 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900">Exportar Datos</button>
              </form>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3">NUMERO CONSECUTIVO DE REFERENCIA</th>
                <th scope="col" className="px-6 py-3">FECHA DE COMENTARIO</th>
                <th scope="col" className="px-6 py-3">FECHA Y HORA ULTIMA ACTUALIZACIÓN</th>
                <th scope="col" className="px-6 py-3">NOMBRES</th>
                <th scope="col" className="px-6 py-3">APELLIDOS</th>
                <th scope="col" className="px-6 py-3">IDENTIFICACION</th>
                <th scope="col" className="px-6 py-3">EDAD</th>
                <th scope="col" className="px-6 py-3">SEXO</th>
                <th scope="col" className="px-6 py-3">ENTIDAD DE SEGURIDAD SOCIAL</th>
                <th scope="col" className="px-6 py-3">NOMBRE DEL HOSPITAL QUE SOLICITA LA REMISION</th>
                <th scope="col" className="px-6 py-3">MEDICO QUE SOLICIA LA REMISION</th>
                <th scope="col" className="px-6 py-3">ESPECILIDAD QUE SOLICITA LA REMISION</th>
                <th scope="col" className="px-6 py-3">DIAGNOSTICO DEL PACIENTE SEGUN REMISION</th>
                <th scope="col" className="px-6 py-3">NOMBRE QUIEN RECIBE COMENTARIO EN REFERENCIA</th>
                <th scope="col" className="px-6 py-3">OBSERVACIONES</th>
                <th scope="col" className="px-6 py-3">FC</th>
                <th scope="col" className="px-6 py-3">FR</th>
                <th scope="col" className="px-6 py-3">TA</th>
                <th scope="col" className="px-6 py-3">TEMPERATURA</th>
                <th scope="col" className="px-6 py-3">SO2</th>
                <th scope="col" className="px-6 py-3">GLASGOW</th>
                <th scope="col" className="px-6 py-3">ESCALA DE DOLOR VISUAL /10</th>
                <th scope="col" className="px-6 py-3">REQUIERE AISLAMIENTO</th>
                <th scope="col" className="px-6 py-3">ENVIADA COMO URGENCIA VITAL</th>
                <th scope="col" className="px-6 py-3">CAUSA DE REMISION A NIVEL lll</th>
                <th scope="col" className="px-6 py-3">ACEPTADA</th>
                <th scope="col" className="px-6 py-3">NUMERO DE CODIGO</th>
                <th scope="col" className="px-6 py-3">CAUSA DE RECHAZO</th>
                <th scope="col" className="px-6 py-3">NOMBRE DEL MEDICO QUE REGISTRA LA DECISION</th>
                <th scope="col" className="px-6 py-3">INGRESOS EN HUSJ</th>
                {
                  (authorities.includes('ROLE_REFERENCIA_MODIFICAR_DATA') || authorities.includes('ROLE_ADMINISTRADOR')) &&
                  <th scope="col" className="px-6 py-3">Opciones</th>
                }
                <th scope="col" className="px-6 py-3">Comentario triage</th>
              </tr>
            </thead>
            <tbody>
              {filasProcesadas.map((d, index) => {
                return (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <th className="px-6 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">{d.id}</th>
                    <td className="px-6 py-2 text-xs">{d.fechaComentario}</td>
                    <td className="px-6 py-2 text-xs">{new Date(d.fecha).toLocaleTimeString()}</td>
                    <td className="px-6 py-2 text-xs">{d.nombres}</td>
                    <td className="px-6 py-2 text-xs">{d.apellidos}</td>
                    <td className="px-6 py-2 text-xs">{d.identificacion}</td>
                    <td className="px-6 py-2 text-xs">{d.edad}</td>
                    <td className="px-6 py-2 text-xs">{d.sexo}</td>
                    <td className="px-6 py-2 text-xs">{d.entidadSocial}</td>
                    <td className="px-6 py-2 text-xs">{d.hospital.nombre}</td>
                    <td className="px-6 py-2 text-xs">{d.medicoSolicitanteRemision}</td>
                    <td className="px-6 py-2 text-xs">{d.especialidadSolicitanteRemision}</td>
                    <td className="px-6 py-2 text-xs">
                      <TextoColapsable texto={d.diagnosticoRemision} limite={100} />
                    </td>
                    <td className="px-6 py-2 text-xs">{d.nombrePersonaRecibeComentario}</td>
                    <td className="px-6 py-2 text-xs whitespace-pre-wrap">
                      <TextoColapsable texto={d.observaciones} limite={100} />
                    </td>
                    <td className="text-center py-2 text-xs">{d.fc}</td>
                    <td className="text-center py-2 text-xs">{d.fr}</td>
                    <td className="text-center py-2 text-xs">{d.ta}</td>
                    <td className="text-center py-2 text-xs">{d.temperatura}</td>
                    <td className="text-center py-2 text-xs">{d.sodos}</td>
                    <td className="text-center py-2 text-xs">{d.glasgow}</td>
                    <td className="text-center py-2 text-xs">{d.escalaDolorVisual}</td>
                    <td className="text-center py-2 text-xs">{d.requiereAislamiento === true ? 'SI' : 'NO'}</td>
                    <td className="text-center py-2 text-xs">{d.enviadaUrgenciaVital === true ? 'SI' : 'NO'}</td>
                    <td className="text-center py-2 text-xs">{d.causaRemisionNivelLLL}</td>
                    <td className="text-center py-2 text-xs">{d.estado === true ? 'ACEPTADA' : 'RECHAZADA'}</td>
                    <td className="text-center py-2 text-xs">{d.id}</td>
                    <td className="text-center py-2 text-xs">{d.causaRechazo}</td>
                    <td className="text-center py-2 text-xs">{d.nombreMedicoRegistraDecision}</td>
                    <td className="py-2 text-xs text-center">
                      <ListaColapsable items={d.ingresos.map(ingreso => (ingreso.fechaIngreso))} limite={3} 
                        renderItem={(fecha, idx) => {
                          const fechaComentario = new Date(d.fechaComentario);
                          const fechaIngreso = new Date(fecha);
                          const isAfter = fechaIngreso >= fechaComentario;

                          return (
                            <span key={idx}
                              className={`px-2 py-1 rounded-md text-xs border ${
                                isAfter ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`} >
                              {fecha}
                            </span>
                          );
                        }}
                      />
                    </td>
                    {
                      (authorities.includes('ROLE_REFERENCIA_MODIFICAR_DATA') || authorities.includes('ROLE_ADMINISTRADOR')) &&
                      <td className="text-center py-2 text-xs">
                        <button className="text-blue-500 hover:text-blue-700 mr-2" title="Editar">
                          <FontAwesomeIcon icon={faPenClip} />
                        </button>
                      </td>
                    }
                    <td className="px-6 py-2 text-xs">
                      {d.observacionTriage == null || d.observacionTriage === '' ? (
                        authorities.includes('ROLE_REFERENCIA_COMENTARIO_TRIAGE') || authorities.includes('ROLE_ADMINISTRADOR') ? (
                          <>
                            <textarea type="text" onChange={(e) => setObservacionInput(e.target.value)} className="border border-gray-300 rounded-md p-1" />
                            <button disabled={isPutting} onClick={() => handleSaveObservacionTriage(d.id, observacionInput)} className="text-white rounded-lg px-1.5 py-1 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-900" >
                              Guardar
                            </button>
                          </>
                        ) : (<span className="text-gray-500 italic">Sin observación registrada</span>)
                      ) : (d.observacionTriage)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={datosRef.totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
