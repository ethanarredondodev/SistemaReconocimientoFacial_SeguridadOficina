import useUsers from "../hooks/useUsers";
import UserForm from "../components/UserForm";

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
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
        }}>
            <h3 style={{ margin: "0 0 24px", color: "#1e1e2e", fontSize: "18px" }}>
                {title}
            </h3>
            {children}
        </div>
    </div>
);

const UsersPage = () => {
    const {
        users, roles, loading, error,
        modal, selected,
        handleCreate, handleUpdate, handleDelete,
        openEdit, openDelete, closeModal,
        setModal
    } = useUsers();

    if (loading) return (
        <div style={{ color: "#888", textAlign: "center", marginTop: "80px" }}>
            Cargando usuarios...
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
                        Usuarios
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        {users.length} usuarios registrados
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
                    + Nuevo usuario
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
                            {["Usuario", "Email", "Rol", "Estado", "Acciones"].map(col => (
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
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{
                                    padding: "32px",
                                    textAlign: "center",
                                    color: "#aaa",
                                    fontSize: "14px"
                                }}>
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                background: "#4f6ef7",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                                flexShrink: 0
                                            }}>
                                                {user.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: "14px", color: "#1e1e2e", fontWeight: "500" }}>
                                                {user.full_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "#555" }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            padding: "3px 10px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background: "#f0f4ff",
                                            color: "#4f6ef7"
                                        }}>
                                            {user.role?.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            padding: "3px 10px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background: user.is_active ? "#ebfbee" : "#f9f9f9",
                                            color: user.is_active ? "#40c057" : "#aaa"
                                        }}>
                                            {user.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => openEdit(user)}
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
                                                onClick={() => openDelete(user)}
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
                <Modal title="Nuevo usuario" onClose={closeModal}>
                    <UserForm
                        onSubmit={handleCreate}
                        onCancel={closeModal}
                        roles={roles}
                    />
                </Modal>
            )}

            {/* Modal Editar */}
            {modal === "edit" && selected && (
                <Modal title="Editar usuario" onClose={closeModal}>
                    <UserForm
                        onSubmit={handleUpdate}
                        onCancel={closeModal}
                        roles={roles}
                        initial={selected}
                    />
                </Modal>
            )}

            {/* Modal Eliminar */}
            {modal === "delete" && selected && (
                <Modal title="Eliminar usuario" onClose={closeModal}>
                    <p style={{ color: "#555", marginBottom: "24px", fontSize: "14px" }}>
                        ¿Estás seguro que deseas desactivar a <strong>{selected.full_name}</strong>?
                        Esta acción no se puede deshacer.
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

export default UsersPage;