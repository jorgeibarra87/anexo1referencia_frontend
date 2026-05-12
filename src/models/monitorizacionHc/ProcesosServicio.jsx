class ProcesosServicio {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || null;
    this.tipo = data.tipo || null;
  }
}

export default ProcesosServicio;
