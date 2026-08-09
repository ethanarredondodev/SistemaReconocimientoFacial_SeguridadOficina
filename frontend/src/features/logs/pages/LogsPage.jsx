import useLogs from "../hooks/useLogs";

const resultBadge = (result) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: result === "PERMITIDO" ? "#ebfbee" : "#fff0f0",
    color: result === "PERMITIDO" ? "#40c057" : "#fa5252"
});

const selectStyle = {
    padding: "8px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "13px",
    background: "white",
    outline: "none",
    cursor: "pointer",
    color: "#555"
};

const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "13px",
    background: "white",
    outline: "none",
    color: "#555"
};

const LogsPage = () => {
    const {
        logs, users, offices,
        loading, error,
        filters, updateFilter, clearFilters
    } = useLogs();

    const hasActiveFilters = filters.user_id.length > 0 ||
        filters.include_unknown ||
        filters.office_id.length > 0 ||
        filters.result ||
        filters.start_date ||
        filters.end_date;

    if (error) return (
        <div style={{ color: "#fa5252", textAlign: "center", marginTop: "80px" }}>
            {error}
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ color: "#1e1e2e", fontSize: "24px", marginBottom: "4px" }}>
                    Registros de acceso
                </h2>
                <p style={{ color: "#888", fontSize: "14px" }}>
                    {logs.length} registros encontrados
                </p>
            </div>

            {/* Filtros */}
            <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "flex-end"
            }}>

                {/* Filtro usuario */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                        Usuario
                    </label>
                    <select
                        value=""
                        onChange={(e) => {
                            const val = e.target.value;

                            if (val === "unknown") {
                                updateFilter("include_unknown", true);
                            } else if (val !== "") {
                                const id = parseInt(val);
                                if (!filters.user_id.includes(id)) {
                                    updateFilter("user_id", [...filters.user_id, id]);
                                    // Al seleccionar primer usuario, desactiva include_unknown
                                    // SOLO si no había usuarios seleccionados antes
                                    if (filters.user_id.length === 0) {
                                        updateFilter("include_unknown", false);
                                    }
                                }
                            }
                        }}
                        style={selectStyle}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="unknown">Desconocidos</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.full_name}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro oficina */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                        Oficina
                    </label>
                    <select
                        value=""
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!filters.office_id.includes(val)) {
                                updateFilter("office_id", [...filters.office_id, val]);
                            }
                        }}
                        style={selectStyle}
                    >
                        <option value="">Todas</option>
                        {offices.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro resultado */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                        Resultado
                    </label>
                    <select
                        value={filters.result}
                        onChange={(e) => updateFilter("result", e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Todos</option>
                        <option value="PERMITIDO">Permitido</option>
                        <option value="DENEGADO">Denegado</option>
                    </select>
                </div>

                {/* Fecha inicio */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                        Desde
                    </label>
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => updateFilter("start_date", e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Fecha fin */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                        Hasta
                    </label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => updateFilter("end_date", e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        style={{
                            padding: "8px 14px",
                            background: "#fff0f0",
                            color: "#fa5252",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Tags de filtros activos */}
            {(filters.user_id.length > 0 || filters.office_id.length > 0 || filters.include_unknown) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {filters.user_id.map(id => {
                        const user = users.find(u => u.id === id);
                        return (
                            <span key={id} style={{
                                padding: "4px 10px",
                                background: "#f0f4ff",
                                color: "#4f6ef7",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                👤 {user?.full_name}
                                <button
                                    onClick={() => updateFilter("user_id", filters.user_id.filter(u => u !== id))}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#4f6ef7",
                                        padding: 0,
                                        fontSize: "14px",
                                        lineHeight: 1
                                    }}
                                >
                                    ×
                                </button>

                            </span>

                        );
                    })}
                    {filters.include_unknown && (
                        <span style={{
                            padding: "4px 10px",
                            background: "#fff9db",
                            color: "#f59f00",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}>
                            — Desconocidos
                            <button
                                onClick={() => updateFilter("include_unknown", false)}
                                style={{
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "#f59f00",
                                    padding: 0, fontSize: "14px", lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {filters.office_id.map(id => {
                        const office = offices.find(o => o.id === id);
                        return (
                            <span key={id} style={{
                                padding: "4px 10px",
                                background: "#f0fff4",
                                color: "#40c057",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                🏢 {office?.name}
                                <button
                                    onClick={() => updateFilter("office_id", filters.office_id.filter(o => o !== id))}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#40c057",
                                        padding: 0,
                                        fontSize: "14px",
                                        lineHeight: 1
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Tabla */}
            <div style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden"
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#fafafa" }}>
                            {["Usuario", "Oficina", "Resultado", "Confianza", "Fecha y hora", "Captura"].map(col => (
                                <th key={col} style={{
                                    padding: "12px 20px",
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
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{
                                    padding: "32px",
                                    textAlign: "center",
                                    color: "#aaa",
                                    fontSize: "14px"
                                }}>
                                    Cargando registros...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{
                                    padding: "32px",
                                    textAlign: "center",
                                    color: "#aaa",
                                    fontSize: "14px"
                                }}>
                                    No hay registros con los filtros aplicados
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => {
                                const hour = new Date(log.access_time).getHours();
                                const isAlert = !log.user || hour >= 19;

                                return (
                                    <tr key={log.id} style={{
                                        borderBottom: "1px solid #f9f9f9",
                                        background: isAlert ? "#fff5f5" : "white"
                                    }}>
                                        <td style={{
                                            padding: "14px 20px", fontSize: "14px", fontWeight: "500",
                                            color: isAlert ? "#fa5252" : "#1e1e2e"
                                        }}>
                                            {log.user?.full_name || (
                                                <span style={{ color: "#fa5252", fontStyle: "italic" }}>
                                                    Desconocido
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            {log.capture_image ? (
                                                <img
                                                    src={`http://localhost:8000/${log.capture_image}`}
                                                    alt="Captura"
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "8px",
                                                        objectFit: "cover",
                                                        cursor: "pointer",
                                                        border: "2px solid #ffc9c9"
                                                    }}
                                                    onClick={() => window.open(`http://localhost:8000/${log.capture_image}`, "_blank")}
                                                />
                                            ) : (
                                                <span style={{ color: "#ddd", fontSize: "12px" }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                            🏢 {log.office?.name}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={resultBadge(log.access_result)}>
                                                {log.access_result}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                            {log.confidence}%
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888" }}>
                                            {new Date(log.access_time).toLocaleString("es-PE")}
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

export default LogsPage;