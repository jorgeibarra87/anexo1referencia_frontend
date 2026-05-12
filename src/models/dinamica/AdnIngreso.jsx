import GenPacien from "./GenPacien";

class AdnIngreso{
    constructor(data = {}){
        this.id = data.ainConSec || data.id || null;
        this.fechaIngreso = data.ainFecIng || data.fechaIngreso || null;
        this.paciente = data.genPacien ? new GenPacien(data.genPacien) : data.paciente ? new GenPacien(data.paciente) : null; // Evita crear un objeto si no hay datos válidos
    }
}

export default AdnIngreso;