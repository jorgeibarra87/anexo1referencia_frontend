import { useState, useRef, useEffect } from "react";
import { TableIcon } from "../../icons";

export const DropdownTableCols = ({ tableColums, handleChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  // Cierra al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    { key: "age", label: "Edad" },
    { key: "gender", label: "Género" },
    { key: "service", label: "Servicio" },
    { key: "bethCode", label: "Cama" },
    { key: "income", label: "Ingreso" },
  ];

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Botón toggle */}
      <button type="button" onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center px-2 py-1 border rounded bg-white hover:bg-gray-100" >
        <TableIcon size={20} />
      </button>

      {/* Menú dropdown */}
      {open && (
        <div className="absolute mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {items.map((item) => (
              <label key={item.key} className="flex items-center px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100" >
                <input type="checkbox" checked={tableColums[item.key]} onChange={(e) => handleChange(e.target.checked, item.key)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};