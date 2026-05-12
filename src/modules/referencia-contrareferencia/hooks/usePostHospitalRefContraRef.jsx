import { useState } from "react";
import { agregarHospitalReferencia } from "../../referencia-contrareferencia/api/hospitalesReferenciaService";

const usePostHospitalRefContraRef = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const guardarHospitalRefContraRef = async (hospitalData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await agregarHospitalReferencia(hospitalData);
            setData(response);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    };
  return { data, loading, error, guardarHospitalRefContraRef };

}

export default usePostHospitalRefContraRef