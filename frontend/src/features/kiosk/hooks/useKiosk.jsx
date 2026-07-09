import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../../store/kioskStore";
import { loginForSetup, getOffices } from "../../../api/kioskApi";

const useKiosk = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offices, setOffices] = useState([]);
    const [step, setStep] = useState("login");
    const setOffice = useKioskStore((state) => state.setOffice);
    const navigate = useNavigate();

    const loginSetup = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const data = await loginForSetup(email, password);
            if (data.user.role.name !== "admin") {
                setError("Solo un administrador puede configurar el dispositivo.");
                return
            }

            const officeList = await getOffices();
            setOffices(officeList);
            setStep("select");

        } catch (err) {
            setError(err.response?.data?.detail || "Credenciales incorrectas")
        } finally {
            setLoading(false);
        }
    };

    const selectOffice = (officeId, officeName) => {
        setOffice(officeId, officeName);
        navigate("/kiosk/verify");
    };

    return { loginSetup, selectOffice, loading, error, offices, step };

};

export default useKiosk;