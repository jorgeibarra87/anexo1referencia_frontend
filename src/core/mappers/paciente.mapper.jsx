/**
 * Transforma y normaliza la respuesta de dinamica.
 * @param {object} rawData - Datos crudos de la primera petición.
 * @returns {object} Objeto con estructura uniforme.
 */
export const mapearPacienteDinamica = (rawData) => {
    if (!rawData) return null;

    // Función auxiliar para calcular la edad (simplificada)
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return null;
        const dob = new Date(fechaNacimiento);
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    };
    
    return {
        // Mapeo de campos
        id: rawData.id,
        tipoDocumento: rawData.pacTipDoc,
        documento: rawData.pacNumDoc,
        primerNombre: rawData.pacPriNom,
        segundoNombre: rawData.pacSegNom, // Manejo de posibles etiquetas
        nombres: rawData.nombres,
        primerApellido: rawData.pacPriApe,
        segundoApellido: rawData.pacSegApe,
        apellidos: rawData.apellidos,
        nombreCompleto: rawData.gpaNomCom, // o construirlo: `${rawData.pacPriNom} ${rawData.pacPriApe}`
        genero: rawData.genero,
        sexo: rawData.gpaSexPac,
        edad: calcularEdad(rawData.gpaFecNac), 
        email: rawData.gpaEmail,
        fechaNacimiento: rawData.gpaFecNac,
        estadoCivil: rawData.gpaEstCiv,
    };
};

/**
 * Transforma y normaliza la respuesta del Microservicio 2 (asume que toma el primer elemento del array).
 * @param {array} rawArray - Array de datos crudos de la segunda petición.
 * @returns {object} Objeto con estructura uniforme.
 */
export const mapearPacienteReferencia = (rawArray) => {
    if (!rawArray || rawArray.length === 0) return null;

    const rawData = rawArray[0]; // Tomamos el primer elemento del array

    // Asumimos que los campos 'nombres' y 'apellidos' pueden estar separados por espacio, o ya vienen con los nombres completos
    const nombres = rawData.nombres ? rawData.nombres.split(' ') : ['', ''];
    const apellidos = rawData.apellidos ? rawData.apellidos.split(' ') : ['', ''];

    return {
        // Mapeo de campos
        id: rawData.id,
        tipoDocumento: null, // Si no está disponible en MS2
        numeroDocumento: rawData.identificacion,
        primerNombre: nombres[0],
        segundoNombre: nombres[1] || '',
        nombres: rawData.nombres,
        primerApellido: apellidos[0],
        segundoApellido: apellidos[1] || '',
        apellidos: rawData.apellidos,
        nombreCompleto: `${rawData.nombres} ${rawData.apellidos}`, // Construcción simple
        genero: rawData.sexo,
        edad: rawData.edad, 
        email: null,
        fechaNacimiento: null,
    };
};