import { useEffect, useState } from "react";
import { useEvalueteSecond } from "../../hooks/tamizaje/useEvalueteSecond";

export const ModalFinish = ({ isOpen, checksArr, onClose, refetch, clearChecks }) => {
  const { fetchFinalizarTamizaje, data, error, loading } = useEvalueteSecond();
  const [selectValue, setSelectValue] = useState("REEVALUAR SEMANALMENTE");

  useEffect(() => {
    if (error) console.error("error", error);
  }, [error]);

  useEffect(() => {
    if (!data) return;
    onClose();
    refetch();
    clearChecks();
  }, [data]);

  const handleEvaluete = () => {
    if (checksArr.some((inf) => inf.incomeId == null)) return;
    fetchFinalizarTamizaje({
      status: selectValue,
      arrPatients: checksArr.map((inf) => ({
        incomeId: inf.incomeId,
      })),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop con opacidad */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h5 className="text-lg font-medium">Finalizar tamizaje</h5>
          <button
            onClick={onClose}
            className="text-2xl font-light text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-2 text-sm font-medium">
            Finalizar ({checksArr.length}) tamizaje
            {checksArr.length > 1 ? "s" : ""}
          </div>

          <div className="mb-4 max-h-48 overflow-y-auto border rounded">
            <ul>
              {checksArr.map((inf, idx) => (
                <li
                  key={inf.id}
                  className={`px-4 py-2 flex justify-between text-sm ${
                    idx < checksArr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span>{inf.patient}</span>
                  <span className="text-xs text-gray-700">{inf.valueNut}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Seleccione valor
            </label>
            <select
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="REEVALUAR SEMANALMENTE">
                REEVALUAR SEMANALMENTE
              </option>
              <option value="REALIZAR INTERVENCION NUTRICIONAL">
                REALIZAR INTERVENCION NUTRICIONAL
              </option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded bg-white text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleEvaluete}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded text-white ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
