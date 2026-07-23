import api from "./axios";

export const getMetrics = async () => {
    const response = await api.get("/dashboard/metrics");
    return response.data;
};

export const getWeeklyStats = async () => {
    const response = await api.get("/dashboard/weekly-stats");
    return response.data;
};

export const getTopOffices = async () => {
    const response = await api.get("/dashboard/top-offices");
    return response.data;
};

export const getTopUsers = async () => {
    const response = await api.get("/dashboard/top-users");
    return response.data;
};