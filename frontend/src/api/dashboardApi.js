import api from "./axios";

export const getMetrics = async () => {
    const response = await api.get("/dashboard/metrics");
    return response.data;
};