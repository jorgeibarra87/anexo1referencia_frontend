import { MOSTRAR_BARRA_LATERAL, OCULTAR_BARRA_LATERAL } from "../types";

export const sidebarInitialState = {
    state: false
};
export function sidebarReducer (state = sidebarInitialState, action){
    switch (action.type) {
        case OCULTAR_BARRA_LATERAL:{
            return {
                state: true
            }
        }
        case MOSTRAR_BARRA_LATERAL:
            return{
                state: false
            }    
        default:
            return state;
    }
}