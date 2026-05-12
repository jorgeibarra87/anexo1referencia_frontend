import { useEffect, useState } from "react";
import { obtenerAdnIngreso } from "../../api/dinamica/adnIngresoService";
import AdnIngreso from "../../models/dinamica/AdnIngreso";

const useAdnIngreso = () => {
    const [adnIngreso, setAdnIngreso] = useState(new AdnIngreso());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAdnIngreso = async (idAdnIngreso) => {
        setLoading(true);
        setError(null);
        try {
            const adnIngresoData = await obtenerAdnIngreso(idAdnIngreso);
            setAdnIngreso(new AdnIngreso(adnIngresoData));
        } catch (error) {
            setError(error);          
        }finally {
            setLoading(false);
        }
    }
    
    return {adnIngreso, setAdnIngreso, loadingAdnI: loading, fetchAdnIngreso, error};
};

export default useAdnIngreso;