import { INNPRODUC_NO_DATA, INNPRODUC_OBTENER } from "../types";

export const innoproducInitialState = {
    innproduc: {
        iprcodigo: '',
        iprcostpe: 0,
        iprdescor: '',
        iprulcope: 0,
        oid: 0
    }
};

export function innproducReducer(state = innoproducInitialState, action) {
    switch (action.type) {
        case INNPRODUC_OBTENER:{
            return{
                ...state, innproduc: action.payload,
            }
        }
        case INNPRODUC_NO_DATA:
            return innoproducInitialState;
        default:
            return state;
    }
}
