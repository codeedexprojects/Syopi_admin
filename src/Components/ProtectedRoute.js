import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role");

  // Check if user role matches the required role
  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
