import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../modules/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import DashboardPage from "../../modules/auth/pages/DashboardPage";
import MainLayout from "../../layouts/MainLayout";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected Route */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
