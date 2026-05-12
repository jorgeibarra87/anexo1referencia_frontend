import { useState } from 'react';
import TblExamenesPaciente from './Tables/TblExamenesPaciente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TblExamenesTomados from './Tables/TblExamenesTomados';

export default function ResumenExamenesPacientes() {
  const [tab, setTab] = useState("actuales"); // actual tab

  return (
    <div className="space-y-6">

      {/* BOTONES */}
      <div className="flex space-x-1">
        <button onClick={() => setTab("actuales")} className={`px-6 py-2 rounded-l text-sm font-medium  
            ${tab === "actuales" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
          Actuales
        </button>
        <button onClick={() => setTab("tomadas")} className={`px-6 py-2 rounded-r text-sm font-medium flex items-center 
            ${tab === "tomadas" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`} >
          Tomadas
          {tab === "tomadas" && <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-white" />}
        </button>
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      {tab === "actuales" && (
        <div className="space-y-6">
          <TblExamenesPaciente tipo="muy urgentes" titulo="Pacientes con Exámenes Muy Urgentes" />
          <TblExamenesPaciente tipo="urgentes" titulo="Pacientes con Exámenes Urgentes" />
          <TblExamenesPaciente tipo="rutinarios" titulo="Pacientes con Exámenes Rutinarios" />
          <TblExamenesPaciente tipo="prioritarios" titulo="Pacientes con Exámenes Prioritarios" />
        </div>
      )}

      {tab === "tomadas" && (
        <div className="p-4 ">
          {/* Cambia este contenido por lo que necesites mostrar */}
          <TblExamenesTomados />
        </div>
      )}
    </div>
  );
}