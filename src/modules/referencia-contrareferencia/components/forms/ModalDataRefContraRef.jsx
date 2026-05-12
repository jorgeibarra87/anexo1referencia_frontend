import ListaColapsable from "../../../../components/utilities/ListaColapsable";
import TextoColapsable from "../../../../components/utilities/TextoColapsable"

export default function ModalDataRefContraRef({ handleClose, data }) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300`}> {/**${show ? 'opacity-100 visible' : 'opacity-0 invisible'} */}
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-6xl h-[90vh] relative flex flex-col" >  {/** onClick={(e) => e.stopPropagation()} */}
                {/* Encabezado del Modal */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-xl font-semibold text-gray-800">Sincronizar usuario</span>
                    <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Cuerpo del Modal */}
                <div className="p-4">
                    <div className="overflow-x-auto shadow-md rounded-lg pb-4">
                        <div className="overflow-y-auto  max-h-[65vh]">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">NUMERO CONSECUTIVO DE REFERENCIA</th>
                                        <th scope="col" className="px-6 py-3">FECHA DE COMENTARIO</th>
                                        <th scope="col" className="px-6 py-3">FECHA Y HORA ULTIMA ACTUALIZACIÓN</th>
                                        <th scope="col" className="px-6 py-3">NOMBRES</th>
                                        <th scope="col" className="px-6 py-3">APELLIDOS</th>
                                        <th scope="col" className="px-6 py-3">IDENTIFICACION</th>
                                        <th scope="col" className="px-6 py-3">EDAD</th>
                                        <th scope="col" className="px-6 py-3">SEXO</th>
                                        <th scope="col" className="px-6 py-3">ENTIDAD DE SEGURIDAD SOCIAL</th>
                                        <th scope="col" className="px-6 py-3">NOMBRE DEL HOSPITAL QUE SOLICITA LA REMISION</th>
                                        <th scope="col" className="px-6 py-3">MEDICO QUE SOLICIA LA REMISION</th>
                                        <th scope="col" className="px-6 py-3">ESPECILIDAD QUE SOLICITA LA REMISION</th>
                                        <th scope="col" className="px-6 py-3">DIAGNOSTICO DEL PACIENTE SEGUN REMISION</th>
                                        <th scope="col" className="px-6 py-3">NOMBRE QUIEN RECIBE COMENTARIO EN REFERENCIA</th>
                                        <th scope="col" className="px-6 py-3">OBSERVACIONES</th>
                                        <th scope="col" className="px-6 py-3">FC</th>
                                        <th scope="col" className="px-6 py-3">FR</th>
                                        <th scope="col" className="px-6 py-3">TA</th>
                                        <th scope="col" className="px-6 py-3">TEMPERATURA</th>
                                        <th scope="col" className="px-6 py-3">SO2</th>
                                        <th scope="col" className="px-6 py-3">GLASGOW</th>
                                        <th scope="col" className="px-6 py-3">ESCALA DE DOLOR VISUAL /10</th>
                                        <th scope="col" className="px-6 py-3">REQUIERE AISLAMIENTO</th>
                                        <th scope="col" className="px-6 py-3">ENVIADA COMO URGENCIA VITAL</th>
                                        <th scope="col" className="px-6 py-3">CAUSA DE REMISION A NIVEL lll</th>
                                        <th scope="col" className="px-6 py-3">ACEPTADA</th>
                                        <th scope="col" className="px-6 py-3">NUMERO DE CODIGO</th>
                                        <th scope="col" className="px-6 py-3">CAUSA DE RECHAZO</th>
                                        <th scope="col" className="px-6 py-3">NOMBRE DEL MEDICO QUE REGISTRA LA DECISION</th>
                                        <th scope="col" className="px-6 py-3">INGRESOS EN HUSJ</th>
                                        <th scope="col" className="px-6 py-3">Comentario triage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((d) => (
                                        <tr key={d.id} className="bg-white border-b hover:bg-gray-50">
                                            <th className="px-6 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">{d.id}</th>
                                            <td className="px-6 py-2 text-xs">{d.fechaComentario}</td>
                                            <td className="px-6 py-2 text-xs">{new Date(d.fecha).toLocaleTimeString()}</td>
                                            <td className="px-6 py-2 text-xs">{d.nombres}</td>
                                            <td className="px-6 py-2 text-xs">{d.apellidos}</td>
                                            <td className="px-6 py-2 text-xs">{d.identificacion}</td>
                                            <td className="px-6 py-2 text-xs">{d.edad}</td>
                                            <td className="px-6 py-2 text-xs">{d.sexo}</td>
                                            <td className="px-6 py-2 text-xs">{d.entidadSocial}</td>
                                            <td className="px-6 py-2 text-xs">{d.hospital.nombre}</td>
                                            <td className="px-6 py-2 text-xs">{d.medicoSolicitanteRemision}</td>
                                            <td className="px-6 py-2 text-xs">{d.especialidadSolicitanteRemision}</td>
                                            <td className="px-6 py-2 text-xs">
                                                <TextoColapsable texto={d.diagnosticoRemision} limite={100} />
                                            </td>
                                            <td className="px-6 py-2 text-xs">{d.nombrePersonaRecibeComentario}</td>
                                            <td className="px-6 py-2 text-xs whitespace-pre-wrap">
                                                <TextoColapsable texto={d.observaciones} limite={100} />
                                            </td>
                                            <td className="text-center py-2 text-xs">{d.fc}</td>
                                            <td className="text-center py-2 text-xs">{d.fr}</td>
                                            <td className="text-center py-2 text-xs">{d.ta}</td>
                                            <td className="text-center py-2 text-xs">{d.temperatura}</td>
                                            <td className="text-center py-2 text-xs">{d.sodos}</td>
                                            <td className="text-center py-2 text-xs">{d.glasgow}</td>
                                            <td className="text-center py-2 text-xs">{d.escalaDolorVisual}</td>
                                            <td className="text-center py-2 text-xs">{d.requiereAislamiento === true ? 'SI' : 'NO'}</td>
                                            <td className="text-center py-2 text-xs">{d.enviadaUrgenciaVital === true ? 'SI' : 'NO'}</td>
                                            <td className="text-center py-2 text-xs">{d.causaRemisionNivelLLL}</td>
                                            <td className="text-center py-2 text-xs">{d.estado === true ? 'ACEPTADA' : 'RECHAZADA'}</td>
                                            <td className="text-center py-2 text-xs">{d.id}</td>
                                            <td className="text-center py-2 text-xs">{d.causaRechazo}</td>
                                            <td className="text-center py-2 text-xs">{d.nombreMedicoRegistraDecision}</td>
                                            <td className="py-2 text-xs text-center">
                                                <ListaColapsable items={d.ingresos.map(ingreso => (ingreso.fechaIngreso))} limite={3} 
                                                    renderItem={(fecha, idx) => {
                                                    const fechaComentario = new Date(d.fechaComentario);
                                                    const fechaIngreso = new Date(fecha);
                                                    const isAfter = fechaIngreso >= fechaComentario;

                                                    return (
                                                        <span key={idx}
                                                        className={`px-2 py-1 rounded-md text-xs border ${
                                                            isAfter ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`} >
                                                        {fecha}
                                                        </span>
                                                    );
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-2 text-xs">
                                                {d.observacionTriage == null || d.observacionTriage === '' ? (<span className="text-gray-500 italic">Sin observación registrada</span>
                                                ) : (d.observacionTriage)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
