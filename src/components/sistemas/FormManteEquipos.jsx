import React, { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import useFetchPreguntasCheqMan from '../../hooks/sistemas/useFetchPreguntasCheqMan';
import Loader from '../Loader';
import useSaveRespuestasCheqMan from '../../hooks/sistemas/useSaveRespuestasCheqMan';
import useFetchGenUsuarioInfo from '../../hooks/dinamica/useFetchGenUsuarioInfo';

export default function FormManteEquipos() {

  const { preguntas, loading: loadingPr, error: errorPr, fetchPreguntas } = useFetchPreguntasCheqMan();
  const { loading: loadingR, error: errorR, saveRespuestas } = useSaveRespuestasCheqMan();
  const { data: dataGenUsuario, loading: loadingGenUsuario, error: errorGenUsuario, fetchGenUsuarioInfo } = useFetchGenUsuarioInfo();

  const groupDataByType = (data) => {
    return data.reduce((acc, item) => {
      const { tipo } = item;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupDataByType(preguntas);

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const firmaClienteRef = useRef();
  const firmaTecnicoRef = useRef();

  const [datos, setDatos] = useState({
    placa: "",
    cliente: {
      documento: "",
      nombreCompleto: "",
    },
    firmaUsuario: "",
    firmaCliente: "",
    respuestas: {}
  });

  useEffect(() => {
    if (dataGenUsuario?.oid) {
      setDatos((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          documento: dataGenUsuario.usunombre,
          nombreCompleto: dataGenUsuario.usudescri
        }
      }));
    } else if (dataGenUsuario === null) {
      setDatos((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          documento: "",
          nombreCompleto: ""
        }
      }));
    }

  }, [dataGenUsuario]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setDatos(prev => ({
        ...prev,
        respuestas: {
          ...prev.respuestas,
          [name]: value === "true"
        }
      }));
    } else {
      if (name === "placa") {
        setDatos(prev => ({ ...prev, placa: value }));
      } else if (name === "documento") {
        setDatos(prev => ({
          ...prev,
          cliente: {
            ...prev.cliente,  // Mantenemos los otros datos del cliente
            documento: value  // Solo actualizamos el documento
          }
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const firmaUsuario = firmaClienteRef.current.toDataURL();
    const firmaCliente = firmaTecnicoRef.current.toDataURL();

    const formData = {
      ...datos,
      firmaUsuario,
      firmaCliente,
      respuestas: Object.entries(datos.respuestas).map(([id, valor]) => ({
        pregunta: { id: parseInt(id) },
        respuesta: valor
      }))
    };
    saveRespuestas(formData);
  };

  const limpiarFirma = (ref) => {
    ref.current.clear();
  }

  if (errorPr || errorR || errorGenUsuario) {
    return (
      <div className="alert alert-danger">
        <p>Error al cargar los datos: {errorPr?.message || errorR?.message || errorGenUsuario?.message}</p>
      </div>
    );
  }

  return (
    <>
      {loadingPr || loadingR ? <Loader /> : (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow space-y-6">

          <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-left">Pregunta</th>
                <th className="border px-4 py-2 text-center">Sí</th>
                <th className="border px-4 py-2 text-center">No</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((tipo) => (
                <React.Fragment key={tipo}>
                  <tr>
                    <td colSpan="3" className="font-bold text-center bg-gray-50 py-2">{tipo.toUpperCase()}</td>
                  </tr>
                  {groupedData[tipo].map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{item.pregunta}</td>
                      <td className="border px-4 py-2 text-center">
                        <input type="radio" name={`${item.id}`} value={true} onChange={handleChange} required />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <input type="radio" name={`${item.id}`} value={false} onChange={handleChange} required />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Firma del Técnico */}
          <div className="w-full mt-4">
            <h2 className="text-lg font-semibold mb-2">Firma del Técnico</h2>
            <div className="w-full max-w-md">
              <SignatureCanvas penColor="black" canvasProps={{className: "w-full h-36 border border-gray-300 rounded-md"}} ref={firmaTecnicoRef} />
            </div>

            <button type="button" onClick={() => limpiarFirma(firmaTecnicoRef)} className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md" >
              Limpiar
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4 mt-4">
            {/* Placa */}
            <div className="flex-1">
              <label className="block mb-1 font-medium">Placa</label>
              <input type="text" name="placa" onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Documento */}
            <div className="flex-1">
              <label className="block mb-1 font-medium">Documento</label>
              <input type="text" name="documento" onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Buscar */}
            <div>
              <button type="button" onClick={() => fetchGenUsuarioInfo(datos.cliente.documento)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-1" >
                Buscar
              </button>
            </div>
          </div>

          {/* Firma del Cliente */}
          <div className="w-full mt-4">
            <h2 className="text-lg font-semibold mb-2">Firma del Cliente</h2>
            <div className="w-full max-w-md">
              <SignatureCanvas penColor="black" canvasProps={{ className:"w-full h-36 border border-gray-300 rounded-md"}} ref={firmaClienteRef} />
            </div>
            <button type="button" onClick={() => limpiarFirma(firmaClienteRef)} className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md" >
              Limpiar
            </button>
          </div>

          {/* Enviar */}
          <button type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md">
            Enviar
          </button>
        </form>
      )}
    </>
  )
}
