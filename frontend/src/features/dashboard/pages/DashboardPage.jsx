import useDashboard from "../hooks/useDashboard";
import { useAuthStore } from "../../../store/authStore";

const MetricCard = ({ label, value, sub, alert }) => (
    <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        flex: 1,
        minWidth: "180px"
    }}>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>{label}</p>
        <p style={{
            fontSize: "36px",
            fontWeight: "700",
            color: alert ? "#fa5252" : "#1e1e2e",
            margin: "0 0 4px"
        }}>
            {value}
        </p>
        {sub && <p style={{ color: "#aaa", fontSize: "12px" }}>{sub}</p>}
    </div>
);

const resultBadge = (result) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: result === "PERMITIDO" ? "#ebfbee" : "#fff0f0",
    color: result === "PERMITIDO" ? "#40c057" : "#fa5252"
});

const DashboardPage = () => {
    const { metrics, loading, error, refetch } = useDashboard();
    const admin = useAuthStore((state) => state.admin);

    if (loading) return (
        <div style={{ color: "#888", textAlign: "center", marginTop: "80px" }}>
            Cargando métricas...
        </div>
    );

    if (error) return (
        <div style={{ color: "#fa5252", textAlign: "center", marginTop: "80px" }}>
            {error}
            <br />
            <button onClick={refetch} style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#4f6ef7",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
            }}>
                Reintentar
            </button>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h2 style={{ color: "#1e1e2e", fontSize: "24px", marginBottom: "4px" }}>
                    Dashboard
                </h2>
                <p style={{ color: "#888", fontSize: "14px" }}>
                    Bienvenido, {admin?.full_name}
                </p>
            </div>

            {/* Métricas */}
            <div style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "32px"
            }}>
                <MetricCard
                    label="Usuarios activos"
                    value={metrics.total_users}
                    sub="registrados en el sistema"
                />
                <MetricCard
                    label="Accesos hoy"
                    value={metrics.accesses_today}
                    sub="intentos registrados"
                />
                <MetricCard
                    label="Denegados hoy"
                    value={metrics.denied_today}
                    sub="intentos fallidos"
                    alert={metrics.denied_today > 0}
                />
                <MetricCard
                    label="Oficinas activas"
                    value={metrics.total_offices}
                    sub="áreas registradas"
                />
            </div>

            {/* Últimos registros */}
            <div style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden"
            }}>
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h3 style={{ color: "#1e1e2e", fontSize: "16px", margin: 0 }}>
                        Últimos registros de acceso
                    </h3>
                    <button
                        onClick={refetch}
                        style={{
                            padding: "6px 12px",
                            background: "#f5f5f5",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#666",
                            cursor: "pointer"
                        }}
                    >
                        Actualizar
                    </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#fafafa" }}>
                            {["Usuario", "Oficina", "Hora", "Confianza", "Resultado"].map(col => (
                                <th key={col} style={{
                                    padding: "12px 24px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    color: "#888",
                                    fontWeight: "600",
                                    borderBottom: "1px solid #f0f0f0"
                                }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.recent_logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{
                                    padding: "32px",
                                    textAlign: "center",
                                    color: "#aaa",
                                    fontSize: "14px"
                                }}>
                                    No hay registros hoy
                                </td>
                            </tr>
                        ) : (
                            metrics.recent_logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "#1e1e2e" }}>
                                        {log.user}
                                    </td>
                                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "#555" }}>
                                        {log.office}
                                    </td>
                                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "#555" }}>
                                        {log.access_time}
                                    </td>
                                    <td style={{ padding: "14px 24px", fontSize: "14px", color: "#555" }}>
                                        {log.confidence}%
                                    </td>
                                    <td style={{ padding: "14px 24px" }}>
                                        <span style={resultBadge(log.access_result)}>
                                            {log.access_result}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardPage;