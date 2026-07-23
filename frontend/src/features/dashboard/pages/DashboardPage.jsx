import useDashboard from "../hooks/useDashboard";
import { useAuthStore } from "../../../store/authStore";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

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

const DonaChart = ({ metrics }) => {
    const data = [
        { name: "Permitidos", value: metrics.accesses_today - metrics.denied_today },
        { name: "Denegados", value: metrics.denied_today }
    ];
    const COLORS = ["#40c057", "#fa5252"];

    return (
        <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            flex: 1
        }}>
            <h3 style={{ color: "#1e1e2e", fontSize: "15px", margin: "0 0 16px" }}>
                Resultado de accesos hoy
            </h3>
            {data[0].value === 0 && data[1].value === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>
                    Sin registros hoy
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                        />
                        <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

const HorizontalBarChart = ({ title, data, color }) => (
    <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        flex: 1
    }}>
        <h3 style={{ color: "#1e1e2e", fontSize: "15px", margin: "0 0 16px" }}>
            {title}
        </h3>
        {data.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>
                Sin datos disponibles
            </p>
        ) : (
            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#555" }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                        tickFormatter={(val) => val.length > 12 ? val.slice(0, 12) + "..." : val}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                        formatter={(value) => [value, "Accesos"]}
                    />
                    <Bar dataKey="total" fill={color} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        )}
    </div>
);

const DashboardPage = () => {
    const { metrics, weeklyStats, topOffices, topUsers, loading, error, refetch } = useDashboard();
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
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px"
            }}>
                <div>
                    <h2 style={{ color: "#1e1e2e", fontSize: "24px", marginBottom: "4px" }}>
                        Dashboard
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        Bienvenido, {admin?.full_name}
                    </p>
                </div>

                <button
                    onClick={refetch}
                    disabled={loading}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 18px",
                        background: loading ? "#f5f5f5" : "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: loading ? "#aaa" : "#555",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                    }}
                >
                    <span style={{
                        display: "inline-block",
                        animation: loading ? "spin 1s linear infinite" : "none"
                    }}>
                        🔄
                    </span>
                    {loading ? "Actualizando..." : "Actualizar"}
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

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

            {/* Gráfico semanal */}
            <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>
                <h3 style={{ color: "#1e1e2e", fontSize: "16px", margin: "0 0 24px" }}>
                    Accesos de la última semana
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={weeklyStats}
                        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12, fill: "#888" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "#888" }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #f0f0f0",
                                fontSize: "13px"
                            }}
                            formatter={(value, name) => [
                                value,
                                name === "permitted" ? "Permitidos" : "Denegados"
                            ]}
                            labelFormatter={(label, payload) => {
                                const item = payload?.[0]?.payload;
                                return item ? `${label} ${item.date}` : label;
                            }}
                        />
                        <Legend
                            formatter={(value) =>
                                value === "permitted" ? "Permitidos" : "Denegados"
                            }
                            iconType="circle"
                            iconSize={8}
                        />
                        <Bar dataKey="permitted" fill="#40c057" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="denied" fill="#fa5252" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
                flexWrap: "wrap"
            }}>
                <DonaChart metrics={metrics} />
                <HorizontalBarChart
                    title="Top 5 oficinas con más accesos"
                    data={topOffices}
                    color="#4f6ef7"
                />
                <HorizontalBarChart
                    title="Top 5 usuarios con más accesos"
                    data={topUsers}
                    color="#845ef7"
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
                            metrics.recent_logs.map((log) => {
                                const hour = new Date(log.access_time).getHours();
                                const isAlert = log.user === "Desconocido" || hour >= 18;

                                return (
                                    <tr key={log.id} style={{
                                        borderBottom: "1px solid #f9f9f9",
                                        background: isAlert ? "#ffe4e4" : "white"
                                    }}>
                                        <td style={{ padding: "14px 24px", fontSize: "14px", color: isAlert ? "#fa5252" : "#1e1e2e" }}>
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
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardPage;