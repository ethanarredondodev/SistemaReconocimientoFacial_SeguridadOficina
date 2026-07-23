import { useState, useEffect } from "react";
import { getMetrics, getWeeklyStats, getTopOffices, getTopUsers } from "../../../api/dashboardApi";

const useDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [topOffices, setTopOffices] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const [metricsData, weeklyData, officesData, usersData] = await Promise.all([
                getMetrics(),
                getWeeklyStats(),
                getTopOffices(),
                getTopUsers()
            ]);
            setMetrics(metricsData);
            setWeeklyStats(weeklyData);
            setTopOffices(officesData);
            setTopUsers(usersData);
        } catch (err) {
            setError("Error al cargar las métricas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    return { metrics, weeklyStats, topOffices, topUsers, loading, error, refetch: fetchMetrics };
};

export default useDashboard;