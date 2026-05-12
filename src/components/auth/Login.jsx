import { useState, useEffect } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { iniciarSesionAction } from "../../actions/loginActions";

import spinnerLoginText from "../Loading";

const initailForm = {username: "",password: "",};
const ruta = window.env.VITE_URL_API_GATEWAY
const rutamicroservicioauth = window.env.VITE_URL_AUTH

const Login = () => {

    const dispatch = useDispatch();
    const [datos, setDatos] = useState(initailForm);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const [showExpired, setShowExpired] = useState(false);

    useEffect(() => {
        const reason = localStorage.getItem("sessionExpiredReason");
        if (reason === "inactivity") {
            setShowExpired(true);
            localStorage.removeItem("sessionExpiredReason"); // limpiar para no repetir
        }
    }, []);

    const handleChange = (e) => {
        setDatos({...datos, [e.target.name]: e.target.value,});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!datos.username || datos.username.trim().length === 0 || !datos.password || datos.password.trim().length === 0) {
            setMessage("Campo(s) vacio(s)");
            setError("campos vacios")
            return;
        }
        spinnerLoginText("Por favor espere...");
        try{
            const token2 = await  axios.post(`${ruta}${rutamicroservicioauth}/auth/login`, datos);
            dispatch(iniciarSesionAction(token2.data));
            // Swal.close();
            //navigate('/'); // Redirige al usuario a '/'
        }catch(error){
            console.error(error);
            if (error && error.code === 'ERR_NETWORK') {
                // Swal.fire({
                //     title: "¡Error!",
                //     text: `Codigo del error: ${error.code}`,
                //     icon: "error"
                // })
            } else {
                // Swal.close();
                setError(error);
                setMessage("Verificar los datos.");
            }
        }
    };

    const showPass = () => {
        setMostrarContrasena(true);
    }
    const hidePass = () => {
        setMostrarContrasena(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200" style={{ background: "#1B244025" }}>
            <div className="w-full max-w-md">
                <div className="bg-[#1B2440] text-white rounded-lg shadow-xl p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold uppercase mb-2">Solution Husjp</h2>
                    <p className="text-gray-400 mb-8">¡Por favor ingresa tu usuario y contraseña!</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative mb-6">
                        <input 
                        type="text" 
                        id="username" 
                        className="peer w-full bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 text-lg px-2 py-1 placeholder-transparent" 
                        name="username" 
                        onChange={handleChange} 
                        value={datos.username} 
                        required 
                        placeholder="Usuario"
                        />
                        <label 
                        htmlFor="username" 
                        className="absolute left-2 -top-6 text-white text-sm transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-focus:-top-6 peer-focus:text-white peer-focus:text-sm"
                        >
                        Usuario
                        </label>
                    </div>
                    <div className="relative mb-6">
                        <div className="flex items-center">
                        <input 
                            type={mostrarContrasena ? 'text' : 'password'} 
                            id="password" 
                            className="peer w-full bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 text-lg px-2 py-1 placeholder-transparent" 
                            name="password" 
                            onChange={handleChange} 
                            value={datos.password} 
                            required 
                            placeholder="Contraseña"
                        />
                        <span 
                            className="absolute right-2 top-1 cursor-pointer" 
                            onMouseDown={showPass} 
                            onMouseUp={hidePass} 
                            onMouseLeave={hidePass}
                        >
                            {mostrarContrasena ? (
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.768 0 3.491.45 5.008 1.284M21 21L3 3" />
                            </svg>
                            )}
                        </span>
                        </div>
                        <label 
                        htmlFor="password" 
                        className="absolute left-2 -top-6 text-white text-sm transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-focus:-top-6 peer-focus:text-white peer-focus:text-sm"
                        >
                        Contraseña
                        </label>
                    </div>
                    {error && message && (
                        <div className='w-full p-4 bg-yellow-600 text-white rounded-md mb-4' role="alert">
                        <span className="font-bold">{message}</span>
                        </div>
                    )}
                    <p className="text-sm mb-4">
                        <a className="text-gray-400 hover:text-white" href="#!">¿Olvidaste tu contraseña?</a>
                    </p>
                    <button 
                        type="submit" 
                        className="w-full text-white bg-transparent border-2 border-white px-5 py-2 rounded-lg text-lg font-bold hover:bg-white hover:text-[#1B2440] transition-colors" 
                    >
                        Iniciar
                    </button>
                    </form>
                </div>
                </div>
            </div>
            {showExpired && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center">
                    <h2 className="text-lg font-bold mb-2">Sesión expirada</h2>
                    <p>Tu sesión ha caducado por inactividad. Vuelve a iniciar sesión.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowExpired(false)}>
                    Entendido
                    </button>
                </div>
                </div>
            )}
        </div>
    )
}

export default Login
