import { MESAPROCESOS_ACTUALIZAR_PROCESO_DE_AREA, MESAPROCESOS_ACTUALIZAR_SUBPROCESOS_DE_PROCESO, MESAPROCESOS_ACTUALIZAR_USUARIO_DE_AREA, MESAPROCESOS_AGREGAR_PROCESO_A_AREA, MESAPROCESOS_AGREGAR_SUBPROCESO_A_PROCESO, MESAPROCESOS_AGREGAR_USUARIO_A_AREA, MESAPROCESOS_ELIMINAR_USUARIO_DE_AREA } from "../types";

export function mesadeprocesosReducer(state = {areas: []}, action) {
    
    switch (action.type) {

        case MESAPROCESOS_AGREGAR_USUARIO_A_AREA:{
            const areaExiste = state.areas.find(area => area.id == action.payload.id);
            if(areaExiste){
                return {
                    ...state, 
                        areas: state.areas.map(area =>
                            area.id === action.payload.id ? {...area, usuarios: [...area.usuarios, action.payload.usuarios]} : area
                        )
                };
            }else {
                return {...state, areas: [...state.areas, action.payload] };
            }
        }
        
        case MESAPROCESOS_ACTUALIZAR_USUARIO_DE_AREA: {
            return {
                ...state,
                areas: state.areas.map(area => {
                    return {
                        ...area,
                        usuarios: area.usuarios.map(usuario => {
                            
                            return usuario.id === action.payload.id ? { ...usuario, ...action.payload } : usuario;
                        })
                    };
                })
            };
        }

        case MESAPROCESOS_AGREGAR_PROCESO_A_AREA: {
            const areaExiste = state.areas.find(area => area.id == action.payload.id);
            if(areaExiste){
                return {
                    ...state, 
                        areas: state.areas.map(area => 
                            area.id === action.payload.id ? {...area, procesos: [...area.procesos, action.payload.procesos]} : area
                        )
                };
            }else{
                return {...state, areas: [...state.areas, action.payload] };
            }            
        }

        case MESAPROCESOS_ACTUALIZAR_PROCESO_DE_AREA:{
            return {
                ...state,
                    areas: state.areas.map(area => {
                        if(area.id === action.payload.idarea){
                            return {
                                ...area, 
                                    procesos: area.procesos.map(proceso => 
                                        proceso.id === action.payload.id ? {...proceso, ...action.payload} : proceso
                                    )
                            };
                        }
                        return area;
                    })
            };
        }

        case MESAPROCESOS_ACTUALIZAR_SUBPROCESOS_DE_PROCESO: {
            return {
                ...state,
                    areas: state.areas.map(area => {
                        return {
                            ...area,
                            procesos: area.procesos.map(proceso => {
                                if(proceso.id == action.payload.idproceso){
                                    return {
                                        ...proceso, subprocesos: proceso.subprocesos.map(subproceso => 
                                            subproceso.id === action.payload.id ? {...subproceso, ...action.payload} : subproceso
                                        )
                                    };
                                }  
                                return proceso;
                            })
                        };
                    })
            }
        }

        case MESAPROCESOS_AGREGAR_SUBPROCESO_A_PROCESO: {
            const {id, subprocesos } = action.payload;
            return {
                ...state,
                    areas: state.areas.map(area => {
                        return {
                            ...area,
                            procesos: area.procesos.map(proceso => {
                                if(proceso.id == id){
                                    return {
                                        ...proceso, subprocesos: [...(proceso.subprocesos || []), ...subprocesos] // Asegurarse de que subprocesos siempre sea un array
                                    };
                                }
                                return proceso;
                            })
                        };
                    })
            };
        }

        case MESAPROCESOS_ELIMINAR_USUARIO_DE_AREA: {
            return {
                ...state,
                areas: state.areas.map(area => {
                    if (area.id === action.payload.id) {
                        // Validamos que usuarios sea un array antes de aplicar filter
                        const usuarios = Array.isArray(area.usuarios) ? area.usuarios : [];
                        return {
                            ...area,
                            usuarios: usuarios.filter(usuario => usuario.id !== action.payload.usuarios.id)
                        };
                    }
                    return area; // Si el área no coincide, devolverla sin cambios
                })
            };
        }

        
        default:
            return state;
    }
}