import Select from 'react-select';
import useFetchRespuestaIndividual from '../../hooks/monitorizacionHC/useFetchRespuestaIndividual';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import { obtenerTipoPreguntas } from '../../api/monitorizacionHc/preguntasService';

function ReporteIndividual({ procesosServicios }) {
  const { data, loading, error, fetchRespuestasIndividual } = useFetchRespuestaIndividual();
  const [tipoPregunta, setTipoPregunta] = useState([]);

  const [formData, setFormData] = useState({
    ingreso: '',
  });

  //traer los tipos de preguntas para el select
  useEffect(() => {
    if (tipoPregunta.length > 0) 
      return;
    const llamarTipoPreguntas = async () => {
      const respuesta = await obtenerTipoPreguntas();
      setTipoPregunta(respuesta);
    }
    llamarTipoPreguntas();
  },[])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption.tipo == 'SERVICIO') {
      setFormData((prevData) => ({
        ...prevData,
        servicioId: selectedOption ? selectedOption.value : null,
        procesoId: null, // Reiniciar procesoId si se selecciona un servicio
      }));
    } else if (selectedOption.tipo == 'PROCESO') {
      setFormData((prevData) => ({
        ...prevData,
        procesoId: selectedOption ? selectedOption.value : null,
        servicioId: null, // Reiniciar servicioId si se selecciona un proceso
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue

    if ((formData.servicioId || formData.procesoId) && formData.tipo_pregunta && formData.ingreso) {
      if (formData.servicioId) {
        fetchRespuestasIndividual({ servicioId: formData.servicioId, tipo_pregunta: formData.tipo_pregunta, ingreso: formData.ingreso });
      } else if (formData.procesoId) {
        fetchRespuestasIndividual({ procesoId: formData.procesoId, tipo_pregunta: formData.tipo_pregunta, ingreso: formData.ingreso });
      }
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  return (
    <div>
      <form className="w-full p-2 rounded-lg bg-white shadow" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Servicio / Proceso */}
          <div className="flex items-center gap-2">
            <label htmlFor="servicioSelect" className="text-sm font-medium text-gray-700">
              Servicio / Proceso
            </label>
            <Select options={procesosServicios} placeholder="Seleccione un Proceso/Servicio" required onChange={handleSelectChange} id="servicioSelect" className="min-w-[250px]" />
          </div>

          {/* Tipo de Pregunta */}
          <div className="flex items-center gap-2">
            <label htmlFor="tipoPregunta" className="text-sm font-medium text-gray-700">
              Tipo pregunta:
            </label>
            <select name="tipo_pregunta" id="tipoPregunta" required onChange={handleInputChange} value={formData.tipo_pregunta}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500">
              <option value="">Seleccione una opción</option>
              {tipoPregunta.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Ingreso */}
          <div className="flex items-center gap-2">
            <label htmlFor="ingreso" className="text-sm font-medium text-gray-700">
              Ingreso
            </label>
            <input type="text" name="ingreso" id="ingreso" required onChange={handleInputChange} value={formData.ingreso}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"/>
          </div>

          {/* Botón */}
          <div>
            <button type="submit" disabled={loading} className={`px-4 py-2 rounded text-white shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Cargando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>

      {loading && <Loader />}
      {error && <p>Error: {error.message || 'Ocurrió un error desconocido.'}</p>}
      <table className="w-full text-xs uppercase min-w-full border border-collapse border-gray-300">
        <thead>
          <tr className="bg-blue-200 text-gray-800">
            <th className="border p-2 text-left">Grupo</th>
            <th className="border p-2 text-left">Pregunta</th>
            <th className="border p-2 text-left">Respuesta</th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((grupo) => (
              <React.Fragment key={grupo.nombre}>
                {grupo.pregunta.map((preguntaItem, preguntaIndex) => (
                  <tr key={preguntaItem.id} className="hover:bg-gray-50">
                    {preguntaIndex === 0 && (
                      <td rowSpan={grupo.pregunta.length} className="border p-1 align-top font-semibold text-sm text-gray-700 bg-gray-50">
                        {grupo.nombre}
                      </td>
                    )}
                    <td className="border p-1 text-sm">{preguntaItem.pregunta}</td>
                    <td className="border p-1 text-sm">{preguntaItem.respuesta}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border p-2 text-sm text-center text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteIndividual;
