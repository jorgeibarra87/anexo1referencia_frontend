import ProcesosServicio from "./ProcesosServicio";

class UsuarioProcesoServicio {
  constructor(data = {}) {
    this.id = data.id || null;
    this.documento = data.documento || null;
    this.procesosServicios = data?.procesosServicios?.map(proser => new ProcesosServicio(proser)) || null;
  }
}
export default UsuarioProcesoServicio;
