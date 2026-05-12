import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useFecthUsuarioProcServ from '../../hooks/monitorizacionHC/useFetchUsuarioProcServ';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import Error404 from '../Error404';
import AdnIngreso from '../../models/dinamica/AdnIngreso';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchIngreso = ({ fetchAdnIngreso, setAdnIngreso, adnIngreso, fetchPreguntas, setServicio, setRespuestas, fechaEvaluacion, setFechaEvaluacion }) => {
  const tiposValidos = ['medico', 'enfermeria', 'facturacion', 'rehabilitacion'];

  const [ingreso, setIngreso] = useState('');
  const { procServ, loadingUPS, error, fetchUsuaroProcServByDocumento } = useFecthUsuarioProcServ();
  const { tipo: tipoPregunta } = useParams(); // Medico, Enfermeria
  
  const statelogin = useSelector((state) => state.login);
  const [usuario] = useState(statelogin.decodeToken);

  const handleSearch = () => {
    if (ingreso.trim()) {
      fetchAdnIngreso(ingreso);
    }
  };

  useEffect(() => {
    if (procServ.length == 0) {
      fetchUsuaroProcServByDocumento(usuario.sub);
    }
  }, [procServ]);

  const handleChange = (e) => {
    setIngreso(e.target.value);
    setAdnIngreso(new AdnIngreso());
  };

  const handleSelect = (e) => {
    const { value, tipo } = e;
    setServicio({ id: value, tipo: tipo });
    fetchPreguntas(value, tipo, tipoPregunta.toUpperCase());
    setRespuestas([]); // Limpiamos las respuestas previas
  };

  if (!tiposValidos.includes(tipoPregunta.toLowerCase())) {
    return <Error404 />;
  }

  if (error) return <div className="alert alert-danger">Se presento un error al cargar los procesos y servicios del usuario</div>;

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex items-center flex-wrap gap-2">
        <label>{fechaEvaluacion === "" ? "Fecha que va a evaluar" : fechaEvaluacion}</label>
        <div className="relative border rounded mr-2">
          <div className="relative w-6 h-6">
            <input type="month" value={fechaEvaluacion} onChange={(e) => setFechaEvaluacion(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
            <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6  text-blue-600 pointer-events-none" />
          </div>
        </div>
        {
          fechaEvaluacion != "" && (
            <>
            <input type="text" value={ingreso} onChange={(e) => handleChange(e)} placeholder="ingreso"
          className="w-32 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={handleSearch} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <FontAwesomeIcon icon={faSearch} />
        </button>
            </>
          )
        }
        {adnIngreso.paciente && (
          <>
            <label className="mx-2 mb-0 text-sm font-medium text-gray-700">doc paciente:</label>
            <span className="text-sm text-gray-800">{adnIngreso.paciente.documento}</span>
            <span className="mx-2 text-sm text-gray-600">selecciona las preguntas:</span>
            <div className="min-w-[300px]">
              <Select options={procServ} onChange={handleSelect} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchIngreso;
