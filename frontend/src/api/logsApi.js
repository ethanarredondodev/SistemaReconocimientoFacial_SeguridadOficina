// src/api/logsApi.js
import api from "./axios";

export const getLogs = async (params = {}) => {
    const response = await api.get("/access-logs", {
        params,
        paramsSerializer: (params) => {
            const parts = [];
            for (const key in params) {
                const value = params[key];
                if (Array.isArray(value)) {
                    value.forEach(v => parts.push(`${key}=${v}`));
                } else {
                    parts.push(`${key}=${value}`);
                }
            }
            return parts.join("&");
        }
    });
    return response.data;
};