import { useState } from 'react';

export default function Peticion() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState(null);

    const cambiarEstado = async () => {
        // petición simulada
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = {
            ingreso: inputValue,
            estado: 'Procesado correctamente'
        };
        setResponse(data);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value === '') setResponse(null);
    };

    return (
        <div className="p-8">
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ingresa un valor"
                    className="border px-3 py-2 rounded"
                />
                <button
                    onClick={cambiarEstado}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Enviar
                </button>
            </div>

            {response && (
                <div className="border p-4 rounded">
                    <p>Ingreso: {response.ingreso}</p>
                    <p>Estado: {response.estado}</p>
                </div>
            )}
        </div>
    );
}