import { useCallback, useEffect, useState } from "react";
import { obtenerTamizajes } from "../../api/dinamica/nutricionService";
import { obtenerEvaluacionesTamizajes } from "../../api/nutricion/tamizajeService";

export const useGetTamizaje = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingresoIds, setIngresoIds] = useState([]);

  // tomamos los tamizajes de dinamica, y luego obtenermos la evaluacion de los tamizajes,
  // funsionamos los datos de tamizajes y evaluaciones y retormamos el resultado
  useEffect(() => {
    if(ingresoIds.length == 0) return;
    const obtenerEvaluaciones = async () => {
      setError(null);
      try {
        const response = await obtenerEvaluacionesTamizajes(ingresoIds);
        const camposAReemplazar = ["firstValue", "evaluationDate", "secondValue", "close", "userName"];
        const updatedData = data.map(item => {
          const matching = response.find(r => r.incomeId === item.incomeId);
          if (!matching) return item;

          // Solo reemplaza los campos deseados
          const updatedFields = camposAReemplazar.reduce((acc, campo) => {
            acc[campo] = matching[campo];
            return acc;
          }, {});
          return { ...item, ...updatedFields };
        });
        setData(updatedData);
      } catch (error) {
        setError(error);
      }
    };
    obtenerEvaluaciones();
  }, [ingresoIds]);

  const getTamizaje = useCallback(async (obj) => {
    setLoading(true);
    setData(null);
    setError(null);
    const params = new URLSearchParams(obj).toString();
    try {
      const response = await obtenerTamizajes(params);
      setData(response);
      setIngresoIds(response.map(item => item.incomeId));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []
  );

  return { getTamizaje, data, loading, error };
};