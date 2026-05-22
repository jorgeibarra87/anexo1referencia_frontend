import { useState } from 'react';
import SeguimientoAmbulatorioForm from '../forms/SeguimientoAmbulatorioForm';
import SeguimientoAmbulatorioTable from '../tables/SeguimientoAmbulatorioTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function SeguimientoAmbulatorioPage() {
  const [modo, setModo] = useState('lista');
  const [selectedItem, setSelectedItem] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const navigate = useNavigate();

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModo('editar');
  };

  const handleCrear = () => {
    setSelectedItem(null);
    setModo('crear');
  };

  const handleSaved = () => {
    setModo('lista');
    setSelectedItem(null);
    setReloadFlag((prev) => prev + 1);
  };

  const handleCancelar = () => {
    setModo('lista');
    setSelectedItem(null);
  };

  if (modo === 'editar' || modo === 'crear') {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-2">
                <FontAwesomeIcon icon={faFileMedical} className="w-8 h-8 text-black pr-2" />
                {modo === 'editar' ? 'Editar Seguimiento' : 'Nuevo Seguimiento Ambulatorio'}
              </h1>
            </div>
            <button onClick={handleCancelar}
              className="mr-10 px-2 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600">
              ← Volver a Lista
            </button>
          </div>
          <SeguimientoAmbulatorioForm item={selectedItem} onSaved={handleSaved} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-2xl rounded-3xl p-2 border border-gray-100 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent m-2">
              <FontAwesomeIcon icon={faFileMedical} className="w-8 h-8 text-black pr-2" />Seg. Ambulatorio
            </h1>
            <button onClick={() => navigate('/anexo1/general')}
              className="ml-10 px-3 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 text-sm">
              <FontAwesomeIcon icon={faArrowLeft} className="pr-1" />Volver
            </button>
          </div>
          <button onClick={handleCrear}
            className="hover:cursor-pointer mr-10 mt-2 lg:mt-0 px-2 py-2 bg-green-600 text-white font-semibold text-md rounded hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white pr-2" />Nuevo Seguimiento
          </button>
        </div>
        <SeguimientoAmbulatorioTable onEdit={handleEdit} reloadFlag={reloadFlag} />
      </div>
    </div>
  );
}
