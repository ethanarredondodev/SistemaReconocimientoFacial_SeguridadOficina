import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { loginAdmin } from "../../../api/authApi";

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const data = await loginAdmin(email, password);
            if (data.user.role.name !== "admin") {
                setError("No tienes permisos para acceder al panel");
                return;
            }
            setAuth(data.access_token, data.user);
            navigate("/admin/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.detail || "Error al iniciar sesión"
            )
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        const clearAuth = useAuthStore.getState().clearAuth;
        clearAuth();
        navigate("/admin/login");
    }

    return { login, logout, loading, error };
};

export default useAuth