import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/auth/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<div>Users</div>} />
        <Route path="/roles" element={<div>Roles</div>} />
        <Route path="/permissions" element={<div>Permissions</div>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
