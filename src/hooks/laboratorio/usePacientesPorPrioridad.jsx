import { useCallback, useState } from 'react'
import { obtenerPacientesConExamenes } from '../../api/dinamica/hcnSolExaService';

const usePacientesPorPrioridad = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (tipo, page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerPacientesConExamenes(tipo, page);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
}

export default usePacientesPorPrioridad