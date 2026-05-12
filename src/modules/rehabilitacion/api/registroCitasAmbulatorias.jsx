import { obtenerCitasRehabilitacionPorMedico } from "../../../api/dinamica/citasRehabilitacion";
import apiClientRehabilitacion from "./apiClientRehabilitacion";

export const registrarllegadaCitaAmbulatoria = async (body) => {
    try {
        const response = await apiClientRehabilitacion.post(`llegada`, body);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la llegada de la cita ambulatoria', error);
        throw error;
    }
}

export const registrarInicioCitaAmbulatoria = async (id, body) => {
  try {
    const response = await apiClientRehabilitacion.patch(`${id}/iniciar`, body);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el inicio de la cita ambulatoria', error);
    throw error;
  }
}

export const registrarFinalizacionCitaAmbulatoria = async (id) => {
    try {
        const response = await apiClientRehabilitacion.patch(`${id}/finalizar`);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la finalización de la cita ambulatoria', error);
        throw error;
    }
}

export const registrarNoLLegadaCitaAmbulatoria = async (body) => {
    try {
        const response = await apiClientRehabilitacion.post(`nollegada`, body);
        return response.data;
    } catch (error) {
        console.error('Error al registrar la no llegada de la cita ambulatoria', error);
        throw error;
    }
}

export const obtenerCitasAmbulatoriasHoy = async () => {
    try {
        const response = await apiClientRehabilitacion.get(`hoy`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las citas ambulatorias de hoy', error);
        throw error;
    }
}

export const obtenerCitasConsolidadas = async (verTodo = false) => {
  try {
    const [citasRehab, citasAmbulatorias] = await Promise.all([
      obtenerCitasRehabilitacionPorMedico(verTodo),
      obtenerCitasAmbulatoriasHoy()
    ]);

    const mapaAmbulatorias = new Map();
    
    if (citasAmbulatorias && citasAmbulatorias.length > 0) {
      citasAmbulatorias.forEach(amb => {
        // Creamos una llave única: "DOCUMENTO_HORA" (ej: "123456_14:30:00")
        // Usamos horaProgramada que viene en la segunda petición
        const llave = `${amb.documentoPaciente}_${amb.horaProgramada}`;
        mapaAmbulatorias.set(llave, amb);
      });
    }

    const resultadoFinal = citasRehab.map(cita => {
      // Extraemos la hora de la fecha ISO de citasRehab (2026-01-14T03:52:28.425Z)
      // Necesitamos que el formato coincida con 'HH:mm:ss' de la segunda petición
      const horaCitaRehab = cita.appoinmentDate.split('T')[1].substring(0, 8);
      
      const llaveBusqueda = `${cita.patientId}_${horaCitaRehab}`;
      const datosAmbulatorios = mapaAmbulatorias.get(llaveBusqueda);

      return {
        ...cita,
        id: datosAmbulatorios ? datosAmbulatorios.id : cita.id,
        estadoSesion: datosAmbulatorios?.estadoSesion || 'PENDIENTE_DE_LLEGADA',
        llegadaTardia: datosAmbulatorios?.llegadaTardia || null,
      };
    });

    return resultadoFinal;
  } catch (error) {
    console.error("Error al cruzar las citas:", error);
    throw error;
  }
};