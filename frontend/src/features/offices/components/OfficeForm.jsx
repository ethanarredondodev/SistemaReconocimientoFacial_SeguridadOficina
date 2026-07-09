import { useState } from "react";

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

const OfficeForm = ({ onSubmit, onCancel, initial = null }) => {
    const [name, setName] = useState(initial?.name || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ name, description });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>

                <div>
                    <label style={labelStyle}>Nombre de la oficina</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Almacén"
                        required
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción de la oficina..."
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
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

export default OfficeForm;