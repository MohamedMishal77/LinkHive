// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    // While validating token, show a simple loading state
    return <div style={{ padding: 20 }}>Checking authentication…</div>;
  }

  if (!token) {
    // Not authenticated -> redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
