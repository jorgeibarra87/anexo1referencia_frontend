import { useEffect, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import useFetchInfoContactoGenUsuario from '../../hooks/dinamica/useFetchInfoContactoGenUsuario';
import Loader from '../Loader';
import { toast } from 'react-toastify';
import FormDatosPersonales from './FormDatosPersonales';

export default function FormSolDocumento() {
    
  const { data, loading, error: errorDataContacGenusuario, fetchInfoContactoGenUsuario } = useFetchInfoContactoGenUsuario();

  const [documento, setDocumento] = useState('');

  useEffect(() => {
    document.title = 'Restablecer contraseña';
  }, []);

  // manejo error al obtener información de contacto
  useEffect(() => {
    if (!errorDataContacGenusuario) return;
    if (errorDataContacGenusuario.response.data.codigoError == 'GC-0003') {
      toast.error('No se encontró el usuario');
    } else {
      toast.error('Se presento un error, revisar logs.');
    }
  }, [errorDataContacGenusuario]);

  // buscar información de contacto
  const handleSubmitDocumento = (e) => {
    e.preventDefault();
    if (documento == '' || !documento || documento.trim() == '' || documento.length <= 4) {
      toast.error('Por favor, ingrese un número de documento.');
      return;
    }
    fetchInfoContactoGenUsuario(documento);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!data && (
        <div className="bg-white rounded-lg shadow-lg w-[33rem]">
          <img src={imgLogoDinamica} className="w-full rounded-t-lg" alt="..." />
          <div className="bg-gray-100 text-center p-6">
            <form onSubmit={handleSubmitDocumento} id="formulario">
              <h5 className="text-lg font-semibold mt-5">Restablecer la contraseña</h5>
              <div className="w-1/2 mx-auto">
                <input className="form-input mt-4 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                  placeholder="Ingrese número de documento" onChange={(e) => setDocumento(e.target.value)} />
              </div>
            </form>
            <div className="flex justify-around mt-4 mb-4">
              <div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" type="submit" form="formulario">
                  Solicitar cambio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {data && <FormDatosPersonales datoscontacto={data} />}
    </div>
  );
}
