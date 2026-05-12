import React, { useState } from "react";

const ListaColapsable = ({ items = [],  limite = 3,  renderItem // función opcional para renderizar cada item 
}) => {

  const [expandido, setExpandido] = useState(false);

  if (!items || items.length === 0) { return <span className="text-gray-500 italic">Sin elementos</span>; }

  const esLarga = items.length > limite;
  const visibles = expandido ? items : items.slice(0, limite);


  return (
    <div className="whitespace-pre-wrap">
      <ul className="space-y-1">
        {visibles.map((item, idx) => (
          <li key={idx}>
            {renderItem ? renderItem(item, idx) : item}
          </li>
        ))}
      </ul>

      {esLarga && (
        <button onClick={() => setExpandido(!expandido)} className="text-blue-600 text-xs font-semibold hover:underline focus:outline-none mt-1" >
          {expandido ? "ver menos" : "... ver más"}
        </button>
      )}
    </div>
  );
};

export default ListaColapsable;
