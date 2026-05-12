import axios from 'axios';
import { useEffect, useState } from 'react'
import { RUTA_BACK_PRODUCCION } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { areasServicioObtener } from '../../actions/areaservicioActions';
import { FormatearFecha } from '../../utilities/FormatearFecha';
import UsuarioProcesoForm from './UsuarioProcesoForm';
import { mesadeprocesos_actualizar_usuario_de_area, mesadeprocesos_agregar_usuario_a_area, mesadeprocesos_eliminar_usuario_de_area } from '../../actions/mesadeprocesosActions';

import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import ProcesosTransferirForm from './ProcesosTransferirForm';


const UsuariosProceso = () => {

    const axiosInstance = UseAxiosInstance();
    const stateAreasServicio = useSelector(state => state.areaservicio);
    const stateMesadeprocesos = useSelector(state => state.mesadeprocesos);
    const dispatch = useDispatch();

    const [areas, setAreas] = useState(stateAreasServicio.areasServicio);
    const [usuariosPorArea, setUsuariosPorArea] = useState(stateMesadeprocesos.areas);
    const [usuarioSearch, setUsuarioSearch] = useState(null);
    const [error, setError] = useState(null);
    const [showModalFormUsuarioProceso, setShowModalFormUsuarioProceso] = useState(false);
    const [showModalFormTransferir, setShowModalFormTransferir] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [editFechaFin, setEditFechaFin] = useState('');
    const [areaSeleccionada, setAreaSeleccionada] = useState(0);
    const [usuarioTransferir, setUsuarioTransferir] = useState(null);
    const [btnExcelState, setBtnExcelState] = useState(false);

    const statelogin = useSelector(state => state.login);
    const roles = statelogin.decodeToken.authorities.split(',');
    //const hasRole = (role) => roles.includes(role);
    const hasRole = (...rolesToCheck) => {
        return rolesToCheck.some(role => roles.includes(role));
    };

    useEffect(() => {//useeffect para obtener los usuarios por area del usuario logueado con role mesaprocesos_user
        const fetchUserData = async () => {
            if (statelogin.decodeToken.authorities.split(',').includes('ROLE_MESADEPROCESOS_USER','ROLE_ADMIN')) {
                setUsuariosPorArea(null);
                setError(null);
                // Capturar el valor del input documento
                //document.querySelector('select[name="area"]').value = 0;
                try {
                    const response = await axios.get(`${RUTA_BACK_PRODUCCION}usuarioprocesos/${statelogin.decodeToken.sub}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('tokenhusjp')}` },
                    });
                    setUsuarioSearch(response.data);
                } catch (error) {
                    console.error('Error al pedir un usuario',error);
                    setError(error);
                    setShowAlert(true);
                }
            }
        };
        fetchUserData();
    }, [statelogin.decodeToken.authorities, statelogin.decodeToken.sub]);

    useEffect(() => {//useeffect para obtener las areas de servicio
        const fetchAreas = async () => {
            if (areas == null && statelogin.decodeToken.authorities.split(',').includes('ROLE_MESADEPROCESOS_COORD','ROLE_ADMIN')) {
                const token = localStorage.getItem('tokenhusjp');
                axios.get(`${RUTA_BACK_PRODUCCION}api/mesadeprocesos/servicio/usuario/${statelogin.decodeToken.sub}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((response) => {
                        dispatch(areasServicioObtener(response.data));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        };
        fetchAreas();
    }, [areas, dispatch, statelogin.decodeToken.authorities, statelogin.decodeToken.sub]);

    useEffect(() => {//useeffect para actualizar las areas de servicio cada que cambia el estado
        setAreas(stateAreasServicio.areasServicio);
    }, [stateAreasServicio.areasServicio]);

    const handleAreaChange = async (e) => {//obtener usuarios por area seleccionada
        setUsuarioSearch(null);
        setError(null);
        const areaSeleccionadaId = parseInt(e.target.value);
        setAreaSeleccionada(areaSeleccionadaId);
        try {
            if (areaSeleccionadaId !== 0) {
                setBtnExcelState(true);
                const areaSeleccionada = areas.find(area => area.id === areaSeleccionadaId);
                if (usuariosPorArea != null) {
                    const usuarioArea = usuariosPorArea.find(area => area.id === areaSeleccionadaId);
                    if (usuarioArea == undefined || usuarioArea.usuarios == undefined) {
                        const response = await axiosInstance.get(`usuarioprocesos/area/${areaSeleccionadaId}`);
                        const areaConUsuarios = { ...areaSeleccionada, usuarios: response.data };
                        dispatch(mesadeprocesos_agregar_usuario_a_area(areaConUsuarios));
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setError(error);
            setShowAlert(true);
        }
    };

    useEffect(() => {//useeffect para cuando se busque un usuario se vea solo usuarioSearch
        if (usuarioSearch == null) {//si usuarioSearch es null se vuelven a cargar los usuarios por area
            setUsuariosPorArea(stateMesadeprocesos.areas);
        }
    }, [stateMesadeprocesos.areas, usuarioSearch]);//se agrega usuarioSearch para que cuando se cambie se actualice el estado

    useEffect(() => {//useeffect para mover el foco del modal cuando se abre
        if (showModalFormUsuarioProceso) {
            const modal = document.querySelector('.modal');
            modal && modal.focus(); // Mueve el foco al modal cuando se abre
        }
    }, [showModalFormUsuarioProceso]);

    const searchUsuario = async () => {
        setUsuariosPorArea(null);
        setError(null);
        //capturar el valor del input documento
        var documento = document.getElementById('documento').value;
        document.querySelector('select[name="area"]').value = 0;
        try {
            const response = await axiosInstance.get(`usuarioprocesos/${documento}`);
            setUsuarioSearch(response.data);
        } catch (error) {
            console.error(error);
            setError(error);
            setShowAlert(true);
        }
    }

    const handleAdd = () => {
        setShowModalFormUsuarioProceso(true);
    }

    const handleCloseAlert = () => {
        setShowAlert(false);
    }

    const handleDelete = async (e) => {
        // Swal.fire({
        //     title: '¿Está seguro de eliminar el usuario?',
        //     text: "No podrá revertir esta acción",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Sí, eliminar',
        //     cancelButtonText: 'Cancelar',
        //     preConfirm: async () => {
        //         try {
        //             // capturamos el id del select que está seleccionado
        //             const idArea = document.querySelector('select[name="area"]').value;
        //             const areaSeleccionada = areas.find(area => area.id == idArea);
        //             const areaConUsuario = { ...areaSeleccionada, usuarios: e };

        //             // Realizamos la operación de eliminación
        //             await axiosInstance.delete(`usuarioprocesos/${e.id}`);

        //             // Ejecutamos la acción en el reducer
        //             dispatch(mesadeprocesos_eliminar_usuario_de_area(areaConUsuario));

        //             // Si todo sale bien, retornamos el mensaje para actualizar el Swal
        //             return 'Eliminado correctamente';
        //         } catch (error) {
        //             console.error(error);
        //             // Retornamos el mensaje de error que mostrará Swal
        //             Swal.showValidationMessage('Ocurrió un problema al eliminar el usuario');
        //             throw error; // Importante para que Swal detecte el error y no cierre el modal
        //         }
        //     }
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         Swal.fire({
        //             title: 'Eliminado!',
        //             text: result.value,
        //             icon: 'success',
        //             confirmButtonText: 'Ok'
        //         });
        //     }
        // });
    }

    const handleEdit = (usuario) => {
        setEditUserId(usuario.id);
        setEditFechaFin(usuario.fechaFin);
    }

    const handleTransferir = (usuario) => {
        setShowModalFormTransferir(true);

        const idArea = document.querySelector('select[name="area"]').value;
        const areaSeleccionada = areas.find(area => area.id == idArea);
        const areaConUsuario = { ...areaSeleccionada, usuarios: usuario };
        setUsuarioTransferir(areaConUsuario);
    }

    const handleFechaFinChange = (e) => {
        setEditFechaFin(e.target.value);
    }

    const handleSave = (usuario) => {
        axiosInstance.put(`usuarioprocesos/${usuario.id}`, editFechaFin, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                dispatch(mesadeprocesos_actualizar_usuario_de_area({ ...usuario, fechaFin: editFechaFin }));
            }).catch((error) => {
                console.error(error);
            });
        setEditUserId(null);
    }

    const handleCancel = () => {
        setEditUserId(null);
    }

    const handleFinalizar = (usuario) => {
        // Swal.fire({
        //     icon: 'info',
        //     text: 'Adjunte el enlace o describa la solución',
        //     input: 'text',
        //     inputAttributes: {
        //         autocapitalize: 'off'
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: 'Finalizar',
        //     cancelButtonText: 'Cancelar',
        //     showLoaderOnConfirm: true,
        //     preConfirm: async (enlace) => {
        //         try {
        //             const response = await axiosInstance.put(`usuarioprocesos/estado/${usuario.id}?enlace=${enlace}`);
        //             dispatch(mesadeprocesos_actualizar_usuario_de_area(response.data));
        //         } catch (error) {
        //             console.error('error al finalizar',error);
        //             Swal.showValidationMessage(`Ocurrió un error al finalizar el usuario`);
        //         }
        //     }
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Finalizado',
        //             text: 'El usuario ha sido finalizado correctamente',
        //         });
        //     }
        // }
        // );
    }

    const generarReporte = async () => {
        setBtnExcelState(false);
        await axiosInstance.get(`usuarioprocesos/excel/${areaSeleccionada}`, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        })
            .then((response) => {
                //exportar el archivo y que se pueda descargar
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ReporteUsuariosProcesos${new Date().toLocaleDateString()}.xlsx`);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                setBtnExcelState(true);
            }).catch((error) => {
                setBtnExcelState(true);
                setError(error);
            });
    }


    return (
        <>

            <div className="bg-dark-blue text-dark">
                <h2 className="text-center py-5">
                    Listado de Usuarios y Procesos Asignados
                </h2>
                <div className="container mt-4">
                    {
                        hasRole('ROLE_MESADEPROCESOS_COORD', 'ROLE_ADMIN') && (
                            <div className="row mt-5">
                                <div className="col-md-4 col-sm-2">
                                    <input className="form-control" type="text" name='documento' id='documento' placeholder="Digite la cédula del usuario" />
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-primary" onClick={searchUsuario}>Buscar</button>
                                </div>
                                <div className=" col-md-2">
                                    <select className="form-select" name="area" onChange={handleAreaChange}>
                                        <option value="0">Seleccionar Área</option>
                                        {
                                            areas && areas.map((area, index) => (
                                                <option key={index} value={area.id} >{area.nombre}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-5 text-end">
                                    <h3 className="mb-0">
                                        Asignar Subproceso a Usuario
                                        <a className="ps-2" onClick={handleAdd}>
                                            <i className="bi bi-plus-circle-fill text-success"></i>
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        )
                    }
                    <div className="row mt-4 ">
                        {showAlert && error && error.response && error.response.data && error.response.data.mensaje && error.response.data.codigoError === "GC-0014" && <div className="alert alert-warning alert-dismissible text-center" role="alert">{`No tienes procesos asignados`} <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAlert}></button></div>}
                        {showAlert && error && error.response && error.response.data && error.response.data.mensaje && error.response.data.codigoError === "GC-0003" && <div className="alert alert-warning alert-dismissible" role="alert">{`No se encuentra información con el docmuento digitado`} <button type='button' className='btn-close' aria-label='Close' onClick={handleCloseAlert}></button> </div>}
                    </div>
                    <div className="table-responsive mt-2">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">id UsuProc</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Proceso</th>
                                    <th scope="col">SubProceso</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Fecha Inicio</th>
                                    <th scope="col">Fecha Fin</th>
                                    <th scope="col">Enlace</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usuariosPorArea && usuariosPorArea.length > 0 &&
                                    usuariosPorArea.filter(area => area.id === areaSeleccionada)
                                        .flatMap(area => area.usuarios ? area.usuarios : [])
                                        .map((usuario, index) => {
                                            return (
                                                <tr key={index} className={usuario.estado == 2 ? "table-success" : usuario.estado == 3 ? "table-danger" : "table-warning"}>
                                                    <th scope="row">{usuario.id}</th>
                                                    <td>{usuario.nombreUsuario}</td>
                                                    <td>{usuario.idProceso}</td>
                                                    <td>{usuario.idsubProceso}</td>
                                                    <td>{usuario.descripcionSubproceso}</td>
                                                    <td>{FormatearFecha(usuario.fechaInicio)}</td>
                                                    <td>{
                                                        editUserId && editUserId === usuario.id ?
                                                            <input type="datetime-local" className="form-control py-2 my-2" name="fechaInicio" value={editFechaFin} onChange={handleFechaFinChange} />
                                                            : FormatearFecha(usuario.fechaFin)
                                                    }</td>
                                                    <td>
                                                        <a href={`${usuario.enlace}`} target="_blank" rel="noreferrer">{usuario.enlace == null ? '' : 'ver enlace' }</a>
                                                    </td>
                                                    <td >
                                                        <div className="btn-group">
                                                            {editUserId && editUserId === usuario.id ?
                                                                <>
                                                                    <button className="btn text-success" onClick={() => handleSave(usuario)}>
                                                                        <i className="bi bi-check-circle-fill"></i>
                                                                    </button>
                                                                    <button className="btn text-danger" onClick={handleCancel}>
                                                                        <i className="bi bi-x-circle-fill"></i>
                                                                    </button>
                                                                </> : <>

                                                                {hasRole('ROLE_MESADEPROCESOS_COORD', 'ROLE_ADMIN') && (
                                                                    <>
                                                                        <button className="btn text-warning" type="button" onClick={() => handleEdit(usuario)}>
                                                                            <i className="bi bi-pencil-fill"> </i>
                                                                        </button>
                                                                        <button className="btn text-primary">
                                                                            <i className="bi bi-send-plus-fill" type="button" onClick={() => handleTransferir(usuario)}></i>
                                                                        </button>
                                                                        <button className="btn text-danger" onClick={() => handleDelete(usuario)}>
                                                                            <i className="bi bi-trash-fill"></i>
                                                                        </button>
                                                                    </> )
                                                                 }
                                                                 {hasRole('ROLE_MESADEPROCESOS_USER', 'ROLE_ADMIN') && usuario.estado != 2 &&(
                                                                    <button className="btn text-success" onClick={() => handleFinalizar(usuario)}>
                                                                        <i className="bi bi-check-circle-fill"></i>
                                                                    </button>
                                                                 )}
                                                                </>
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                }
                                {
                                    usuarioSearch && usuarioSearch.length > 0 &&
                                    usuarioSearch.map((usuario, index) => {
                                        return (
                                            <tr key={index} className={usuario.estado == 2 ? "table-success" : usuario.estado == 3 ? "table-danger" : "table-warning"}>
                                                <th scope="row">{usuario.id}</th>
                                                <td>{usuario.nombreUsuario}</td>
                                                <td>{usuario.idProceso}</td>
                                                <td>{usuario.idsubProceso}</td>
                                                <td>{usuario.descripcionSubproceso}</td>
                                                <td>{FormatearFecha(usuario.fechaInicio)}</td>
                                                <td>{
                                                    editUserId && editUserId === usuario.id ?
                                                        <input type="datetime-local" className="form-control py-2 my-2" name="fechaInicio" value={editFechaFin} onChange={handleFechaFinChange} />
                                                        : FormatearFecha(usuario.fechaFin)
                                                }</td>
                                                <td>
                                                    <a href={`${usuario.enlace}`} target="_blank" rel="noreferrer">{usuario.enlace == null ? '' : 'ver enlace' }</a>
                                                </td>
                                                <td >
                                                        <div className="btn-group">
                                                            {editUserId && editUserId === usuario.id ?
                                                                <>
                                                                    <button className="btn text-success" onClick={() => handleSave(usuario)}>
                                                                        <i className="bi bi-check-circle-fill"></i>
                                                                    </button>
                                                                    <button className="btn text-danger" onClick={handleCancel}>
                                                                        <i className="bi bi-x-circle-fill"></i>
                                                                    </button>
                                                                </> : <>

                                                                {hasRole('ROLE_MESADEPROCESOS_COORD', 'ROLE_ADMIN') &&  (
                                                                    <>
                                                                        <button className="btn text-warning" type="button" onClick={() => handleEdit(usuario)}>
                                                                            <i className="bi bi-pencil-fill"> </i>
                                                                        </button>
                                                                        <button className="btn text-primary">
                                                                            <i className="bi bi-send-plus-fill" type="button" onClick={() => handleTransferir(usuario)}></i>
                                                                        </button>
                                                                        <button className="btn text-danger" onClick={() => handleDelete(usuario)}>
                                                                            <i className="bi bi-trash-fill"></i>
                                                                        </button>
                                                                    </> )
                                                                 }
                                                                 {hasRole('ROLE_MESADEPROCESOS_USER', 'ROLE_ADMIN') && usuario.estado != 2 &&(
                                                                    <button className="btn text-success" onClick={() => handleFinalizar(usuario)}>
                                                                        <i className="bi bi-check-circle-fill"></i>
                                                                    </button>
                                                                 )}
                                                                </>
                                                            }
                                                        </div>
                                                    </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* <Pagination className="justify-content-center">
                        {Array.from(
                            { length: Math.ceil(data.length / itemsPerPage) },
                            (_, i) => (
                                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination> */}
                </div>

                { btnExcelState && areaSeleccionada != 0 ?
                    (<div className='text-end' >
                        <div className='badge text-bg-warning'>
                            <span className=''>Excel</span>
                            <a className='text-success fs-1' onClick={generarReporte}><i className='bi bi-file-earmark-excel-fill'></i></a>
                        </div>
                    </div> )
                    : (
                        btnExcelState == false && 
                        <div className='text-end' >
                            <div className='badge text-bg-warning'>
                                <span className=''>Descargando...</span>
                            </div>
                        </div>
                    )
                }
            </div>
            <UsuarioProcesoForm show={showModalFormUsuarioProceso} handleClose={() => setShowModalFormUsuarioProceso(false)} areas={areas} />
            <ProcesosTransferirForm show={showModalFormTransferir} handleClose={() => setShowModalFormTransferir(false)} usuarioTransferir={usuarioTransferir} />

        </>
    )
}

export default UsuariosProceso

