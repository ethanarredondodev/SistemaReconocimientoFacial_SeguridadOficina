import api from "./axios";

export const getOffices = async () => {
    const response = await api.get("/offices");
    return response.data;
};

export const createOffice = async (data) => {
    const response = await api.post("/offices", data);
    return response.data;
};

export const updateOffice = async (id, data) => {
    const response = await api.patch(`/offices/${id}`, data);
    return response.data;
};

export const deleteOffice = async (id) => {
    const response = await api.delete(`/offices/${id}/deactivate`);
    return response.data;
};