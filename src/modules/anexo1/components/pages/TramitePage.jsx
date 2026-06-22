import { useState } from 'react';
import TramiteForm from '../forms/TramiteForm';
import TramiteTable from '../tables/TramiteTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faFileEdit, faHospitalUser, faFileMedical, faHomeUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function TramitePage() {
  const [modo, setModo] = useState('lista');
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('tokenhusjp');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const roles = Array.isArray(payload.authorities)
    ? payload.authorities
    : payload.authorities?.split(',').map(r => r.trim()) || [];

  const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

  const handleEdit = (tramite) => {
    setSelectedTramite(tramite);
    setModo('editar');
  };

  const handleCrear = () => {
    setSelectedTramite(null);
    setModo('crear');
  };

  const handleSaved = () => {
    setModo('lista');
    setSelectedTramite(null);
    setReloadFlag((prev) => prev + 1);
  };

  const handleCancelar = () => {
    setModo('lista');
    setSelectedTramite(null);
  };

  if (modo === 'editar' || modo === 'crear') {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-2">
                <FontAwesomeIcon icon={faFileEdit} className="w-8 h-8 text-black pr-2" />
                {modo === 'editar' ? 'Editar Trámite' : 'Nuevo Trámite'}
              </h1>
            </div>
            <button onClick={handleCancelar}
              className="mr-10 px-2 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600">
              ← Volver a Lista
            </button>
          </div>
          <TramiteForm tramite={selectedTramite} onSaved={handleSaved} />
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
              <FontAwesomeIcon icon={faFileEdit} className="w-8 h-8 text-black pr-2" />Gestión Trámites
            </h1>
          </div>
          {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_ANEXO1') && (<button onClick={handleCrear}
            className="hover:cursor-pointer mr-10 mt-2 lg:mt-0 px-2 py-2 bg-green-600 text-white font-semibold text-md rounded hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white pr-2" />Nuevo Trámite
          </button>)}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => navigate('/anexo1/general')}
            className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            <FontAwesomeIcon icon={faHomeUser} className="pr-1" />Inicio
          </button>
          <button onClick={() => navigate('/anexo1/tramite')}
            className="font-bold px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            <FontAwesomeIcon icon={faFileEdit} className="pr-1" />Trámite Inicial
          </button>
          <button onClick={() => navigate('/anexo1/seguimiento-intra')}
            className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            <FontAwesomeIcon icon={faHospitalUser} className="pr-1" />Seg. Intrahospitalario
          </button>
          <button onClick={() => navigate('/anexo1/seguimiento-ambulatorio')}
            className="font-bold px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            <FontAwesomeIcon icon={faFileMedical} className="pr-1" />Seg. Ambulatorio
          </button>
        </div>
        <TramiteTable onEdit={handleEdit} reloadFlag={reloadFlag} />
      </div>
    </div>
  );
}
