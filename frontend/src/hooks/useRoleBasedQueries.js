import { useEffect, useRef, useState } from "react";
import { permissionBasedAPIs } from "../utils/constants" 
import useRefreshToken from "./useRefreshToken";
import Loader from "../UI/Loaders/Loader";
const useRoleBasedQueries = (role, permission) => {
    const apiHooks = permissionBasedAPIs[permission][role];
    const refreshToken = useRefreshToken()
    const refreshCount = useRef(0);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    useEffect(()=>{
        const executeQuery = async () => {
            let queryResults = [];
            setLoading(true)
            for (const hook of apiHooks) {
                const result = await hook();
                if (result.error?.status === 401 && refreshCount.current < 1) {
                    refreshCount.current++;
                    await refreshToken.reAttemptLogin();
                    const retriedResult = await hook(); 
                    queryResults.push(retriedResult);
                } else {
                    queryResults.push(result);
                }
            }
            setResults(queryResults);
            setLoading(false)
        }
        executeQuery();  
    },[apiHooks, refreshCount, refreshToken]);
    if (loading) {
        return <Loader/>;
    }
    return { results };
}

export default useRoleBasedQueries