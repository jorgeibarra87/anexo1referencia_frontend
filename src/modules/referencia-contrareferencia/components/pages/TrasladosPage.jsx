import { useState } from 'react';
import TrasladosForm from '../forms/TrasladosForm';
import TrasladosTable from '../tables/TrasladosTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTruckMedical, faFileEdit } from '@fortawesome/free-solid-svg-icons';

export default function TrasladosPage() {
    const [modo, setModo] = useState('lista'); // 'lista', 'editar', 'crear'
    const [selectedTraslado, setSelectedTraslado] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);

    // Lee los roles del token directamente
    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // authorities: "ROLE_X" (string) o ["ROLE_X", "ROLE_Y"]
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

    const handleEdit = (traslado) => {
        setSelectedTraslado(traslado);
        setModo('editar');
    };

    const handleCrear = () => {
        setSelectedTraslado(null);
        setModo('crear');
    };

    const handleSaved = () => {
        setModo('lista');
        setSelectedTraslado(null);
        setReloadFlag(prev => prev + 1);
    };

    const handleCancelar = () => {
        setModo('lista');
        setSelectedTraslado(null);
    };

    if (modo === 'editar' || modo === 'crear') {
        return (
            <div className="min-h-screen bg-white">
                <div className=" mx-auto">
                    <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-2">
                                    {modo === 'editar' ? <><FontAwesomeIcon icon={faFileEdit} className="w-8 h-8 text-blue-700 pr-2" />Editar Traslado Referencia</> : <><FontAwesomeIcon icon={faFileEdit} className="w-8 h-8 text-black pr-2" />Nuevo Traslado Referencia</>}
                                </h1>
                                {modo === 'editar' && selectedTraslado && (
                                    <p className="text-gray-600 text-lg">
                                        {selectedTraslado.nomPaciente}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCancelar}
                                className="mr-10 px-2 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                ← Volver a Lista
                            </button>
                        </div>

                        <TrasladosForm
                            traslado={selectedTraslado}
                            onSaved={handleSaved}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Modo lista (tabla)
    return (
        <div className="min-h-screen bg-white ">
            <div className="w-full mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl p-2 border border-gray-100 mb-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent m-2 mb-2">
                                <FontAwesomeIcon icon={faFileEdit} className="w-8 h-8 text-black pr-2" />Gestión Traslados Referencia
                            </h1>
                        </div>
                        {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_REFERENCIA_LIDER', 'ROLE_REFERENCIA_ASISTENTE') && (<button
                            onClick={handleCrear}
                            className="hover:cursor-pointer mr-10 mt-2 lg:mt-0 px-2 py-2 bg-green-600 text-white font-semibold text-md rounded hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 sm:w-xs lg:w-auto"
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white pr-2" />
                            Nuevo Dato
                        </button>)}
                    </div>

                    <TrasladosTable
                        onEdit={handleEdit}
                        reloadFlag={reloadFlag}
                    />
                </div>
            </div>
        </div>
    );
}
