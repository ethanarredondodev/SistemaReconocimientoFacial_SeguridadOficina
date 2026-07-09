import { useState, useEffect } from "react";

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fafafa"
};

const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    color: "#666",
    fontWeight: "500"
};

const UserForm = ({ onSubmit, onCancel, roles, initial = null }) => {
    const [fullName, setFullName] = useState(initial?.full_name || "");
    const [email, setEmail] = useState(initial?.email || "");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(initial?.role?.id || "");
    const [faceImage, setFaceImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (faceImage) {
            const url = URL.createObjectURL(faceImage);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [faceImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        if (fullName) formData.append("full_name", fullName);
        if (email) formData.append("email", email);
        if (password) formData.append("password", password);
        if (roleId) formData.append("role_id", roleId);
        if (faceImage) formData.append("face_image", faceImage);

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>

                <div>
                    <label style={labelStyle}>Nombre completo</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Pérez"
                        required={!initial}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="juan@comprafacil.com"
                        required={!initial}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>
                        {initial ? "Nueva contraseña (opcional)" : "Contraseña"}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required={!initial}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Rol</label>
                    <select
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required={!initial}
                        style={{ ...inputStyle, cursor: "pointer" }}
                    >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>
                        {initial ? "Imagen facial (opcional)" : "Imagen facial"}
                    </label>

                    {/* Preview */}
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: "100%",
                                height: "160px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginBottom: "8px"
                            }}
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFaceImage(e.target.files[0])}
                        required={!initial}
                        style={{ fontSize: "13px", color: "#666" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: "11px",
                            background: "white",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            cursor: "pointer",
                            color: "#555"
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "11px",
                            background: loading ? "#aaa" : "#4f6ef7",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "600"
                        }}
                    >
                        {loading ? "Guardando..." : initial ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default UserForm;