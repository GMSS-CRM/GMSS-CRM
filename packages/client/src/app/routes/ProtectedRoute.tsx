import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Loader from "../../shared/components/loader";
import type { JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader tip="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
