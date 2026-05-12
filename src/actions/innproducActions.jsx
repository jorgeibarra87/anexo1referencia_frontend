import { INNPRODUC_NO_DATA, INNPRODUC_OBTENER } from "../types";

export const innoProducObtener = (data) => ({type: INNPRODUC_OBTENER, payload: data});
export const innoProducNoData = () => ({type : INNPRODUC_NO_DATA});