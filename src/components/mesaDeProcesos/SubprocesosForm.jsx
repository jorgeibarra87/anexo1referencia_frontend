import { useEffect, useState } from 'react'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { useDispatch } from 'react-redux';
import { mesadeprocesos_actualizar_subproceso_de_proceso, mesadeprocesos_agregar_subproceso_a_proceso } from '../../actions/mesadeprocesosActions';

const initialFormState = {
    nombreSubproceso: '',
    descripcion: ''
}

function SubprocesosForm({ show, handleClose, proceso , editSubProceso}) {

    const axiosInstance = UseAxiosInstance();

    const [form, setForm] = useState(initialFormState);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value,})
        
    }

    useEffect(() =>{
        if(editSubProceso != null)   {
            setForm(editSubProceso);
        }else{
            setForm(initialFormState);
        }
    }, [editSubProceso]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formWithProcesoId = { ...form, idproceso: proceso.id };
        try{
            if(editSubProceso == null){
                const response = await axiosInstance.post('/subprocesos', formWithProcesoId);
                //MESAPROCESOS_AGREGAR_SUBPROCESO_A_PROCESO
                dispatch(mesadeprocesos_agregar_subproceso_a_proceso({id: proceso.id, subprocesos: [response.data]}));
                setForm(initialFormState);
                handleClose();
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Subproceso Agregado',
                //     showConfirmButton: false,
                //     timer: 1000
                // });
            }else{
                const response = await axiosInstance.put(`/subprocesos/${editSubProceso.id}`, formWithProcesoId);
                dispatch(mesadeprocesos_actualizar_subproceso_de_proceso(response.data));
                setForm(initialFormState);
                handleClose();
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Subproceso Actualizado',
                //     showConfirmButton: false,
                //     timer: 1000
                // })
            }
        }catch(error){
            console.error(error);
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Subproceso al proceso {`${proceso.nombre}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} id='formulario'>
                    <input type='text' className='form-control my-3' placeholder='nombre' value={form.nombreSubproceso} name='nombreSubproceso'  onChange={handleChange}/>
                    <textarea className='form-control my-3' placeholder='Descripción del subproceso' value={form.descripcion} name='descripcion' onChange={handleChange}/>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' form='formulario' onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SubprocesosForm