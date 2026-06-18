// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // If the user is already logged in, redirect them to their specific dashboard
  if (user) {
    switch (user.role_name) {
      case "Administrator":
        return <Navigate to="/admin/dashboard" replace />;
      case "Manager":
        return <Navigate to="/manager/dashboard" replace />;
      case "Employee":
        return <Navigate to="/employee/dashboard" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  // If not logged in, allow them to view the public routes (Login, Home, etc.)
  return <Outlet />;
}
