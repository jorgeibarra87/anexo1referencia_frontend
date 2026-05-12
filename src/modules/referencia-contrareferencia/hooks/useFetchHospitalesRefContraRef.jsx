import { useEffect, useState } from 'react'
import { obtenerHospitalesReferencia } from '../../referencia-contrareferencia/api/hospitalesReferenciaService'

const useFetchHospitalesRefContraRef = () => {
  const [hospitales, setHospitales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHospitales = async () => {
      try {
        const data = await obtenerHospitalesReferencia();
        setHospitales(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchHospitales()
  }, [])

  return { hospitales, loading, error }
}

export default useFetchHospitalesRefContraRef