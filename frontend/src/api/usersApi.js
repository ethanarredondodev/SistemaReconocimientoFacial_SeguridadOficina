import api from './axios';

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
}

export const createUser = async (formData) => {
    const response = await api.post("/users/register", formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return response.data;
}

export const updateUser = async (id, formData) => {
    const response = await api.patch(`/users/${id}`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}/deactivate`);
    return response.data;
}