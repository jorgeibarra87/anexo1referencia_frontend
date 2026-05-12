export default function HumanizacionSolicitudes() {

    const agregarSolicitud = () => {
        // Swal.fire({
        //     title: 'Crear Solicitud',
        //     input: 'text',
        //     inputLabel: 'Ingrese documento de identidad.',
        //     inputPlaceholder: 'Buscar...',
        //     showCancelButton: true,
        //     confirmButtonText: 'Buscar',
        //     showLoaderOnConfirm: true,
        //     preConfirm: () => {
        //         // return axios.get(`https://api.example.com/search?query=`)
        //         //     .then(response => {
        //         //         if (response.data.error) {
        //         //             throw new Error(response.data.error);
        //         //         }
        //         //         return response.data;
        //         //     })
        //         //     .catch(error => {
        //         //         Swal.showValidationMessage(
        //         //             `Solicitud fallida: ${error}`
        //         //         );
        //         //     });
        //     },
        //     allowOutsideClick: () => !Swal.isLoading()
        // }).then((result) => {
        //     if (result.isConfirmed) {
                
        //         Swal.fire({
        //             title: 'Resultado',
        //             html: `
        //                 <table class="table table-bordered small table-sm">
        //                     <thead class="table-dark">
        //                         <tr>
        //                             <th>No Ingreso</th>
        //                             <th>Nombres</th>
        //                             <th>Apellidos</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         <tr>
        //                             <td>123456</td>
        //                             <td>Julio Cesar</td>
        //                             <td>Alvarez Cuaces</td>
        //                         </tr>
        //                     </tbody>
        //                     <thead class="table-dark">
        //                         <tr>
        //                             <th>Edad</th>
        //                             <th>Municipio Recide</th>
        //                             <th>Cllasificación T.S</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         <tr>
        //                             <td>88</td>
        //                             <td>Popayan</td>
        //                             <td>Abandono S</td>
        //                         </tr>
        //                     </tbody>
        //                     <thead class="table-dark">
        //                         <tr>
        //                             <th>Aislamiento</th>
        //                             <th>Servicio</th>
        //                             <th>Estrato S.E</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         <tr>
        //                             <td>No Aplica</td>
        //                             <td>Quirurgicas</td>
        //                             <td>1</td>
        //                         </tr>
        //                     </tbody>
        //                 </table>
        //                 <button id="option1" class="btn btn-primary">Agregar Recurso</button>
        //                 <button id="option2" class="btn btn-secondary small">Agregar Recurso <br> Especial</button>
        //             `,
        //             showConfirmButton: false,
        //             didRender: () => {
        //                 document.getElementById('option1').addEventListener('click', () => {
        //                     window.location.href = 'https://example.com/opcion1';
        //                 });
        //                 document.getElementById('option2').addEventListener('click', () => {
        //                     window.location.href = 'https://example.com/opcion2';
        //                 });
        //             }
        //         });
        //     }
        // });
    }
    return (
        <div className="ps-3  mt-5 color-fondo pt-3 pe-3">
            <div className="d-flex align-items-center mb-3">
                <h2 className="me-3 text-light">Agregar Solicitud
                    <a className="ps-3" onClick={agregarSolicitud}><i className="bi bi-plus-circle-fill text-success"></i></a>
                </h2>
            </div>
            <div className="mb-3">
                <div className="row g-3 align-items-center">
                    <div className="col-md-6">
                        <p className="text-light fs-5">Seleccione servicio:</p>
                        <select className="form-select">
                            <option value="1">Servicio 1</option>
                            <option value="2">Servicio 2</option>
                            <option value="3">Servicio 3</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <p className="text-light fs-5">Digite el número de documento</p>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Documento" />
                            <button className="btn btn-primary ">buscar <i className="bi bi-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <select className="form-select mb-3">
                        <option value="1">Seleccione Tipo de Recurso</option>
                        <option value="2">Opción 2</option>
                        <option value="3">Opción 3</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select className="form-select mb-3">
                        <option value="1">Estado De Solicitud</option>
                        <option value="2">Opción B</option>
                        <option value="3">Opción C</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <input type="date" className="form-control mb-3" />
                </div>
            </div>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr className="small">
                        <th scope="col">#</th>
                        <th scope="col">Cedula</th>
                        <th scope="col">Nombres Apellidos</th>
                        <th scope="col">Edad</th>
                        <th scope="col">Municipio</th>
                        <th scope="col">Clasificación TS</th>
                        <th scope="col">Aislamiento</th>
                        <th scope="col">Estrato SE</th>
                        <th scope="col">Recursos</th>
                        <th scope="col">Fecha y Hora</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Ejemplo 1</td>
                        <td>Descripción del ejemplo 1</td>
                        <td>Ejemplo 1</td>
                        <td>Descripción del ejemplo 1</td>
                        <td>Ejemplo 1</td>
                        <td>Descripción del ejemplo 1</td>
                        <td>Ejemplo 1</td>
                        <td>Descripción del ejemplo 1</td>
                        <td>Ejemplo 1</td>
                        <td>Descripción del ejemplo 1</td>
                        <td>
                            <div className="d-inline">
                                <a className="fs-5 text-success"><i className="bi bi-check-circle-fill"></i></a>
                                <a className="fs-5 text-danger"><i className="bi bi-x-circle-fill"></i></a>
                                <a className="fs-5 text-primary"><i className="bi bi-info-circle-fill"></i></a>
                                <a className="fs-5 text-warning"><i className="bi bi-arrow-clockwise"></i></a>
                                <a className="fs-5 text-info"><i className="bi bi-send-plus-fill"></i></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Ejemplo 2</td>
                        <td>Descripción del ejemplo 2</td>
                        <td>Ejemplo 2</td>
                        <td>Descripción del ejemplo 2</td>
                        <td>Ejemplo 2</td>
                        <td>Descripción del ejemplo 2</td>
                        <td>Ejemplo 2</td>
                        <td>Descripción del ejemplo 2</td>
                        <td>Ejemplo 2</td>
                        <td>Descripción del ejemplo 2</td>
                        <td>
                            <div className="d-inline">
                                <a className="fs-5 text-success"><i className="bi bi-check-circle-fill"></i></a>
                                <a className="fs-5 text-danger"><i className="bi bi-x-circle-fill"></i></a>
                                <a className="fs-5 text-primary"><i className="bi bi-info-circle-fill"></i></a>
                                <a className="fs-5 text-warning"><i className="bi bi-arrow-clockwise"></i></a>
                                <a className="fs-5 text-info"><i className="bi bi-send-plus-fill"></i></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Ejemplo 3</td>
                        <td>Descripción del ejemplo 3</td>
                        <td>Ejemplo 3</td>
                        <td>Descripción del ejemplo 3</td>
                        <td>Ejemplo 3</td>
                        <td>Descripción del ejemplo 3</td>
                        <td>Ejemplo 3</td>
                        <td>Descripción del ejemplo 3</td>
                        <td>Ejemplo 3</td>
                        <td>Descripción del ejemplo 3</td>
                        <td>
                            <div className="d-inline">
                                <a className="fs-5 text-success"><i className="bi bi-check-circle-fill"></i></a>
                                <a className="fs-5 text-danger"><i className="bi bi-x-circle-fill"></i></a>
                                <a className="fs-5 text-primary"><i className="bi bi-info-circle-fill"></i></a>
                                <a className="fs-5 text-warning"><i className="bi bi-arrow-clockwise"></i></a>
                                <a className="fs-5 text-info"><i className="bi bi-send-plus-fill"></i></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="mb-3">
                <div className="d-inline-block me-3">
                    <button className="btn btn-info fs-6">Solicitudes de <br /> Recursos Especiales</button>
                </div>
                <div className="d-inline-block mb-5">
                    <button className="btn btn-light fs-6">Convertir Datos a Excel<br /> <i className="bi bi-file-earmark-spreadsheet-fill"></i></button>
                </div>
            </div>
        </div>
    )
}
