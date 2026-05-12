import { useEffect, useState } from "react"
import { obtenerDatosPorPaginas } from "../../referencia-contrareferencia/api/datosReferenciaService";

const useFetchDatosRefContraRef = (initialPage = 0, initialSize = 100) => {
    const [data, setData] = useState(null); // Lo inicializamos a null o un objeto vacío para Pages
    const [loading, setLoading] = useState(true); // Empezamos como cargando
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [size, setSize] = useState(initialSize);

    // Función principal de fetching
    const fetchDatos = async (currentPage = page, currentSize = size) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerDatosPorPaginas(currentPage, currentSize);
            setData(response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    
    // se ejecutar el fetch al montar o cuando cambien page/size
    useEffect(() => {
        fetchDatos(page, size);
    }, [page, size]); // Dependencias: se vuelve a cargar si la página o el tamaño cambian

    return { data, setData, loading, error, page, size,
        setPage, // Función para cambiar la página (útil para la paginación)
        setSize, // Función para cambiar el tamaño
        refetch: fetchDatos // Provee una función para recargar manualmente
    };
};

export default useFetchDatosRefContraRef;