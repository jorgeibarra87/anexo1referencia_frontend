import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom"

const RequireAuth = ({ isLogged, loading, children }) => {
    if (loading) {
        // Muestra un indicador de carga mientras se verifica la autenticación
        return <div>Cargando...</div>;
    }

    if (!isLogged) {
        return <Navigate to="/login" />;
    }

    return children;
};

RequireAuth.propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired, // Asegúrate de pasar este prop
    children: PropTypes.node.isRequired,
};


export default RequireAuth
