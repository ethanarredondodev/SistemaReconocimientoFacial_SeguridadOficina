import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../api/usersApi";
import { getRoles } from "../../../api/rolesApi";
import { useToast } from "../../../context/ToastContext";

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            addToast("Error al cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        try {
            await createUser(formData);
            await fetchAll();
            setModal(null);
            addToast("Usuario creado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al crear el usuario", "error");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateUser(selected.id, formData);
            await fetchAll();
            setModal(null);
            setSelected(null);
            addToast("Usuario actualizado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al actualizar el usuario", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser(selected.id);
            await fetchAll();
            setModal(null);
            setSelected(null);
            addToast("Usuario eliminado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al eliminar el usuario", "error");
        }
    };

    const openEdit = (user) => {
        setSelected(user);
        setModal("edit");
    };

    const openDelete = (user) => {
        setSelected(user);
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
    };

    return {
        users, roles, loading,
        modal, selected,
        handleCreate, handleUpdate, handleDelete,
        openEdit, openDelete, closeModal,
        setModal
    };
};

export default useUsers;