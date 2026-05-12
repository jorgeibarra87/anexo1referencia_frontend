import Paciente from "./Paciente";
import Respuesta from "./Respuesta";

class Ingreso {
    constructor(data = {}){
        this.id = data.id ? String(data.id) : null;
        this.fechaIngreso = data.fechaIngreso;
        this.respuestas = data?.respuestas?.map(respuesta => new Respuesta(respuesta));
        this.paciente = new Paciente(data.paciente);
    }
}

export default Ingreso;