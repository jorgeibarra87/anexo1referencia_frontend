import { combineReducers } from "redux";
import { loginReducer } from "./loginReducer";
import { sidebarReducer } from "./sidebarReducer";
import { innproducReducer } from "./innproducReducer";
import { mesadeprocesosReducer} from "./mesadeprocesosReducer";
import { areaservicioReducer } from "./areaservicioReducer";

const reducer = combineReducers({
    login: loginReducer,
    sidebar: sidebarReducer,
    innproduc: innproducReducer,
    areaservicio: areaservicioReducer,
    mesadeprocesos: mesadeprocesosReducer,
})

export default reducer;