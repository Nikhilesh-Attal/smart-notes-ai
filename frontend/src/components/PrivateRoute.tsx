import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { session } = useAuth();

  // If there is no session, redirect to the signin page
  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  // If there is a session, render the child routes
  return <Outlet />;
}