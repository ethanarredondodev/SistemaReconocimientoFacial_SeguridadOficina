import { useState } from "react";
import usePermissions from "../hooks/usePermissions";

const Modal = ({ title, children }) => (
    <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px"
    }}>
        <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
        }}>
            <h3 style={{ margin: "0 0 24px", color: "#1e1e2e", fontSize: "18px" }}>
                {title}
            </h3>
            {children}
        </div>
    </div>
);

const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fafafa",
    cursor: "pointer"
};

const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    color: "#666",
    fontWeight: "500"
};

const PermissionsPage = () => {
    const {
        tab, setTab,
        roleOffices, userOffices,
        roles, offices, users,
        loading, error,
        modal, selected,
        handleCreateRoleOffice, handleCreateUserOffice, handleDelete,
        openDelete, closeModal,
        setModal
    } = usePermissions();

    const [roleId, setRoleId] = useState("");
    const [userId, setUserId] = useState("");
    const [officeId, setOfficeId] = useState("");

    const handleSubmitRoleOffice = async (e) => {
        e.preventDefault();
        await handleCreateRoleOffice({
            role_id: parseInt(roleId),
            office_id: parseInt(officeId)
        });
        setRoleId("");
        setOfficeId("");
    };

    const handleSubmitUserOffice = async (e) => {
        e.preventDefault();
        await handleCreateUserOffice({
            user_id: parseInt(userId),
            office_id: parseInt(officeId)
        });
        setUserId("");
        setOfficeId("");
    };

    if (loading) return (
        <div style={{ color: "#888", textAlign: "center", marginTop: "80px" }}>
            Cargando permisos...
        </div>
    );

    if (error) return (
        <div style={{ color: "#fa5252", textAlign: "center", marginTop: "80px" }}>
            {error}
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
            }}>
                <div>
                    <h2 style={{ color: "#1e1e2e", fontSize: "24px", marginBottom: "4px" }}>
                        Permisos
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        Gestiona el acceso de roles y usuarios a oficinas
                    </p>
                </div>
                <button
                    onClick={() => setModal("create")}
                    style={{
                        padding: "10px 20px",
                        background: "#4f6ef7",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    + Nuevo permiso
                </button>
            </div>

            {/* Pestañas */}
            <div style={{
                display: "flex",
                gap: "4px",
                marginBottom: "20px",
                background: "#f5f5f5",
                padding: "4px",
                borderRadius: "10px",
                width: "fit-content"
            }}>
                {[
                    { key: "roles", label: "Por Rol" },
                    { key: "users", label: "Por Usuario" }
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                            padding: "8px 20px",
                            background: tab === t.key ? "white" : "transparent",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: tab === t.key ? "600" : "400",
                            color: tab === t.key ? "#1e1e2e" : "#888",
                            cursor: "pointer",
                            boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                            transition: "all 0.2s"
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tabla Rol-Oficina */}
            {tab === "roles" && (
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#fafafa" }}>
                                {["Rol", "Oficina", "Acciones"].map(col => (
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
                            {roleOffices.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{
                                        padding: "32px",
                                        textAlign: "center",
                                        color: "#aaa",
                                        fontSize: "14px"
                                    }}>
                                        No hay permisos por rol registrados
                                    </td>
                                </tr>
                            ) : (
                                roleOffices.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{
                                                padding: "3px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background: "#f0f4ff",
                                                color: "#4f6ef7"
                                            }}>
                                                {item.role?.name}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                            🏢 {item.office?.name}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <button
                                                onClick={() => openDelete(item, "role")}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#fff0f0",
                                                    color: "#fa5252",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tabla Usuario-Oficina */}
            {tab === "users" && (
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#fafafa" }}>
                                {["Usuario", "Oficina", "Acciones"].map(col => (
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
                            {userOffices.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{
                                        padding: "32px",
                                        textAlign: "center",
                                        color: "#aaa",
                                        fontSize: "14px"
                                    }}>
                                        No hay permisos por usuario registrados
                                    </td>
                                </tr>
                            ) : (
                                userOffices.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#1e1e2e", fontWeight: "500" }}>
                                            {item.user?.full_name}
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                            🏢 {item.office?.name}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <button
                                                onClick={() => openDelete(item, "user")}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#fff0f0",
                                                    color: "#fa5252",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Crear */}
            {modal === "create" && (
                <Modal title="Nuevo permiso">
                    {/* Pestañas dentro del modal */}
                    <div style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "20px",
                        background: "#f5f5f5",
                        padding: "4px",
                        borderRadius: "10px"
                    }}>
                        {[
                            { key: "roles", label: "Por Rol" },
                            { key: "users", label: "Por Usuario" }
                        ].map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    background: tab === t.key ? "white" : "transparent",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: tab === t.key ? "600" : "400",
                                    color: tab === t.key ? "#1e1e2e" : "#888",
                                    cursor: "pointer",
                                    boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Rol-Oficina */}
                    {tab === "roles" && (
                        <form onSubmit={handleSubmitRoleOffice}>
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div>
                                    <label style={labelStyle}>Rol</label>
                                    <select
                                        value={roleId}
                                        onChange={(e) => setRoleId(e.target.value)}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Seleccionar rol</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Oficina</label>
                                    <select
                                        value={officeId}
                                        onChange={(e) => setOfficeId(e.target.value)}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Seleccionar oficina</option>
                                        {offices.map(o => (
                                            <option key={o.id} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        style={{
                                            flex: 1, padding: "11px",
                                            background: "white", border: "1px solid #e0e0e0",
                                            borderRadius: "8px", fontSize: "14px",
                                            cursor: "pointer", color: "#555"
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1, padding: "11px",
                                            background: "#4f6ef7", color: "white",
                                            border: "none", borderRadius: "8px",
                                            fontSize: "14px", fontWeight: "600", cursor: "pointer"
                                        }}
                                    >
                                        Crear permiso
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Form Usuario-Oficina */}
                    {tab === "users" && (
                        <form onSubmit={handleSubmitUserOffice}>
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div>
                                    <label style={labelStyle}>Usuario</label>
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Seleccionar usuario</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Oficina</label>
                                    <select
                                        value={officeId}
                                        onChange={(e) => setOfficeId(e.target.value)}
                                        required
                                        style={selectStyle}
                                    >
                                        <option value="">Seleccionar oficina</option>
                                        {offices.map(o => (
                                            <option key={o.id} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        style={{
                                            flex: 1, padding: "11px",
                                            background: "white", border: "1px solid #e0e0e0",
                                            borderRadius: "8px", fontSize: "14px",
                                            cursor: "pointer", color: "#555"
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1, padding: "11px",
                                            background: "#4f6ef7", color: "white",
                                            border: "none", borderRadius: "8px",
                                            fontSize: "14px", fontWeight: "600", cursor: "pointer"
                                        }}
                                    >
                                        Crear permiso
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal>
            )}

            {/* Modal Eliminar */}
            {modal === "delete" && selected && (
                <Modal title="Eliminar permiso">
                    <p style={{ color: "#555", marginBottom: "24px", fontSize: "14px" }}>
                        ¿Estás seguro que deseas eliminar este permiso de acceso?
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={closeModal}
                            style={{
                                flex: 1, padding: "11px",
                                background: "white", border: "1px solid #e0e0e0",
                                borderRadius: "8px", fontSize: "14px",
                                cursor: "pointer", color: "#555"
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                flex: 1, padding: "11px",
                                background: "#fa5252", color: "white",
                                border: "none", borderRadius: "8px",
                                fontSize: "14px", cursor: "pointer", fontWeight: "600"
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PermissionsPage;