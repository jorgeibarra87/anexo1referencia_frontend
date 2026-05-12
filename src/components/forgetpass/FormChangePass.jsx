import { useEffect, useRef, useState } from 'react';
import imgLogoDinamica from '../../img/logo-dg.png';
import { usePutChangePassword } from '../../hooks/sistemas/usePutChangePassword';
import { toast } from 'react-toastify';
import Loader from '../Loader';

const formInitial = {
  username: '',
  code: '',
  password: '',
  confirmPassword: '',
};

export default function FormChangePass({ datosContacto }) {
  const { loading, error, data, putChangePassword } = usePutChangePassword();

  const [form, setForm] = useState(formInitial);
  const [isInactive, setIsInactive] = useState(false);
  const [coincidencia, setCoincidencia] = useState(null);
  const [tamano, setTamano] = useState(null);
  const [disable, setDisable] = useState(false);
  const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos

  const inactivityTimerRef = useRef(null);

  // manejo de la respuesta exitosa
  useEffect(() => {
    if (data) {
      toast.success('Contraseña cambiada con éxito');
    }
  }, [data]);

  // manejo del error.
  useEffect(() => {
    if (error && error.response?.data?.codigoError == 'AAI-US-03') {
      toast.warning(error.response.data.mensaje);
    } else {
      if (error) toast.error('Error al cambiar la contraseña, revisar logs.');
    }
  }, [error]);

  // manejo de la inactividad
  useEffect(() => {
    // Configurar eventos para detectar actividad
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    // Iniciar el temporizador de inactividad
    resetInactivityTimer();
    return () => {
      // Limpiar eventos y temporizador al desmontar el componente
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // manejo del título
  useEffect(() => {
    document.title = 'Restablecer contraseña';
  }, []);

  // manejo de la inactividad
  const handleInactivity = () => {
    setIsInactive(true);
    toast.warning('Inactividad detectada. Serás redirigido debido a la inactividad.', {
      autoClose: false,
      onClose: () => {
        window.location.href = 'http://optimus/vulcano/'; // Cambiar por la URL de redirección
      },
    });
  };

  // reiniciar el temporizador de inactividad
  const resetInactivityTimer = () => {
    if (isInactive) return; // Si ya está inactivo, no reiniciar el temporizador
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(handleInactivity, INACTIVITY_TIME);
  };

  // manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    //capturamos la pre para que si valide lo actual.
    const updateFormData = { ...form, [name]: value };

    setForm(updateFormData);
    if (name === 'password' || name === 'confirmPassword') {
      if (updateFormData.password !== updateFormData.confirmPassword) {
        setCoincidencia({ message: 'Las contraseñas no coinciden' });
        setDisable(true);
      } else if (updateFormData.password === updateFormData.confirmPassword) {
        setCoincidencia(null);
        setDisable(false);
      }
      if (updateFormData.password.length < 6) {
        setTamano({ message: 'contraseña muy corta, minimo 6 caracteres' });
        setDisable(true);
      } else if (updateFormData.password.length >= 6) {
        setTamano(null);
      }
    }
  };

  // manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      username: datosContacto.usunombre,
    };
    putChangePassword(formData);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      {isInactive && (
        <div className="absolute inset-0 bg-black/50 z-[999] pointer-events-none" />
      )}
      <div className="bg-white shadow-lg rounded-xl w-[33rem]">
        <img src={imgLogoDinamica} alt="Logo" className="w-full rounded-t-xl" />
        <div className="text-center p-6 bg-gray-50 rounded-b-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h5 className="text-xl font-semibold mt-5">Restablecer la contraseña</h5>
            <div>
              <span className="text-gray-700">Se envió el código al correo:</span>
            </div>
            {tamano?.message && (<span className="text-red-600 text-sm">{tamano.message}</span>)}
            <div className="w-1/2 mx-auto">
              <input type="text" placeholder="Ingrese código de verificación" id="code" name="code" required onChange={handleChange} className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="w-1/2 mx-auto">
              <input type="password" placeholder="Ingrese nueva contraseña" id="password" name="password" required onChange={handleChange} className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="w-1/2 mx-auto">
              <input type="password" placeholder="Confirme la contraseña" id="confirmPassword" name="confirmPassword" required onChange={handleChange} className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {coincidencia?.message && (
                <span className="text-red-600 text-sm">
                  {coincidencia.message}
                </span>
              )}
            </div>
            <div className="flex justify-center mt-6 mb-4">
              <button type="submit" disabled={disable} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Cambio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}