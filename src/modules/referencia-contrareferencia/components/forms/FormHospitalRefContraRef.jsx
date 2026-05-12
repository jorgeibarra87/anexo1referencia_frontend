import { useEffect } from "react";
import usePostHospitalRefContraRef from "../../hooks/usePostHospitalRefContraRef";
import Loader from "../../../../components/Loader";
import { toast } from "react-toastify";

export default function FormHospitalRefContraRef({ onClose }) {

    const { data, loading, error, guardarHospitalRefContraRef } = usePostHospitalRefContraRef();

    useEffect(() => {
        if(!data) return ;
        toast.success("Hospital de referencia agregado con éxito");
    },[data]);

    useEffect(() => {
        if(!error) return ;
        toast.error("Error al guardar el hospital de referencia: " + error.message);
    },[error]);

    if(loading) return <Loader />;
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const datos = Object.fromEntries(formData.entries());

        //validar el formulario
        if(!validateForm(e)) {
            toast.error("Por favor, complete todos los campos obligatorios.");
            return;
        }

        guardarHospitalRefContraRef(datos);
        e.target.reset();
    }

    const validateForm = (e) => {
        const validar = ["nombre", "ciudad"];
        validar.forEach(element => {
            const input = e.target[element];
            if (!input.value) {
                input.classList.add("border-red-500");
            } else {
                input.classList.remove("border-red-500");
            }
        });
        return true;
    }
    return (
        <div className="p-4">
            <button onClick={onClose} className="mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cerrar</button>
            <h2 className="text-2xl font-semibold mb-4">Agregar Nuevo Hospital</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Hospital:</label>
                    <input name="nombre" type="text" className="w-full px-3 py-2 border rounded uppercase" placeholder="Ingrese el nombre del hospital"  required/>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Ciudad:</label>
                    <input name="ciudad" type="text" className="w-full px-3 py-2 border rounded uppercase" placeholder="Ingrese la ciudad" required />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar Hospital</button>
            </form>
        </div>
    );
}
