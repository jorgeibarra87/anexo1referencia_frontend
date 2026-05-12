import { useEffect, useState } from 'react'

import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { mesadeprocesos_actualizar_proceso_de_area, mesadeprocesos_agregar_proceso_a_area } from '../../actions/mesadeprocesosActions';

const initialFormState = {
    id: '',
    descripcion: '',
    id_servicio: '',
    nombre: '',
}

export default function ProcesosForm({ show, handleClose, areas, editProceso }) {

    const axiosInstance = UseAxiosInstance();
    const dispatch = useDispatch();
    const stateAreasProcesos = useSelector(state => state.mesadeprocesos);
    const [procesosPorArea, setProcesosPorArea] = useState(stateAreasProcesos.areas);

    const [formu, setFormu] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormu({ ...formu, [name]: value });
    };

    useEffect(() => {
        setProcesosPorArea(stateAreasProcesos.areas);
    }, [stateAreasProcesos.areas]);

    useEffect(() => {
        if (editProceso) {
            setFormu(editProceso);
        }else{
            setFormu(initialFormState);
        }
    }, [editProceso]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(editProceso == null){
            await axiosInstance.post(`/procesos`, formu)
            .then((response) => {

                const areaSeleccionada = areas.find(area => area.id == formu.idarea);
                const procesosAreaSeleccionada = procesosPorArea.find(area => area.id == formu.idarea);
                if(procesosAreaSeleccionada?.procesos){
                    //response && response.data.map(proceso => delete proceso.idarea);
                    dispatch(mesadeprocesos_agregar_proceso_a_area({...areaSeleccionada, procesos: response.data}));
                }
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Proceso Agregado',
                //     showConfirmButton: false,
                //     showCloseButton: true,
                //     timer: 1500
                // });
                setFormu(initialFormState);
                handleClose();
            }).catch((error) => {
                console.error(error);
            })
        }else{
            await axiosInstance.put(`/procesos/${editProceso.id}`, formu)
                .then((response) => {
                    dispatch(mesadeprocesos_actualizar_proceso_de_area(response.data));
                })
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Proceso Actualizado',
                //     timer: 1000
                // });
                setFormu(initialFormState);
                handleClose();
        }
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{"Agregar Nuevo Proceso"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} id='formulario'>
                    <select className='form-select' aria-label='Default select example' name='id_servicio' value={formu.id_servicio} onChange={handleChange} >
                        <option value='0'>Selecciona el área</option>
                        {
                            areas && areas.map((area, index) => (
                                <option key={index} value={area.id}> {area.nombre}</option>
                            ))
                        }
                    </select>
                    <input className='form-control my-3' type='number' placeholder='Proceso' name='id' value={formu.id} onChange={handleChange} />
                    <input className='form-control my-3' type='text' placeholder='Nombre' name='nombre' value={formu.nombre} onChange={handleChange} />
                    <textarea className='form-control my-3' type='text' placeholder='Descripción del proceso' name='descripcion' value={formu.descripcion} onChange={handleChange} />

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' type='submit' form='formulario' onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}
