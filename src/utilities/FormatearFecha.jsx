//creamos una funcion vara converir fechas en el formato '2024-08-28T21:53:36.991' a '28/08/2024 00:00:00' 
export const FormatearFecha = (fecha) => {
    if(fecha){
        const fechaFormateada = new Date(fecha);
        const dia = fechaFormateada.getDate();
        const mes = fechaFormateada.getMonth() + 1;
        const anio = fechaFormateada.getFullYear();
        const hora = fechaFormateada.getHours();
        const minutos = fechaFormateada.getMinutes();
        const segundos = fechaFormateada.getSeconds();
        return `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${anio} ${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    }
    return '';
}