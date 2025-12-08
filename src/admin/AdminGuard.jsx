import React from "react";
import { Navigate } from "react-router-dom";

// Protect admin pages. If no token, send to /admin/login
export default function AdminGuard({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
