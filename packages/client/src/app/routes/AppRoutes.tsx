
import { TagsListPage } from '../../features/tags';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../features/auth/pages/login";
import ResetPasswordPage from "../../features/auth/pages/reset-password";
import EmailHandler from "../../features/auth/pages/email-handler";
import VerifyEmail from "../../features/auth/pages/verify-email";
import DashboardPage from "../../features/dashboard";
import { SecurityPage } from "../../features/security";
import { VendorsPage } from "../../features/vendors";
import VendorDetailsForm from "../../features/vendors/pages/details-form";
import { TenderWorkflowPage, TenderDetailPage, LiveTendersPage } from "../../features/tender-workflow";
import { TicketsPage } from "../../features/tickets";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/main-layout";
import NotFoundPage from "../../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/action" element={<EmailHandler />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tags" element={<TagsListPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/create" element={<VendorDetailsForm />} />
        <Route path="/vendors/:id" element={<VendorDetailsForm />} />
        <Route path="tender-workflow" element={<TenderWorkflowPage />} />
        <Route path="tender-workflow/:id" element={<TenderDetailPage />} />
        <Route path="live-tenders" element={<LiveTendersPage />} />
        <Route path="tickets" element={<TicketsPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/tender-workflow" />} />
      </Route>

      {/* 404 Not Found - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
