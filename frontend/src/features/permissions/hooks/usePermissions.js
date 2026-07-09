import { useState, useEffect } from "react";
import {
    getRoleOffices, createRoleOffice, deleteRoleOffice,
    getUserOffices, createUserOffice, deleteUserOffice
} from "../../../api/permissionsApi";
import { getRoles } from "../../../api/rolesApi";
import { getOffices } from "../../../api/officesApi";
import { getUsers } from "../../../api/usersApi";
import { useToast } from "../../../context/ToastContext";

const usePermissions = () => {
    const [tab, setTab] = useState("roles");
    const [roleOffices, setRoleOffices] = useState([]);
    const [userOffices, setUserOffices] = useState([]);
    const [roles, setRoles] = useState([]);
    const [offices, setOffices] = useState([]);
    const [users, setUsers] = useState([]);
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
            const [roData, uoData, rolesData, officesData, usersData] = await Promise.all([
                getRoleOffices(),
                getUserOffices(),
                getRoles(),
                getOffices(),
                getUsers()
            ]);
            setRoleOffices(roData);
            setUserOffices(uoData);
            setRoles(rolesData);
            setOffices(officesData);
            setUsers(usersData);
        } catch (err) {
            addToast("Error al cargar los permisos", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoleOffice = async (data) => {
        try {
            await createRoleOffice(data);
            await fetchAll();
            setModal(null);
            addToast("Permiso de rol creado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al crear el permiso", "error");
        }
    };

    const handleCreateUserOffice = async (data) => {
        try {
            await createUserOffice(data);
            await fetchAll();
            setModal(null);
            addToast("Permiso de usuario creado exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al crear el permiso", "error");
        }
    };

    const handleDelete = async () => {
        try {
            if (selected.type === "role") {
                await deleteRoleOffice(selected.id);
                addToast("Permiso de rol eliminado exitosamente", "success");
            } else {
                await deleteUserOffice(selected.id);
                addToast("Permiso de usuario eliminado exitosamente", "success");
            }
            await fetchAll();
            setModal(null);
            setSelected(null);
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al eliminar el permiso", "error");
        }
    };

    const openDelete = (item, type) => {
        setSelected({ ...item, type });
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
    };

    return {
        tab, setTab,
        roleOffices, userOffices,
        roles, offices, users,
        loading,
        modal, selected,
        handleCreateRoleOffice, handleCreateUserOffice, handleDelete,
        openDelete, closeModal,
        setModal
    };
};

export default usePermissions;