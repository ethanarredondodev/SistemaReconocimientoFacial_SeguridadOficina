import { useState } from "react";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
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
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                width: "100%",
                maxWidth: "380px"
            }}>
                <h2 style={{ marginBottom: "8px" }}>COMPRAFÁCIL</h2>
                <p style={{ color: "#888", marginBottom: "32px" }}>
                    Panel de administración
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@comprafacil.com"
                            required
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "red", fontSize: "13px", marginBottom: "16px" }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: loading ? "#aaa" : "#1e1e2e",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;