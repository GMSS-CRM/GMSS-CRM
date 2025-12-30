import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../features/auth/pages/login";
import ResetPasswordPage from "../../features/auth/pages/reset-password";
import AuthActionHandler from "../../features/auth/pages/auth-action";
import DashboardPage from "../../features/dashboard/pages/dashboard";
import { SecurityPage } from "../../features/security";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/main-layout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/__/auth/action" element={<AuthActionHandler />} />

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
