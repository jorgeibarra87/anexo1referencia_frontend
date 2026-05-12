class Paciente{
    constructor(data = {}){
        this.fechaNacimiento = data.fechaNacimiento;
        this.apellidos = data.apellidos;
        this.documento = data.documento;
        this.genero = data.genero;
        this.nombreCompleto = data.nombreCompleto;
        this.nombres = data.nombres;
    }
}

export default Paciente;