import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  fallbackPage?: string; // fallbackPage is now a route path, e.g. "/login"
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 * Guards sensitive components. If not authenticated, triggers a redirect to login.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  fallbackPage = '/login',
  children
}) => {
  if (!isAuthenticated) {
    return <Navigate to={fallbackPage} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
