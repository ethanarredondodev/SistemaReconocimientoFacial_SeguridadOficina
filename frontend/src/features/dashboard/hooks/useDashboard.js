import { useState, useEffect } from "react";
import { getMetrics } from "../../../api/dashboardApi";

const useDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const data = await getMetrics();
            setMetrics(data);
        } catch (err) {
            setError("Error al cargar las métricas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    return { metrics, loading, error, refetch: fetchMetrics };
};

export default useDashboard;