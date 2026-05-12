import { Link } from "react-router-dom"

const Error404 = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    La pagina que estas buscando no existe.
                </p>
                <Link to='/' className="btn btn-primary"> Volver al Inicio</Link>
            </div>
        </div>
    )
}

export default Error404
