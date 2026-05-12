import { faCheckCircle, faCog, faExchangeAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetchAdnIngresoTodos from "../../../../hooks/dinamica/useFetchAdnIngresoTodos";
import useFetchHospitalesRefContraRef from "../../hooks/useFetchHospitalesRefContraRef";
import Loader from "../../../../components/Loader";
import Select from 'react-select';
import usePostDatosRefContraRef from "../../hooks/usePostDatosRefContraRef";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ModalDataRefContraRef from "./ModalDataRefContraRef";
import { buscarDatosPorIdODocumento } from "../../api/datosReferenciaService";
import useFetchInfoPacienteRef from "../../hooks/useFetchInfoPacienteRef";

export default function FormDatos() {

  const [showModal, setShowModal] = useState(false); // modal para mostrar datos obtenidos por un documento 
  const [documentData, setDocumentData] = useState(null); // datos obtenidos en la busqueda por documento
  const { hospitales, loading: loadingHosp, error: errorHosp } = useFetchHospitalesRefContraRef();
  const { data: dataAdnIngresos, loading: loadingAdnIngresos, error: errorAdnIngresos, fetchAdnIngresosTodos } = useFetchAdnIngresoTodos();
  const { data: dataReferencia, loading: loadingRef, error: errorRef, postDatosRefContraRef } = usePostDatosRefContraRef();
  const {infoPaciente, fetchInformacionPaciente} = useFetchInfoPacienteRef();
  // Clave para forzar la re-renderización del select de sexo cuando cambia infoPaciente
  const formKey = infoPaciente?.id || 'default';

  useEffect(() => {
    if (!dataReferencia) return;
    toast.success('Datos de referencia guardados con éxito!')
  }, [dataReferencia])

  useEffect(() => {
    if (errorAdnIngresos) {
      toast.error('Error al consultar los ingresos en dinamica');
    }
  }, [errorAdnIngresos]);

  if (loadingHosp || loadingAdnIngresos || loadingRef) return <Loader />;
  if (errorHosp) return <div>Error: {errorHosp.message}</div>;
  if (errorRef) return <div>Error: {errorRef.message}</div>;

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    fetchAdnIngresosTodos(data.identificacion);

    // ESTOS DATOS PUEDEN ESTAR VACIOS Y SU VALOR POR DEFECTO DEBE SER "SIN DATO", PERO NO PUEDEN PASAR VACIOS AL BACK
    const datosVacios = ["fc", "fr", "ta", "temperatura", "sodos", "glasgow"];
    datosVacios.forEach(campo => {
      if (!data[campo]) {
        data[campo] = "SIN DATO";
      }
    });

    if (dataAdnIngresos && dataAdnIngresos.length > 0) {
      data.ingresos = dataAdnIngresos.map(ingreso => ({ fechaIngreso: ingreso.ainFecIng }));
    }
    // Validar el formulario antes de enviarlo
    if (!validateForm(data)) {
      return; // Si la validación falla, no se envía el formulario
    }
    
    postDatosRefContraRef(data);
    event.target.reset(); // Reinicia el formulario después de enviarlo
  };

  const validateForm = (dataForm) => {
    // Validar que los campos obligatorios no estén vacíos
    const requiredFields = ["identificacion", "nombres", "apellidos", "edad", "sexo", "entidadSocial", "hospital_id", "medicoSolicitanteRemision", "especialidadSolicitanteRemision", "diagnosticoRemision", "observaciones", "nombrePersonaRecibeComentario", "requiereAislamiento", "enviadaUrgenciaVital", "estado", "causaRemisionNivelLLL", "nombreMedicoRegistraDecision"];
    for (let field of requiredFields) {
      if (!dataForm[field]) {
        toast.error(`El campo ${field} es obligatorio.`);
        return false;
      }
      // validar que la edad esté entre 0 y 120
      if (field === "edad") {
        const edad = parseInt(dataForm[field], 10);
        if (isNaN(edad) || edad < 0 || edad > 120) {
          toast.error('La edad debe estar entre 0 y 120 años.');
          return false;
        }
      }
    }
    return true;
  }

  const handleSearchDocumento = async () => {
    fetchInformacionPaciente(document.getElementById("ident").value);
    const response = await buscarDatosPorIdODocumento(document.getElementById("ident").value);
    if (response && response.length > 0) {
      setDocumentData(response);
      setShowModal(true);
    } else {
      toast.info('No se encontraron datos para el documento ingresado.');
    }
  }

  return (
    <>
      {showModal && <ModalDataRefContraRef handleClose={() => setShowModal(false)} data={documentData} />}
      <form id="formreferencia" onSubmit={handleSubmit}>
        {/* Tarjeta de Datos Personales */}
        <div className="flex-grow py-2">
          <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                Datos Personales
              </h3>
              <div className="flex-shrink-0">
                <button type="button" className="text-white hover:text-gray-200">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Identificación:</label>
                  <div className="flex items-center">
                    <input type="text" id="ident" name="identificacion"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="123456789" required />
                    <button type="button" onClick={handleSearchDocumento} className="flex-shrink-0 text-blue-500 hover:text-blue-700 ml-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                    </button>
                  </div>

                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Hospital:</label>
                  <div className="flex items-center">
                    <Select name="hospital_id" options={hospitales.map(hospital => ({ value: hospital.id, label: hospital.nombre, ciudad: hospital.ciudad }))} menuPortalTarget={document.body}
                      formatOptionLabel={(option) => (
                        <div>
                          <span className="font-medium text-gray-900">{option.label}</span>
                          <span className="text-xs text-gray-500 ml-2">({option.ciudad})</span>
                        </div>
                      )}
                      className="w-11/12" />
                    <Link to="/referenciacontrareferencia/hospitales" className="flex-shrink-0 text-gray-500 hover:text-gray-700 ml-2">
                      <FontAwesomeIcon icon={faCog} className="text-2xl" />
                    </Link>
                  </div>

                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Entidad de seguridad social:</label>
                  <input name="entidadSocial" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombres:</label>
                  <input name="nombres" defaultValue={infoPaciente?.nombres || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Apellidos:</label>
                  <input name="apellidos" defaultValue={infoPaciente?.apellidos || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Nombre médico que solicita la remisión</label>
                  <input name="medicoSolicitanteRemision" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Edad:</label>
                  <input name="edad" min={0} max={120} defaultValue={infoPaciente?.edad || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" required />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Sexo:</label>
                  <select name="sexo" key={formKey} defaultValue={infoPaciente?.genero || ''} className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value="">Elija una opción</option>
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMENINO">FEMENINO</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Información remisión */}
        <div className="flex-grow  py-2">
          <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />Información remisión:
              </h3>
              <div className="flex-shrink-0">
                <button type="button" className="text-white hover:text-gray-200">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Especialidad:</label>
                  <input name="especialidadSolicitanteRemision" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Diagnóstico:</label>
                  <input name="diagnosticoRemision" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>
                <div className="w-full md:w-1/3 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones:</label>
                  <input name="observaciones" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Nombre quien recibe comentario en referencia:</label>
                  <input name="nombrePersonaRecibeComentario" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Signos Vitales */}
        <div className="flex-grow  py-2">
          <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />Signos Vitales:
              </h3>
              <div className="flex-shrink-0">
                <button type="button" className="text-white hover:text-gray-200">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">FC:</label>
                  <input name="fc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">FR:</label>
                  <input name="fr" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">TA:</label>
                  <input name="ta" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Temperatura:</label>
                  <input name="temperatura" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">SO2</label>
                  <input name="sodos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Glasgow:</label>
                  <input name="glasgow" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="SIN DATO" />
                </div>
                <div className="w-full md:w-1/3 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Escala de dolor visual /10:</label>
                  <select name="escalaDolorVisual" className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {[...Array(11).keys()].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Opciones */}
        <div className="flex-grow py-2">
          <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />Opciones:
              </h3>
              <div className="flex-shrink-0">
                <button type="button" className="text-white hover:text-gray-200">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Requiere aislamiento:</label>
                  <select name="requiereAislamiento" className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value={null}>Elija una opción</option>
                    <option value={true}>SI</option>
                    <option value={false}>NO</option>
                  </select>
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Enviada como urgencia vital:</label>
                  <select name="enviadaUrgenciaVital" className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value={null}>Elija una opción</option>
                    <option value={true}>SI</option>
                    <option value={false}>NO</option>
                  </select>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Aceptada / Rechazada:</label>
                  <select name="estado" className="form-select bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                    <option value={null}>Elija una opción</option>
                    <option value={true}>ACEPTADA</option>
                    <option value={false}>RECHAZADA</option>
                  </select>
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Causa de rechazo:</label>
                  <input name="causaRechazo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" />
                </div>
                <div className="w-full md:w-1/3 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre médico que registra la desición:</label>
                  <input name="nombreMedicoRegistraDecision" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                  <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Causa de remisión a nivel lll:</label>
                  <input name="causaRemisionNivelLLL" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" required />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300">
            Guardar
          </button>
          <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300 ml-4">
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
