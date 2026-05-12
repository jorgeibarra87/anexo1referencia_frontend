import { useState } from 'react'
import { cambiarEstadoIpsPorSipCodigo } from '../../api/dinamica/GenSerIpsService';

function GenSerRipsCambioSipEstado() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Estado para manejar errores

    const cambiarEstado = async () => {
        if (!inputValue) return;
        
        setLoading(true);
        setError(null); // Limpiamos errores previos antes de iniciar
        setResponse(null); // Limpiamos respuesta previa

        try {
            const data = await cambiarEstadoIpsPorSipCodigo(inputValue);
            setResponse(data);
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            setError(err.response?.data?.mensaje || err.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        // Al escribir, limpiamos tanto la respuesta como el error
        if (response) setResponse(null);
        if (error) setError(null);
    };

    return (
        <div className="p-8">
            <div className="flex gap-2 mb-4">
                <input type="text"  value={inputValue}  onChange={handleInputChange}  placeholder="Ingresa un sipCodigo" 
                    className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
                <button onClick={cambiarEstado} disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-blue-900'} text-white px-4 py-2 rounded transition-all active:scale-95`}>
                    {loading ? 'Cargando...' : 'Cambiar Estado'}
                </button>
            </div>

            {/* Renderizado de Error */}
            {error && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded mb-4 text-red-700">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Renderizado de Respuesta Exitosa */}
            {response && (
                <div className="border p-4 rounded shadow-sm bg-white">
                    <p className="mb-2 text-gray-700"><strong>SipCodigo:</strong> {response.sipcodigo}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-bold">Estado:</span>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                            response.sipestado === true 
                                ? 'bg-green-600' // Verde si es activo
                                : 'bg-gray-700'  // Gris oscuro si es inactivo
                        }`}>
                            {response.sipestado === true ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GenSerRipsCambioSipEstado