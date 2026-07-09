import api from "./axios"

export const loginForSetup = async (email, password) => {
    const formData = new FormData();
    formData.append("username", email)
    formData.append("password", password)

    const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })

    return response.data
}

export const getOffices = async () => {
    const response = await api.get("/offices");
    return response.data
}

export const verifyFace = async (officeId, imageBlod) => {
    const formData = new FormData();
    formData.append("office_id", officeId);
    formData.append("image", imageBlod, "capture.jpg");

    const response = await api.post("/face-access/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })

    return response.data;
}