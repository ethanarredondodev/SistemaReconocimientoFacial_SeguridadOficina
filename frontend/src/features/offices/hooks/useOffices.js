import { useState, useEffect } from "react";
import { getOffices, createOffice, updateOffice, deleteOffice } from "../../../api/officesApi";
import { useToast } from "../../../context/ToastContext";

const useOffices = () => {
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        setLoading(true);
        try {
            const data = await getOffices();
            setOffices(data);
        } catch (err) {
            addToast("Error al cargar las oficinas", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await createOffice(data);
            await fetchOffices();
            setModal(null);
            addToast("Oficina creada exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al crear la oficina", "error");
        }
    };

    const handleUpdate = async (data) => {
        try {
            await updateOffice(selected.id, data);
            await fetchOffices();
            setModal(null);
            setSelected(null);
            addToast("Oficina actualizada exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al actualizar la oficina", "error");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOffice(selected.id);
            await fetchOffices();
            setModal(null);
            setSelected(null);
            addToast("Oficina eliminada exitosamente", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Error al eliminar la oficina", "error");
        }
    };

    const openEdit = (office) => {
        setSelected(office);
        setModal("edit");
    };

    const openDelete = (office) => {
        setSelected(office);
        setModal("delete");
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
    };

    return {
        offices, loading,
        modal, selected,
        handleCreate, handleUpdate, handleDelete,
        openEdit, openDelete, closeModal,
        setModal
    };
};

export default useOffices;