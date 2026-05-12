import { useEffect, useState } from 'react';
import { useSolicitudRecuperacionContrasena } from '../../hooks/sistemas/useSolicitudRecuperacionContrasena';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import FormChangePass from './FormChangePass';
import PropTypes from 'prop-types';

function FormDatosPersonales({ datoscontacto }) {
  const { crearSolicitud, data, loading, error } = useSolicitudRecuperacionContrasena();

  const [inputSeleccionado, setInputSeleccionado] = useState('');
  const [showFormCambioPassword, setShowFormCambioPassword] = useState(false);

  useEffect(() => {
    if (data) {
      toast.success('Código enviado con éxito');
    }
  }, [data]);

  const handleSubmitDatosContacto = async (e) => {
    e.preventDefault();
    if (!inputSeleccionado) {
      toast.warning('Por favor, seleccione una opción para recibir el código.');
      return;
    }
    if (inputSeleccionado === 'email') {
      crearSolicitud(datoscontacto.usunombre);
    }
    if (inputSeleccionado === 'movil') {
      // El segundo parámetro true indica que es por móvil
    }
  };

  if (loading) return <Loader />;

  if (showFormCambioPassword || data) {
    return <FormChangePass datosContacto={datoscontacto} />;
  }

  if (error && error?.response?.data?.codigoError == 'ERR002') {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg w-[33rem]">
            <div className="bg-gray-100 text-center p-6">
              <form id="solicitud">
                <h5 className="text-lg font-semibold mt-5">Tienes un código de verificación enviado</h5>
                <div className="w-1/2 mx-auto">
                  <span>Verifica el código en tu correo electrónico o teléfono móvil.</span>
                </div>
              </form>
              <div className="flex justify-around mt-4 mb-4">
                <div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" type="button" onClick={() => setShowFormCambioPassword(true)}>
                    Usar código
                  </button>
                </div>
                <div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" type="button" onClick={() => crearSolicitud(datoscontacto.usunombre, true)}>
                    Solicitar nuevo código
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg w-[33rem]">
        <div className="bg-gray-100 text-center p-6">
          <form id="formulario" onSubmit={handleSubmitDatosContacto}>
            <h5 className="text-lg font-semibold mt-5">Restablecer la contraseña</h5>
            <div className="w-1/2 mx-auto">
              {datoscontacto.usuemail && (
                <>
                  <input type="radio" id="email" name="opciones" value="email" checked={inputSeleccionado === 'email'} onChange={() => setInputSeleccionado('email')} />
                  <label htmlFor="email">{datoscontacto.usuemail}</label> <br />
                </>
              )}
              {datoscontacto.gmemovil && (
                <>
                  <input type="radio" id="movil" name="opciones" value="movil" checked={inputSeleccionado === 'movil'} onChange={() => setInputSeleccionado('movil')} />
                  <label htmlFor="movil">{datoscontacto.gmemovil}</label>
                </>
              )}
            </div>
          </form>
          <div className="flex justify-around mt-4 mb-4">
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" type="submit" form="formulario">
                Solicitar codigo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FormDatosPersonales.propTypes = {
    datoscontacto: PropTypes.shape({
        usunombre: PropTypes.string.isRequired,
        usuemail: PropTypes.string,
        gmemovil: PropTypes.string,
    })
}

export default FormDatosPersonales;
