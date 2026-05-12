import useIdleTimer from "../../hooks/useInactivity";
import { useDispatch } from "react-redux";
import { cerrarSesionAction } from "../../actions/loginActions";

export default function ProtectedWithIdle({ children }) {
  const dispatch = useDispatch();

  useIdleTimer(10 * 60 * 1000, () => {
    localStorage.setItem("sessionExpiredReason", "inactivity");
    dispatch(cerrarSesionAction());
  });
  
  return (
    <>
      {children}
    </>
  );
}