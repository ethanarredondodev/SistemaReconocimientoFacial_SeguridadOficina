import api from "./api";

export const login = async (
    email, 
    password
) => {

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await api.post("/auth/login/", formData);
    return response.data;
}