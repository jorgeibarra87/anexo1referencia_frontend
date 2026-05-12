class GenPacien{
    constructor(data){
        this.id = data.id;
        this.documento = data.pacNumDoc || data.documento;
        this.nombres = data.nombres;
        this.apellidos = data.apellidos;
        this.fechaNacimiento = data.gpaFecNac || data.fechaNacimiento;
        this.nombreCompleto = data.nombreCompleto;
        this.genero = data.genero;
    }
}
export default GenPacien;