import axios from "axios";
import { useEffect, useState } from "react";
import { RUTA_BACK_PRODUCCION } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { innoProducNoData, innoProducObtener } from "../../actions/innproducActions";

const initialForm = {
    oid: "",
    iprcodigo: "",
    iprdescor: "",//descripcion
    iprcostpe: "",//costo del producto
    iprulcope: "" //ultimo costo
}

function UpdateInnProduc() {
    const [form, setForm] = useState(initialForm);
    const stateLogin = useSelector(state => state.login);
    const stateInnproduc = useSelector(state => state.innproduc);
    const dispatch = useDispatch();
    const token = stateLogin.token;

    const axiosInstance = axios.create({
        baseURL: `${RUTA_BACK_PRODUCCION}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    useEffect(() => {
        setForm(stateInnproduc.innproduc);
    }
    , [stateInnproduc]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'iprcodigo'){
            dispatch(innoProducNoData());//limpia el fomulario
        }
        if (name === 'iprcostpe' || name === 'iprulcope') {
            const newValue = value.replace(/[^0-9]/g, '');
            setForm({
                ...form, [name]: newValue
            });
        }else {
            setForm({
                ...form, [name]: value
            });
        }
    };

    const buscarPorCodigo = async () => {
        if (!form.iprcodigo || form.iprcodigo.trim().length === 0) {
            alert("El codigo no puede ser vacio");
            return;
        }
        axiosInstance.get(`${RUTA_BACK_PRODUCCION}dinamica/api/innProduc/${form.iprcodigo}`)
            .then((response) => {
                dispatch(innoProducObtener(response.data));
            }).catch((error) => {
                console.error(error)
            })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axiosInstance.put(`${RUTA_BACK_PRODUCCION}dinamica/api/innProduc`, form)
        .then(() =>{
            alert("se actualizo corectamente");
            dispatch(innoProducNoData());//limpia el fomulario
        }).catch((err) =>{
            console.err('error',err)
        })
    };

    // Función para formatear visualmente el número con separadores de miles
    const formatearNumeroVisualmente = (numero) => {
        return '$ ' + numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actualizar valores</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center space-x-2">
            <label htmlFor="iprcodigo" className="text-sm font-medium text-gray-700 w-20">Código:</label>
            <div className="flex-grow flex items-center space-x-2">
                <input type="text" id="iprcodigo" name="iprcodigo" placeholder="Código" 
                className="flex-grow text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                onChange={handleChange} value={form.iprcodigo} required />
                <button type="button" className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                onClick={buscarPorCodigo} >
                Buscar
                </button>
            </div>
            </div>
            <div className="flex items-center space-x-2">
            <label htmlFor="iprdescor" className="text-sm font-medium text-gray-700 w-20">Descripción:</label>
            <input type="text" id="iprdescor" name="iprdescor" placeholder="Descripción" 
                className="flex-grow text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                onChange={handleChange} value={form.iprdescor} required />
            </div>
            <div className="flex items-center space-x-2">
            <label htmlFor="iprcostpe" className="text-sm font-medium text-gray-700 w-20">Costo:</label>
            <input type="text" id="iprcostpe" name="iprcostpe" placeholder="Costo" 
                className="flex-grow text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                onChange={handleChange} value={formatearNumeroVisualmente(form.iprcostpe)} required />
            </div>
            <div className="flex items-center space-x-2">
            <label htmlFor="iprulcope" className="text-sm font-medium text-gray-700 w-20">Último costo:</label>
            <input type="text" id="iprulcope" name="iprulcope" placeholder="Último costo" 
                className="flex-grow text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                onChange={handleChange} value={formatearNumeroVisualmente(form.iprulcope)} required />
            </div>
            <button type="submit" className="w-full text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Actualizar
            </button>
        </form>
        </>
    )
}

export default UpdateInnProduc