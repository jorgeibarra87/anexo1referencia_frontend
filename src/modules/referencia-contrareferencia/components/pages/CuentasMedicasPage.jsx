import { useState } from 'react';
import CuentasMedicasForm from '../forms/CuentasMedicasForm';
import CuentasMedicasTable from '../tables/CuentasMedicasTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookMedical, faFileEdit, faFile } from '@fortawesome/free-solid-svg-icons';

export default function CuentasMedicasPage() {
    const [modo, setModo] = useState('lista');
    const [selectedCuentas, setSelectedCuentas] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(0);
    // Lee los roles del token directamente
    const token = localStorage.getItem('tokenhusjp');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    // authorities: "ROLE_X" (string) o ["ROLE_X", "ROLE_Y"]
    const roles = Array.isArray(payload.authorities)
        ? payload.authorities
        : payload.authorities?.split(',').map(r => r.trim()) || [];

    const tieneRol = (...rolesRequeridos) => rolesRequeridos.some(rol => roles.includes(rol));

    const handleEdit = (cuentas) => {
        setSelectedCuentas(cuentas);
        setModo('editar');
    };

    const handleCrear = () => {
        setSelectedCuentas(null);
        setModo('crear');
    };

    const handleSaved = () => {
        setModo('lista');
        setSelectedCuentas(null);
        setReloadFlag(prev => prev + 1);
    };

    const handleCancelar = () => {
        setModo('lista');
        setSelectedCuentas(null);
    };

    // ✅ Modo formulario (crear / editar)
    if (modo === 'editar' || modo === 'crear') {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto">
                    <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {modo === 'editar' ? <><FontAwesomeIcon icon={faFileEdit} className="w-5 h-5 text-blue-600 mr-2" /> Editar Cuenta Médica</> : <><FontAwesomeIcon icon={faFile} className="w-5 h-5 text-green-600 mr-2" /> Nueva Cuenta Médica</>}
                                </h1>
                                {modo === 'editar' && selectedCuentas && (
                                    <p className="text-gray-600 text-sm">
                                        ID Traslado:{' '}
                                        <span className="font-semibold text-blue-600">
                                            {selectedCuentas.trasladoId}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCancelar}
                                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition-all duration-200 shadow-md"
                            >
                                ← Volver a Lista
                            </button>
                        </div>

                        {/* ✅ Props: cuentas y onSaved */}
                        <CuentasMedicasForm
                            cuentas={selectedCuentas}
                            onSaved={handleSaved}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Modo lista (tabla)
    return (
        <div className="min-h-screen bg-white">
            <div className="w-full mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl p-2 border border-gray-100 mb-2">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-1">
                                <FontAwesomeIcon icon={faBookMedical} className="w-6 h-6 text-gray-700 pr-2" />
                                Gestión Cuentas Médicas
                            </h1>
                        </div>
                        {tieneRol('ROLE_ADMINISTRADOR', 'ROLE_CUENTAS_MEDICAS_LIDER', 'ROLE_CUENTAS_MEDICAS_ASISTENTE') && (<button
                            onClick={handleCrear}
                            className="hover:cursor-pointer mr-10 mt-2 lg:mt-0 px-2 py-2 bg-green-600 text-white font-semibold text-md rounded hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 sm:w-xs lg:w-auto"
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-white pr-2" />
                            Nueva Cuenta Médica
                        </button>)}
                    </div>

                    {/* ✅ Props: onEdit y reloadFlag */}
                    <CuentasMedicasTable
                        onEdit={handleEdit}
                        reloadFlag={reloadFlag}
                    />
                </div>
            </div>
        </div>
    );
}
