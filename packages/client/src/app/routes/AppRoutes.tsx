import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../features/auth/pages/login-page";
import DashboardPage from "../../features/auth/pages/dashboard-page";
import { SecurityPage } from "../../features/security";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/main-layout";

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
        <Route path="/security" element={<SecurityPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
