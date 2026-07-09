import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminRoute from "./AdminRoute";
import KioskRoute from "./KioskRoute";

import AdminLayout from "../components/layout/AdminLayout";
import KioskLayout from "../components/layout/KioskLayout";

import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import UsersPage from "../features/users/pages/UsersPage";
import RolesPage from "../features/roles/pages/RolesPage";
import OfficesPage from "../features/offices/pages/OfficesPage";
import PermissionsPage from "../features/permissions/pages/PermissionsPage";
import LogsPage from "../features/logs/pages/LogsPage";

import KioskSetupPage from "../features/kiosk/pages/KioskSetupPage";
import KioskVerifyPage from "../features/kiosk/pages/KioskVerifyPage";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<LoginPage />} />

                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="offices" element={<OfficesPage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="logs" element={<LogsPage />} />
                </Route>

                <Route path="/kiosk/setup" element={<KioskSetupPage />} />

                <Route path="/kiosk/verify" element={
                    <KioskRoute>
                        <KioskLayout>
                            <KioskVerifyPage />
                        </KioskLayout>
                    </KioskRoute>
                } />



            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;