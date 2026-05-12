import { useState } from 'react';
import GraficasPorcentajes from './GraficasPorcentajes';
import ReporteIndividual from './ReporteIndividual';
import useFetchProcesoServicioConPreguntas from '../../hooks/monitorizacionHC/useFetchProcesoServicioConPreguntas';
import Loader from '../Loader';

function ReportesIndex() {
  const [activeTab, setActiveTab] = useState('opcion1');
  const { procesosServicios, loadingPs: loadingProServ, error: errorProServ } = useFetchProcesoServicioConPreguntas();

  if (loadingProServ) return <Loader />;
  if (errorProServ) return <div className="alert alert-danger">Error al cargar los procesos y servicios: {errorProServ.message}</div>;

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab('opcion1')}
          className={`px-4 py-2 rounded text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            activeTab === 'opcion1' ? 'bg-blue-600 focus:ring-blue-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
          }`}>
          Reporte General
        </button>
        <button onClick={() => setActiveTab('opcion2')}
          className={`px-4 py-2 rounded text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            activeTab === 'opcion2' ? 'bg-green-600 focus:ring-green-500' : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
          }`}>
          Reporte Individual
        </button>
      </div>

      {activeTab === 'opcion1' && (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <GraficasPorcentajes procesosServicios={procesosServicios} />
        </div>
      )}
      {activeTab === 'opcion2' && (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <ReporteIndividual procesosServicios={procesosServicios} />
        </div>
      )}
    </div>
  );
}

export default ReportesIndex;
