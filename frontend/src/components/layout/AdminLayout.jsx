import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Usuarios", icon: "👤" },
    { path: "/admin/roles", label: "Roles", icon: "🛡️" },
    { path: "/admin/offices", label: "Oficinas", icon: "🏢" },
    { path: "/admin/permissions", label: "Permisos", icon: "🔑" },
    { path: "/admin/logs", label: "Registros", icon: "📋" },
];

const AdminLayout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate

    const handleLogout = () => {
        clearAuth();
        navigate("/admin/login")
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <aside style={{
                width: "220px",
                background: "#1e1e2e",
                color: "white",
                display: "flex",
                flexDirection: "column",
                padding: "24px 0"
            }}>
                <div style={{ padding: "0 24px 24px" }}>
                    <h2 style={{ margin: 0, fontSize: "16px" }}>COMPRAFÁCIL</h2>
                    <p style={{ margin: 0, fontSize: "12px" }}>Panel de administración</p>
                    <p style={{ margin: 0, fontSize: "16px"}}></p>
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px 24px",
                                color: isActive ? "white" : "rgba(255,255,255,0.5)",
                                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                textDecoration: "none",
                                fontSize: "14px"
                            })}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        margin: "0 16px",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "white",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Cerrar sesión
                </button>
            </aside>

            <main style={{
                flex: 1,
                background: "#f5f5f5",
                overflow: "auto",
                padding: "32px"
            }}>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout