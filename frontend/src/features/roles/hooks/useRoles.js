import { useState, useEffect } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../../api/rolesApi";
import { useToast } from "../../../context/ToastContext";

const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (err) {
            addToast("Error al cargar los roles", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await createRole(data);
            await fetchRoles();
            setModal(null);
            addToast("Rol creado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al crear el rol", "error");
        }
    };

    const handleUpdate = async (data) => {
        try {
            await updateRole(selected.id, data);
            await fetchRoles();
            setModal(null);
            setSelected(null);
            addToast("Rol actualizado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al actualizar el rol", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRole(selected.id);
            await fetchRoles();
            setModal(null);
            setSelected(null);
            addToast("Rol eliminado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al eliminar el rol", "error");
        }
    };

    const openEdit = (role) => {
        setSelected(role);
        setModal("edit");
    };

    const openDelete = (role) => {
        setSelected(role);
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
    };

    return {
        roles, loading,
        modal, selected,
        handleCreate, handleUpdate, handleDelete,
        openEdit, openDelete, closeModal,
        setModal
    };
};

export default useRoles;