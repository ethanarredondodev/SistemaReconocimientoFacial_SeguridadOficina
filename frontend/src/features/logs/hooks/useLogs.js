import { useState, useEffect } from "react";
import { getLogs } from "../../../api/logsApi";
import { getUsers } from "../../../api/usersApi";
import { getOffices } from "../../../api/officesApi";

const useLogs = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        user_id: [],
        include_unknown: false,
        office_id: [],
        result: "",
        start_date: "",
        end_date: ""
    });

    useEffect(() => {
        fetchMeta();
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const fetchMeta = async () => {
        try {
            const [usersData, officesData] = await Promise.all([
                getUsers(),
                getOffices()
            ]);
            setUsers(usersData);
            setOffices(officesData);
        } catch (err) {
            console.error("Error cargando metadata:", err);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};

            if (filters.user_id.length > 0) {
                params.user_id = filters.user_id;
            }
            if (filters.include_unknown) {
                params.include_unknown = true;
            }
            if (filters.office_id.length > 0) {
                params.office_id = filters.office_id;
            }
            if (filters.result) {
                params.result = filters.result;
            }
            if (filters.start_date) {
                params.start_date = filters.start_date;
            }
            if (filters.end_date) {
                params.end_date = filters.end_date;
            }
            console.log("Fetching logs with params:", params);
            const data = await getLogs(params);
            setLogs(data);
        } catch (err) {
            setError("Error al cargar los registros");
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            user_id: [],
            include_unknown: false,
            office_id: [],
            result: "",
            start_date: "",
            end_date: ""
        });
    };

    return {
        logs, users, offices,
        loading, error,
        filters, updateFilter, clearFilters
    };
};

export default useLogs;