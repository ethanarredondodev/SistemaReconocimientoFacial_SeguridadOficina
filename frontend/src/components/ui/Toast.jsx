const Toast = ({ toasts, onRemove }) => (
    <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999
    }}>
        {toasts.map(toast => (
            <div
                key={toast.id}
                style={{
                    padding: "14px 18px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    minWidth: "280px",
                    maxWidth: "400px",
                    animation: "slideIn 0.2s ease",
                    background: toast.type === "error" ? "#fff0f0"
                        : toast.type === "success" ? "#ebfbee"
                        : "#f0f4ff",
                    color: toast.type === "error" ? "#fa5252"
                        : toast.type === "success" ? "#40c057"
                        : "#4f6ef7",
                    border: `1px solid ${
                        toast.type === "error" ? "#ffc9c9"
                        : toast.type === "success" ? "#b2f2bb"
                        : "#bac8ff"
                    }`
                }}
            >
                <span>
                    {toast.type === "error" ? "❌"
                        : toast.type === "success" ? "✅"
                        : "ℹ️"}
                </span>
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button
                    onClick={() => onRemove(toast.id)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "inherit",
                        fontSize: "16px",
                        padding: 0,
                        opacity: 0.6
                    }}
                >
                    ×
                </button>
            </div>
        ))}

        <style>{`
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `}</style>
    </div>
);

export default Toast;