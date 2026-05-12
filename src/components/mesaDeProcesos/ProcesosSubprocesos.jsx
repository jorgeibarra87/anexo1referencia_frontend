import React, { useEffect, useState } from 'react'
import ProcesosForm from './ProcesosForm';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { areasServicioObtener } from '../../actions/areaservicioActions';
import SubprocesosForm from './SubprocesosForm';

import { mesadeprocesos_agregar_proceso_a_area, mesadeprocesos_agregar_subproceso_a_proceso } from '../../actions/mesadeprocesosActions';
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { RUTA_BACK_PRODUCCION } from '../../types';

function ProcesosSubprocesos() {

    const axiosInstance = UseAxiosInstance();

    const statelogin = useSelector(state => state.login); //traer el estado de login
    const stateAreasServicio = useSelector(state => state.areaservicio);
    const stateMesadeprocesos = useSelector(state => state.mesadeprocesos);
    const dispatch = useDispatch();

    const [showModalProceso, setShowModalProceso] = useState(false);
    const [showModalSubProceso, setShowModalSubProceso] = useState(false);
    const [areas, setAreas] = useState([]);
    const [procesosporArea, setProcesosporarea] = useState(stateMesadeprocesos.areas);
    const [editProceso, setEditProceso] = useState(null);
    const [editSubProceso, setEditSubProceso] = useState(null);
    const [areaSeleccionada, setAreaSeleccionada] = useState({ id: 0, nombre: '' });
    const [procesoSeleccionado, setProcesoSeleccionado] = useState({ id: 0 });
    const [searchTerm, setSeachTerm] = useState('');// estado para almacenar el valor de la busqueda

    const [error, setError] = useState(null);

    useEffect(() => {//carga las areas que tiene asignadas el usuario por medio de su documento
        if (areas == null && statelogin.decodeToken.authorities.split(',').includes('ROLE_MESADEPROCESOS_COORD', 'ROLE_ADMIN')) {//
            const token = localStorage.getItem('tokenhusjp');
            axios.get(`${RUTA_BACK_PRODUCCION}api/mesadeprocesos/servicio/usuario/${statelogin.decodeToken.sub}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then((response) => {
                    dispatch(areasServicioObtener(response.data));
                })
                .catch((error) => {
                    console.error(error);
                    setError(error);
                });
        }
    }, [areas, dispatch, statelogin.decodeToken.authorities, statelogin.decodeToken.sub]);

    useEffect(() => {
        setProcesosporarea(stateMesadeprocesos.areas);
    }, [stateMesadeprocesos.areas]);

    useEffect(() => {
        setAreas(stateAreasServicio.areasServicio);
    }, [stateAreasServicio.areasServicio]);

    useEffect(() => {//ussEffect para enfocar el modal de proceso
        if (showModalProceso) {
            const modal = document.querySelector('.modal');
            modal && modal.focus();
        }
        if(showModalSubProceso){
            const modal = document.querySelector('.modal');
            modal && modal.focus();
        }
    }, [showModalProceso, showModalSubProceso]);

    useEffect(() => {//mostrar editar modal proceso
        if (editProceso != null){
            setShowModalProceso(true);
        }
    },[setEditProceso,setShowModalProceso,editProceso]);

    useEffect(() => {//mostrar editar modal subproceso  
        if (editSubProceso != null){
            setShowModalSubProceso(true);
        }
    },[setEditSubProceso,setShowModalSubProceso,editSubProceso]);

    const handleAreaServicioChange = async (e) => {//carga los procesos al seleccionar un area
        setError(null);
        if (e.target.value != 0) {
            const areaSeleccionada = areas.find(area => area.id == e.target.value);
            setAreaSeleccionada(areaSeleccionada);
            if (procesosporArea != null) {
                const procesoArea = procesosporArea.find(area => area.id == e.target.value);
                if (procesoArea == undefined || procesoArea.procesos == undefined) {
                    try {
                        const response = await axiosInstance.get(`procesos/${e.target.value}`);
                        //retirar de response.data el atributo ida
                        //response && response.data.map(proceso => delete proceso.idarea);
                        const areaConProcesos = { ...areaSeleccionada, procesos: response.data };
                        dispatch(mesadeprocesos_agregar_proceso_a_area(areaConProcesos));
                    } catch (error) {
                        if (error.response && error.response.data && error.response.data.codigoError != undefined) {
                            setError({ ...error, response: { ...error.response, data: { ...error.response.data, mensaje: error.response.data.mensaje.split(',')[1] } } });
                        }
                        else {
                            setError(error);
                        }
                    }
                }
            }
        }
    }

    const handleClickAreaServicio = async (proceso) => {//carga los subprocesos al hacer clic sobre un proceso
        setError(null);
        if (procesoSeleccionado.id == 0) { //si no hay proceso seleccionado
            setProcesoSeleccionado(proceso);
            if (proceso.subprocesos == undefined) {
                await axiosInstance.get(`subprocesos/${proceso.id}`)
                    .then((response) => {
                        const procesoR = { ...proceso, subprocesos: response.data };
                        dispatch(mesadeprocesos_agregar_subproceso_a_proceso(procesoR));
                    }).catch((error) => {
                        if (error.response && error.response.data && error.response.data.codigoError != undefined) {
                            setError({ ...error, response: { ...error.response, data: { ...error.response.data, mensaje: error.response.data.mensaje.split(',')[1] } } });
                        } else {
                            setError(error);
                            console.error(error);
                        }
                    });
            }
        } else {//si hay un proceso seleccionado lo deselecciona y oculta los subprocesos
            setProcesoSeleccionado({ id: 0 });
        }
    }

    const hanldeSearchChange = (e) => {
        setSeachTerm(e.target.value);
    }

    const handleAddProceso = () => {
        setEditProceso(null);
        setShowModalProceso(true);
    }

    const handleAddSubProceso = () => {
        setEditSubProceso(null);
        setShowModalSubProceso(true);
    };
    
    return (
        <div className="pt-3 pe-3">
            <h2 className="text-center">Procesos - Subprocesos</h2>
            <div className="container mt-2 ms-5 mx-3">
                <div>
                    <h3>Listado Procesos </h3>
                </div>
                <div className="row align-items-center">
                    <div className="col-4">
                        <input className="form-control" type="text" placeholder="Escribe el nombre del Proceso" value={searchTerm} onChange={hanldeSearchChange} />
                    </div>
                    <div className='col-4'>
                        <select className='form-select' name='idarea' onChange={handleAreaServicioChange}>
                            <option value='0'>Selecciona el área</option>
                            {
                                areas && areas.map((area, index) => (
                                    <option key={index} value={area.id}> {area.nombre}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-4">
                        <h3 className="text-center">
                            Crear Procesos
                            <a className="ps-2" onClick={handleAddProceso}>
                                <i className="bi bi-plus-circle-fill text-success"></i>
                            </a>
                        </h3>
                    </div>
                </div>

                {error && error.response && error.response.data && error.response.data.codigoError && procesoSeleccionado && procesoSeleccionado.id == 0 && (
                    <div className="alert alert-warning text-center" role="alert">
                        {error.response.data.mensaje}
                    </div>
                )}

                <table className="table table-sm my-2">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Proceso</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Área</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            procesosporArea && procesosporArea.length > 0 &&
                            procesosporArea.filter(area => area.id === areaSeleccionada.id)
                                .flatMap(area => area.procesos ? area.procesos : [])
                                .filter(proceso => proceso.nombre.toLowerCase().includes(searchTerm.toLowerCase()))//filtro de busqueda
                                .map((proceso, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <tr onClick={() => handleClickAreaServicio(proceso)} className={proceso.id == procesoSeleccionado.id ? "table-warning" : ""}>
                                                <td>{proceso.id}</td>
                                                <td>{proceso.nombre}</td>
                                                <td>{proceso.descripcion}</td>
                                                <td>{areaSeleccionada.nombre}</td>
                                                <td className='text-center' onClick={(e) => e.stopPropagation()}>
                                                    <button className="btn text-warning" onClick={() => setEditProceso(proceso)} ><i className="bi bi-pencil"></i></button>
                                                    {
                                                        procesoSeleccionado && procesoSeleccionado.id === proceso.id ? (
                                                            <a className="ps-2" onClick={handleAddSubProceso} >
                                                                <i className="bi bi-plus-circle-fill text-success"></i>
                                                            </a>
                                                        ) : null
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                error && error.response && error.response.data && error.response.data.codigoError == "GC-0014" && procesoSeleccionado && procesoSeleccionado.id === proceso.id &&
                                                <tr>
                                                    <td colSpan={5}>
                                                        <div className="alert alert-warning alert-dismissible text-center" role="alert">{error.response.data.mensaje}
                                                        </div>
                                                    </td>
                                                </tr>
                                            }
                                            {error == null && procesoSeleccionado && procesoSeleccionado.id === proceso.id && (
                                                <tr >
                                                    <td colSpan="5">
                                                        <table className="table table-success">
                                                            <thead>
                                                                <tr>
                                                                    <th>SubProceso</th>
                                                                    <th>Nombre</th>
                                                                    <th>Descripción</th>
                                                                    <th>acciones</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {proceso.subprocesos && proceso.subprocesos.map((subproceso, idx) => (
                                                                    <tr key={idx}>
                                                                        <td>{subproceso.id}</td>
                                                                        <td>{subproceso.nombreSubproceso}</td>
                                                                        <td>{subproceso.descripcion}</td>
                                                                        <td>
                                                                        <button className="btn text-warning" onClick={() => setEditSubProceso(subproceso)} ><i className="bi bi-pencil"></i></button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                        }
                    </tbody>
                </table>

                {/* <Pagination>
                    {Array.from(
                        { length: Math.ceil(datos.length / itemsPerPage) },
                        (_, i) => (
                            <Pagination.Item  key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)} > 
                                {i + 1}
                            </Pagination.Item>
                        )
                    )}
                </Pagination> */}

            </div>

            <ProcesosForm show={showModalProceso} handleClose={() => setShowModalProceso(false)} areas={areas} editProceso = {editProceso}/>
            <SubprocesosForm show={showModalSubProceso} handleClose={() => setShowModalSubProceso(false)} proceso={procesoSeleccionado}  editSubProceso={editSubProceso}/>
        </div>
    )
}

export default ProcesosSubprocesos