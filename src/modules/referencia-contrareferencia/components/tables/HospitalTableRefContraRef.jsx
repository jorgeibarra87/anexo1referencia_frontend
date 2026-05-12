import { useState } from "react";
import useFetchHospitalesRefContraRef from "../../hooks/useFetchHospitalesRefContraRef";
import Loader from "../../../../components/Loader";
import FormHospitalRefContraRef from "../forms/FormHospitalRefContraRef";
import { Link } from "react-router-dom";

const HospitalTableRefContraRef = () => {

    const { hospitales, loading: loadingHosp, error: errorHosp } = useFetchHospitalesRefContraRef();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const ALTURA_FIJA_ELEMENTOS = 250; // Ajusta este valor según el espacio ocupado por otros elementos fijos en la pantalla

    if (loadingHosp) return <Loader />;
    if (errorHosp) return <div className="text-red-500">Error al cargar los hospitales: {errorHosp.message}</div>;

    if (mostrarFormulario) {
        return ( <FormHospitalRefContraRef  onClose={() => setMostrarFormulario(false)} />);
    }

    return (
        <>
        <div className="container bg-white mx-auto p-4 ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Hospitales registrados</h2>
                <button onClick={() => setMostrarFormulario(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar Hospital</button>
                <Link to="/referenciacontrareferencia/formulario" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">volver</Link>
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg pb-4">
                <div className={`overflow-y-auto`} style={{ maxHeight: `calc(100vh - ${ALTURA_FIJA_ELEMENTOS})` }}>
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-6 py-3">NOMBRE</th>
                                <th scope="col" className="px-6 py-3">UBICACIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitales.map((d, index) =>
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 text-xs">{d.nombre}</td>
                                    <td className="px-6 py-2 text-xs">{d.ciudad}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}

export default HospitalTableRefContraRef