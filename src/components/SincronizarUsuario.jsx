/** Este componente se encarga de sicronizar unicamente al usuario con el authentication-service
 * solo sincroniza documento, NO SINCRONIZA ROLES
 */
import useSaveUsuarioAuthSer from '../hooks/authService/useSaveUsuario';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from './Loader';

function SincronizarUsuario({ show, handleClose, documento = "" }) {

  const { saveUsuario: saveUsuarioAuht, loading, error, response: responseUsuAuth } = useSaveUsuarioAuthSer();
  const [inputDoc, setInputDoc] = useState(documento);

  useEffect(() => {
    setInputDoc(documento);
  }, [documento]);

  // Efecto para manejar la respuesta de la sincronización del usuario
  // Si la respuesta es exitosa, muestra un mensaje de éxito y cierra el modal
  useEffect(() => {
    if (!responseUsuAuth) return;
    toast.success("!Se sincronizó correctamente el usuario!");
    setInputDoc(""); // Limpia el campo de entrada
    //setTimeout(handleClose, 1000); // Cierra el modal después de 1.5 segundos
    handleClose();
  }, [responseUsuAuth])

  // Efecto para limpiar el campo de entrada cuando se cierra el modal
  // Esto asegura que el campo esté vacío la próxima vez que se abra el modal
  useEffect(() => {
    if (!show) setInputDoc("");
  }, [show]);

  // Maneja el cambio en el campo de entrada del documento
  const handleChange = (e) => {
    const { value } = e.target;
    setInputDoc(value);
  }

  // Maneja el estado del error 
  useEffect(() => {
    if (error) {
      if (error.response?.data?.mensaje) { // si trae algun mensaje de error personalizado desde el backend
        toast.error(error.response.data.mensaje);
      } else {
        toast.error("Ocurrió un error al sincronizar el usuario");
      }
    }
  }, [error]);

  // Maneja el envío del formulario
  // Verifica que el campo de documento no esté vacío antes de llamar a la función de 
  // sincronización del usuario
  // Si el campo está vacío, muestra un mensaje de error
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputDoc === "") {
      toast.error("Debe ingresar un número de documento");
      return;
    }
    saveUsuarioAuht(inputDoc);
  }

  return (
    <div onClick={handleClose} className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-sm relative" >
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-800">Sincronizar usuario</span>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <div className="relative flex items-stretch w-full mb-3">
                <input type="text" id="documento" value={inputDoc} placeholder="Ingrese el número de documento" onChange={handleChange} className="relative w-full px-3 py-2 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button type="submit" disabled={loading} className="flex-shrink-0 px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <Loader />
                      <span className="ml-2">Sincronizando...</span>
                    </>
                  ) : (
                    "Sincronizar"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SincronizarUsuario