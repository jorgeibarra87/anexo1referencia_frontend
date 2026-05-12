import { jwtDecode } from "jwt-decode";
import { CERRAR_SESION, INICIAR_SESION, OBTENER_TOKEN } from "../types";

export const loginInitialState = {
    token: null,
    decodeToken: null,
}

export function loginReducer(state= loginInitialState, action){
    switch (action.type) {
        case INICIAR_SESION:{
            localStorage.setItem('tokenhusjp', action.payload.jwt);
            localStorage.setItem('tokenhusjp_refresh', action.payload.refreshToken)
            return {...state, token: action.payload.jwt, decodeToken: jwtDecode(action.payload.jwt)};
        }   

        case OBTENER_TOKEN:{
            if(state.token === null && localStorage.getItem('tokenhusjp')){
                return {...state, token: localStorage.getItem('tokenhusjp'), decodeToken: jwtDecode(localStorage.getItem('tokenhusjp'))};
            }
            return state;
        }

        case CERRAR_SESION:{
            localStorage.removeItem('tokenhusjp');
            localStorage.removeItem('tokenhusjp_refresh');
            return loginInitialState;
        }
        default:
            return state;
    }
}