import { Navigate } from "react-router-dom";
import { useKioskStore } from "../store/kioskStore";

const KioskRoute = ({ children }) => {
    const officeId = useKioskStore((state) => state.officeId);
    if (!officeId) {
        return <Navigate to="/kiosk/setup" replace />;
    }
    return children;
}

export default KioskRoute;