import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { mesadeprocesos_agregar_usuario_a_area } from "../../actions/mesadeprocesosActions";
import UseAxiosInstance from "../../utilities/UseAxiosInstance";


const initialFormState = {
    idarea: "",
    documento: "",
    idProceso: "",
    idsubProceso: "",
    fechaInicio: "",
    fechaFin: "",
}

export default function UsuarioProcesoForm({ show, handleClose, areas }) {

    const axiosInstance = UseAxiosInstance();

    const [formState, setFormState] = useState(initialFormState);

    const dispatch = useDispatch();
    const stateAreasServicio = useSelector(state => state.mesadeprocesos);
    const [usuariosPorArea, setUsuariosPorArea] = useState(stateAreasServicio.areas);
    const [error, setError] = useState(null);
    const [procesos, setProcesos] = useState(null);
    const [subProcesos, setSubProcesos] = useState(null);
    const [usuarios, setUsuarios] = useState(null);
    const [showModal, setShowModal] = useState(show);
    const [stadoBoton, setStadoBoton] = useState(false);

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        setUsuariosPorArea(stateAreasServicio.areas);
    }, [stateAreasServicio]);

    const handleAreaChange = (e) => {
        setError(null);
        setProcesos(null);
        setSubProcesos(null);
        setUsuarios(null);
        if (e.target.value != "0") {
            //cargamos usuarios 
            axiosInstance.get(`servicio/usuarios/${e.target.value}`)
                .then((response) => {
                    setUsuarios(response.data);
                })
                .catch((error) => {
                    setError(error);
                    console.error('eRROR AL TRAER LOS USUARIOS',error);
                });
            //cargamos procesos
            axiosInstance.get(`procesos/${e.target.value}`)
                .then((response) => {
                    setProcesos(response.data);
                }).catch((error) => {
                    if(error.response && error.response.data && error.response.data.codigoError != undefined){
                        setError({...error, response: {...error.response, data: {...error.response.data, mensaje:  error.response.data.mensaje.split(",")[1]}}});
                    }else{
                        setError(error);
                        console.error(error);
                    }
                });
        }
        setFormState({...formState, [e.target.name]: e.target.value });
    }

    const handleProcesoChange = (e) => {
        setSubProcesos(null);
        setError(null);
        if (e.target.value != "0") {
            axiosInstance.get(`subprocesos/${e.target.value}`)
                .then((response) => {
                    setSubProcesos(response.data);
                }).catch((error) => {
                    if(error.response && error.response.data && error.response.data.codigoError != undefined){
                        setError({...error, response: {...error.response, data: {...error.response.data, mensaje:  error.response.data.mensaje.split(",")[1]}}});
                    }else{
                        setError(error);
                        console.error(error);
                    }
                });
        }
        setFormState({...formState, [e.target.name]: e.target.value });
    }

    const hanldeChange = (e) => {
        const {name, value} = e.target;
        setFormState({...formState, [name]: value})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        //validamos que los campos no esten vacios
        if(formState.documento === "" || formState.idProceso === "" || formState.idsubProceso === "" || formState.fechaInicio === "" || formState.fechaFin === ""){
            alert("Todos los campos son obligatorios");
            return;
        }
        //vamos a realizar la validación de los campos, en este caso que fechainicio sea mayor a la fecha actual
        if(new Date(formState.fechaInicio) < new Date()){
            alert("La fecha de inicio no puede ser menor a la fecha actual");
            return;
        }
        if(new Date(formState.fechaFin) <= new Date(formState.fechaInicio)){
            alert("La fecha de fin no puede ser menor a la fecha de inicio");
            return;
        }
        setStadoBoton(true);
        axiosInstance.post(`usuarioprocesos`, formState)
            .then((response) => {
                const areaSeleccionada = areas.find(area => area.id == formState.idarea);
                const usuarioAreaSeleccionada = usuariosPorArea.find(area => area.id == formState.idarea);
                if(usuarioAreaSeleccionada && usuarioAreaSeleccionada.usuarios != undefined){
                    const areaConUsuario = {...areaSeleccionada, usuarios: response.data};
                    dispatch(mesadeprocesos_agregar_usuario_a_area(areaConUsuario));
                }
                setError(null);
                setProcesos(null);
                setSubProcesos(null);
                setUsuarios(null);
                setFormState(initialFormState);
                // Swal.fire({
                //     icon: 'success',
                //     text: 'Usuario agregado correctamente'
                // });
                setStadoBoton(false);
                handleClose();
            }).catch((error) => {
                console.error(error);
                if(error.response && error.response.data && error.response.data.codigoError != undefined){
                    setError({...error, response: {...error.response, data: { ...error.response.data, mensaje: error.response.data.mensaje.split(",")[1]}}})
                }else{
                    setError(error);
                }
                setStadoBoton(false);
            })
    }

    return (
        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{"Agregar Nuevo Proceso"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} id="formulario">
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="">Área de servicio</label>
                            <select className="form-select py-2 my-2" name='idarea' id="idarea" aria-label="Default select example" value={formState.idarea} onChange={handleAreaChange}>{/*value={formState.area} onChange={onInputChange} disabled={isEditing}*/}
                                <option value="0">Seleccionar Área</option>
                                {
                                    areas && areas.map((area, index) => (<option key={index} value={area.id} >{area.nombre}</option>))
                                }
                            </select>
                        </div>
                        {usuarios && <>
                            <div className="col-md-4">
                                <label htmlFor="">Usuario</label>
                                <select className="form-select py-2 my-2" aria-label="Default select example" name="documento" id="documento" value={formState.documento} onChange={hanldeChange}>{/* value={formState.usuario} onChange={onInputChange} disabled={isEditing} */}
                                    <option value="">Seleccionar Usuario</option>
                                    {
                                        usuarios && usuarios.map((usuario, index) => (
                                            <option key={index} value={usuario.documento}>{usuario.nombrecompleto}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </>}
                        {procesos && <>
                            <div className="col-md-4">
                                <label htmlFor="">Proceso</label>
                                <select className="form-select py-2 my-2" aria-label="Default select example" name="idProceso" id="idProceso" value={formState.idProceso} onChange={handleProcesoChange}>{/** value={formState.proceso} onChange={onInputChange} disabled={isEditing} */}
                                    <option value="0">Seleccionar Proceso</option>
                                    {
                                        procesos && procesos.map((proceso, index) => (
                                            <option key={index} value={proceso.id}>{proceso.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </>}
                    </div>
                    {subProcesos && subProcesos.length > 0 && 
                        <>
                            <div className="row">
                                <div className="col-md-4">

                                    <label htmlFor="">SubProceso</label>
                                    <select className="form-select py-2 my-2" aria-label="Default select example" name="idsubProceso" value={formState.idsubProceso} onChange={hanldeChange} >{/**value={formState.subproceso} onChange={onInputChange} disabled={isEditing} */}
                                        <option value="0">Seleccionar SubProceso</option>
                                        {
                                            subProcesos && subProcesos.map((subproceso, index) => (
                                                <option key={index} value={subproceso.id}>{subproceso.nombreSubproceso}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="">Fecha y Hora de Inicio</label>
                                    <input type="datetime-local" className="form-control py-2 my-2" name="fechaInicio" value={formState.fechaInicio} onChange={hanldeChange}/>{/** value={formState.fechaInicio} onChange={onInputChange} disabled={isEditing} */}
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="">Fecha y Hora de Fin</label>
                                    <input type="datetime-local" className="form-control py-2 my-2" name="fechaFin" value={formState.fechaFin} onChange={hanldeChange} />{/** value={formState.fechaFin} onChange={onInputChange} */}
                                </div>
                            </div>
                        </>}
                </form>
                {
                    error && error.response && error.response.data && error.response.data.codigoError != null &&
                    <div className="alert alert-danger text-center" > {error.response.data.mensaje} </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="formulario" disabled={stadoBoton}> Guardar </Button>
            </Modal.Footer>
        </Modal>
    )
}
