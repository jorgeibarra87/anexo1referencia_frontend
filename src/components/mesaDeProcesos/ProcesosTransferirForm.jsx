import { useEffect, useState } from 'react'
import UseAxiosInstance from '../../utilities/UseAxiosInstance';
import { useDispatch } from 'react-redux';
import { mesadeprocesos_agregar_usuario_a_area, mesadeprocesos_eliminar_usuario_de_area } from '../../actions/mesadeprocesosActions';

const initalForm = {
    idUsuarioProceso: 0,
    nuevoUsuarioId: ''
}

function ProcesosTransferirForm({ show, handleClose, usuarioTransferir }) {

    const axiosInstance = UseAxiosInstance();

    const dispatch = useDispatch();
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState(initalForm);
    const [error, setError] = useState(null);

    useEffect(() => {
        setForm({ ...form, idUsuarioProceso: parseInt(usuarioTransferir && usuarioTransferir.usuarios.id) });
        if(usuarioTransferir){
            axiosInstance.get(`servicio/usuarios/${usuarioTransferir.id}`)
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                if(error.response.data.codigoError != null){
                    setError({...error, response: {...error.response, data: {...error.response.data, mensaje: error.response.data.mensaje.split(',')[1]}}})
                }else{
                    setError(error);
                }
                console.error(error);
            });
        }
    }, [usuarioTransferir]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.nuevoUsuarioId === ''){
            alert('Debe seleccionar un usuario', {type: 'error'});
            return;
        }
        await axiosInstance.put(`usuarioprocesos/transferir?idUsuarioProceso=${form.idUsuarioProceso}&nuevoUsuarioId=${form.nuevoUsuarioId}`)
            .then((response) => {
                dispatch(mesadeprocesos_eliminar_usuario_de_area(usuarioTransferir));
                const usuarioActualizado = {...usuarioTransferir, usuarios: response.data};
                dispatch(mesadeprocesos_agregar_usuario_a_area(usuarioActualizado));
                handleClose();
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Usuario Transferido',
                // })
            }).catch((error) => {
                if(error.response.data.codigoError != null){
                    setError({...error, response: {...error.response, data: {...error.response.data, mensaje: error.response.data.mensaje.split(',')[1]}}})
                }else{
                    setError(error);
                }
                console.error(error);
            });
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{`Trasferir proceso  ${usuarioTransferir && usuarioTransferir.usuarios.id}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} id='formulario'>
                {usuarios && <>
                    <div className="col-md-12">
                        <label htmlFor="">Usuario</label>
                        <select className="form-select py-2 my-2" name="nuevoUsuarioId" id="nuevoUsuarioId" value={form.nuevoUsuarioId} onChange={handleChange}>{/* value={formState.usuario} onChange={onInputChange} disabled={isEditing} */}
                            <option value="">Seleccionar Usuario</option>
                            {
                                usuarios && usuarios.map((usuario, index) => (
                                    <option key={index} value={usuario.documento}>{usuario.nombrecompleto}</option>
                                ))
                            }
                        </select>
                    </div>
                </>}
                </form>
                {
                    error && error.response && error.response.data && error.response.data.codigoError != null &&
                    <div className='alert alert-warning text-center'>{error.response.data.mensaje}</div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' type='submit' form='formulario' onClick={handleSubmit}>Enviar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ProcesosTransferirForm