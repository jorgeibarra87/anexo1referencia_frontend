import { useState } from "react"
import { obtenerAdnIngresoHistoricoPorDocumento } from "../../api/dinamica/adnIngresoService"

const useFetchAdnIngresoTodos = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchAdnIngresosTodos = async (documento) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerAdnIngresoHistoricoPorDocumento(documento);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fetchAdnIngresosTodos }
}

export default useFetchAdnIngresoTodos