import api from "./axios";

// Rol-Oficina
export const getRoleOffices = async () => {
    const response = await api.get("/role-offices");
    return response.data;
};

export const createRoleOffice = async (data) => {
    const response = await api.post("/role-offices", data);
    return response.data;
};

export const deleteRoleOffice = async (id) => {
    const response = await api.delete(`/role-offices/${id}`);
    return response.data;
};

// Usuario-Oficina
export const getUserOffices = async () => {
    const response = await api.get("/user-offices");
    return response.data;
};

export const createUserOffice = async (data) => {
    const response = await api.post("/user-offices", data);
    return response.data;
};

export const deleteUserOffice = async (id) => {
    const response = await api.delete(`/user-offices/${id}`);
    return response.data;
};