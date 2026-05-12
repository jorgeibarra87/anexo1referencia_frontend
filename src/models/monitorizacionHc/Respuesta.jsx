import Pregunta from "./Pregunta";

class Respuesta{
    constructor(data = {}){
        this.pregunta = new Pregunta(data.pregunta);
        this.respuesta = data.respuesta;
        this.fechaEvaluacion = data.fechaEvaluacion || null;
    }
}

export default Respuesta;