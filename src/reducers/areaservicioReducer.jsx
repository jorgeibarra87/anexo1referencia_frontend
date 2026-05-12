import { AREAS_SERVICIO_OBTENER } from "../types";

export function areaservicioReducer(state = {areasServicio: null}, action) {

    switch (action.type){
        case AREAS_SERVICIO_OBTENER:{
            return {
                ...state, areasServicio: action.payload
            }
        }
        default:
            return state;
    }

}