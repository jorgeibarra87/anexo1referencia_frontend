import { useState } from "react";
import { agragrRolesAUsuario, eliminarRolesAUsuario } from "../../api/authservice/usuarioServiceApiAuth";

const useUpdateUsuarioRoles = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUsuarioRoles = async (documento, roles, accion) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (accion === "agregar") {
                response = await agragrRolesAUsuario(documento, roles);
            } else if (accion === "eliminar") {
                response = await eliminarRolesAUsuario(documento, roles);
            } else {
                throw new Error("Acción no válida. Use 'agregar' o 'eliminar'.");
            }
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, updateUsuarioRoles };
}

export default useUpdateUsuarioRoles;