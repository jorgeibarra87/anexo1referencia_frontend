import { useState } from "react";
import { obtenerRolesPorMicroservicio } from "../../api/authservice/rolesServiceApiAuth";

const useFetchRolesByMicroservice = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRolesByMycroservice = async (nameMicroservice) => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerRolesPorMicroservicio(nameMicroservice);
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, error, fetchRolesByMycroservice };
}

export default useFetchRolesByMicroservice;