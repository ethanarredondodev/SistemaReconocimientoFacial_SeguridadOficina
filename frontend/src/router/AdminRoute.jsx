import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}

export default AdminRoute;
