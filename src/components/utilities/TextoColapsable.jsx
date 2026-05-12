import { useState } from "react";

const TextoColapsable = ({ texto, limite = 120 }) => {
  const [expandido, setExpandido] = useState(false);

  if (!texto) return <span className="text-gray-500 italic">Sin texto</span>;

  const esLargo = texto.length > limite;

  const handleToggle = () => setExpandido(!expandido);

  return (
    <span className="whitespace-pre-wrap">
      {esLargo && !expandido ? (
        <>
          {texto.substring(0, limite)}{" "}
          <button onClick={handleToggle} className="text-blue-600 font-semibold hover:underline focus:outline-none">... ver más </button>
        </>
      ) : esLargo && expandido ? (
        <>
          {texto}{" "}
          <button onClick={handleToggle} className="text-blue-600 font-semibold hover:underline focus:outline-none" > ver menos </button>
        </>
      ) : (
        texto
      )}
    </span>
  );
};

export default TextoColapsable;
