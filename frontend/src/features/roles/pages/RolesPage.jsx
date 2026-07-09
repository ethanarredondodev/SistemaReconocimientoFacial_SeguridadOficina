import useRoles from "../hooks/useRoles";
import RoleForm from "../components/RoleForm";

const Modal = ({ title, onClose, children }) => (
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
            maxWidth: "480px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
        }}>
            <h3 style={{ margin: "0 0 24px", color: "#1e1e2e", fontSize: "18px" }}>
                {title}
            </h3>
            {children}
        </div>
    </div>
);

const RolesPage = () => {
    const {
        roles, loading, error,
        modal, selected,
        handleCreate, handleUpdate, handleDelete,
        openEdit, openDelete, closeModal,
        setModal
    } = useRoles();

    if (loading) return (
        <div style={{ color: "#888", textAlign: "center", marginTop: "80px" }}>
            Cargando roles...
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
                        Roles
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        {roles.length} roles registrados
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
                    + Nuevo rol
                </button>
            </div>

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
                            {["Nombre", "Descripción", "Estado", "Acciones"].map(col => (
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
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{
                                    padding: "32px",
                                    textAlign: "center",
                                    color: "#aaa",
                                    fontSize: "14px"
                                }}>
                                    No hay roles registrados
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr key={role.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            padding: "3px 10px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background: "#f0f4ff",
                                            color: "#4f6ef7"
                                        }}>
                                            {role.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                        {role.description || "—"}
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            padding: "3px 10px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background: role.is_active ? "#ebfbee" : "#f9f9f9",
                                            color: role.is_active ? "#40c057" : "#aaa"
                                        }}>
                                            {role.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => openEdit(role)}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: "#f0f4ff",
                                                    color: "#4f6ef7",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => openDelete(role)}
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
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear */}
            {modal === "create" && (
                <Modal title="Nuevo rol" onClose={closeModal}>
                    <RoleForm onSubmit={handleCreate} onCancel={closeModal} />
                </Modal>
            )}

            {/* Modal Editar */}
            {modal === "edit" && selected && (
                <Modal title="Editar rol" onClose={closeModal}>
                    <RoleForm
                        onSubmit={handleUpdate}
                        onCancel={closeModal}
                        initial={selected}
                    />
                </Modal>
            )}

            {/* Modal Eliminar */}
            {modal === "delete" && selected && (
                <Modal title="Eliminar rol" onClose={closeModal}>
                    <p style={{ color: "#555", marginBottom: "24px", fontSize: "14px" }}>
                        ¿Estás seguro que deseas desactivar el rol <strong>{selected.name}</strong>?
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={closeModal}
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
                            onClick={handleDelete}
                            style={{
                                flex: 1,
                                padding: "11px",
                                background: "#fa5252",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                cursor: "pointer",
                                fontWeight: "600"
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

export default RolesPage;