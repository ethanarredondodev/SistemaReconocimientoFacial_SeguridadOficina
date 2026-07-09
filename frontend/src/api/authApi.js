import api from "./axios";

export const loginAdmin = async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/login", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}