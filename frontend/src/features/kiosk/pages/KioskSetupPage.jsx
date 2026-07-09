import { useState } from "react";
import useKiosk from "../hooks/useKiosk";

const KioskSetupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginSetup, selectOffice, offices, step, loading, error } = useKiosk();

    const handleLogin = async (e) => {
        e.preventDefault();
        await loginSetup(email, password);
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#1e1e2e",
        background: "#fafafa",
        boxSizing: "border-box",
        outline: "none"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        color: "#666",
        fontWeight: "500"
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
                maxWidth: "400px"
            }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        fontSize: "32px",
                        marginBottom: "8px"
                    }}>
                        🏢
                    </div>
                    <h2 style={{ color: "#1e1e2e", fontSize: "20px", marginBottom: "4px" }}>
                        COMPRAFÁCIL
                    </h2>
                    <p style={{ color: "#888", fontSize: "13px" }}>
                        {step === "login"
                            ? "Configuración del dispositivo"
                            : "Selecciona la oficina"}
                    </p>
                </div>

                {/* Step: Login */}
                {step === "login" && (
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={labelStyle}>
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@comprafacil.com"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: "#fff0f0",
                                border: "1px solid #ffc9c9",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                marginBottom: "16px"
                            }}>
                                <p style={{ color: "#fa5252", fontSize: "13px" }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "13px",
                                background: loading ? "#aaa" : "#4f6ef7",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 4px 12px rgba(79,110,247,0.3)"
                            }}
                        >
                            {loading ? "Verificando..." : "Ingresar"}
                        </button>
                    </form>
                )}

                {/* Step: Seleccionar oficina */}
                {step === "select" && (
                    <div>
                        {offices.map((office) => (
                            <button
                                key={office.id}
                                onClick={() => selectOffice(office.id, office.name)}
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    marginBottom: "10px",
                                    background: "white",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "10px",
                                    color: "#1e1e2e",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                    transition: "border 0.2s"
                                }}
                            >
                                <span style={{ fontSize: "18px" }}>🏢</span>
                                <div>
                                    <p style={{ fontWeight: "600", color: "#1e1e2e" }}>
                                        {office.name}
                                    </p>
                                    {office.description && (
                                        <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                                            {office.description}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "8px",
                                background: "transparent",
                                border: "none",
                                color: "#aaa",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            ← Volver al login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KioskSetupPage;