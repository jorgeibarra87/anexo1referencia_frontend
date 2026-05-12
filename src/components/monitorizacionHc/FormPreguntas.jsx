import useAdnIngreso from '../../hooks/monitorizacionHC/useAdnIngreso';
import SearchIngreso from './SearchIngreso';
import useFetchPreguntas from '../../hooks/monitorizacionHC/useFetchPreguntas';
import React, { useEffect, useState } from 'react';
import useSaveRespuestas from '../../hooks/monitorizacionHC/useSaveRespuestas';
import Ingreso from '../../models/monitorizacionHc/Ingreso';
import Loader from '../Loader';
import AdnIngreso from '../../models/dinamica/AdnIngreso';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetchRespuestas from '../../hooks/monitorizacionHC/useFetchRespuestas';

function FormPreguntas() {
  const { adnIngreso, setAdnIngreso, loadingAdnI, fetchAdnIngreso, error: errorAdnIngreso } = useAdnIngreso();
  const { preguntas: grupoPreguntas, setPreguntas, loadingP, fetchPreguntas } = useFetchPreguntas();
  const { loadingRes, responseSr, saveRespuestas, error } = useSaveRespuestas();
  const { data: respuestasData, loading: loadingRespuestas, error: errorRespuestas, fetchRespuestas  } = useFetchRespuestas();

  const { tipo: tipoPregunta } = useParams(); // Medico, Enfermeria, Facturacion
  const [respuestas, setRespuestas] = useState([]);
  const [servicio, setServicio] = useState(null);
  const [fechaEvaluacion, setFechaEvaluacion] = useState("");
  const todasRespondidas =
    grupoPreguntas.reduce((sum, grupo) => {
      return sum + grupo.preguntas.length;
    }, 0) === respuestas.length;

  const handleChange = (id, preguntaTexto, respuesta) => {
    if(fechaEvaluacion === "") {
      toast.warning("Debe seleccionar la fecha de evaluación");
      return;
    }
    setRespuestas((prev) => {
      const respuestasActualizadas = prev.filter((r) => r.pregunta.id !== id); // Eliminamos la respuesta previa de la misma pregunta (si existía)
      return [...respuestasActualizadas, { pregunta: { id, pregunta: preguntaTexto }, respuesta, fechaEvaluacion: `${fechaEvaluacion}-01`}]; // Agregamos la nueva respuesta
    });
  };

  useEffect(() => {
    document.title = 'Monitorición HC - Formulario de Preguntas';
  }, []);

  useEffect(() => {
    if (errorAdnIngreso == null) return;
    if (errorAdnIngreso?.response?.data?.codigoError === "GC-0003") {
      toast.warning(errorAdnIngreso.response.data.mensaje.split(',')[1]);
    } else if (errorAdnIngreso) {
      toast.error('Se presentó un error al cargar el ingreso');
    }
  }, [errorAdnIngreso])

  useEffect(() => {
    setPreguntas([]);
    setRespuestas([]);
  }, [adnIngreso]);

  // manejo de errores
  useEffect(() => {
    if (error?.response?.data.codigoError === 'MHC-0014') {
      toast.warning(error.response.data.mensaje.split('|')[1]);
    } else if (error) {
      toast.error('se presento un error al guardar las respuestas');
    }
  }, [error]);

  const handleSubmit = (e) => {
    const ingreso = {
      ...adnIngreso,
      respuestas: respuestas,
    };
    const op = new Ingreso(ingreso);
    const form = {
      ingreso: op,
      procesoServicio: servicio,
    };
    saveRespuestas(form, tipoPregunta.toUpperCase());
  };

  // al recibir respuestas limpiamos el ingreso.
  useEffect(() => {
    if (responseSr || tipoPregunta) {
      setAdnIngreso(new AdnIngreso());
      if (responseSr) toast.success('Respuestas guardadas correctamente');
    }
  }, [responseSr, tipoPregunta]);

  // verificar si el usuario ya tiene respuestas para ese ingreso y tipo de pregunta, si es así no volver a mostrar preguntas.
  useEffect(() => {
    if(servicio === null) return;
    const form = {
      ingreso: adnIngreso.id,
      procesoOServicioId: servicio.id,
      procesoServicio: servicio.tipo,
      tipoPregunta: tipoPregunta.toUpperCase(),
    }
    fetchRespuestas(form);
  }, [servicio]);


  return (
    <div className="px-4 py-2">
      {(loadingRes || loadingAdnI || loadingP || loadingRespuestas) && <Loader />}

      {respuestasData?.respuestas?.length > 0 && (
        <div className="mb-4 p-4 border rounded-lg shadow-lg bg-yellow-100">
          <h2 className="text-center text-yellow-800 text-lg font-semibold">Ya se han registrado respuestas para este ingreso y tipo de pregunta.</h2>
        </div>
      ) }

      <div className="flex flex-col gap-4">
        {/* <SearchIngreso fetchAdnIngreso={fetchAdnIngreso} setAdnIngreso={setAdnIngreso} fetchPreguntas={fetchPreguntas} adnIngreso={adnIngreso} fetchRespuestasByIngreso={fetchRespuestasByIngreso} setServicio={setServicio}/> */}
        <SearchIngreso {...{ fetchAdnIngreso, setAdnIngreso, fetchPreguntas, adnIngreso, setServicio, setRespuestas, fechaEvaluacion, setFechaEvaluacion }} />

        {grupoPreguntas.length === 0 && (
          adnIngreso.id ? (
            <div className="mt-4">
              <div className="p-6 border rounded-lg shadow-lg bg-white">
                <h2 className="text-center text-gray-700 text-xl">Esta selección no cuenta con preguntas.</h2>
              </div>
            </div>
          ) : null
        )}

        {grupoPreguntas.length > 0 && respuestasData?.id === null && !loadingRespuestas && (
          <div className="mt-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right ">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="border p-2 text-left">Grupo</th>
                    <th className="border p-2 text-left">Pregunta para {tipoPregunta.toUpperCase()}</th>
                    <th className="border p-2 text-center">Sí</th>
                    <th className="border p-2 text-center">No</th>
                    <th className="border p-2 text-center">No Aplica</th>
                  </tr>
                </thead>
                <tbody>
                  {grupoPreguntas.map((grupo) => (
                    <React.Fragment key={grupo.nombre}>
                      {grupo.preguntas.map((preguntaItem, preguntaIndex) => (
                        <tr key={preguntaItem.id} className="bg-white border-b border-gray-200 hover:bg-gray-200 dark:bg-gray-50 dark:border-gray-300 dark:hover:bg-gray-150">
                          {preguntaIndex === 0 && (
                            <td rowSpan={grupo.preguntas.length} className="border p-2 align-top font-semibold text-gray-700">
                              {grupo.nombre}
                            </td>
                          )}

                          <td className="border p-2">{preguntaItem.pregunta}</td>

                          {['SI', 'NO', 'NO_APLICA'].map((opcion) => (
                            <td key={opcion} className="border text-center">
                              <input type="radio" name={`pregunta-${preguntaItem.id}`} value={opcion} 
                                checked={!!respuestas.find((r) => r.pregunta.id === preguntaItem.id && r.respuesta === opcion)}
                                onChange={() =>
                                  handleChange(
                                    preguntaItem.id,
                                    preguntaIndex, 
                                    opcion,
                                  )
                                }
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <button disabled={!todasRespondidas} onClick={handleSubmit} className={`mt-6 px-4 py-2 rounded text-white transition-colors ${todasRespondidas ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}> 
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormPreguntas;