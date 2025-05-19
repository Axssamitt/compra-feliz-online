
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'current path:', location.pathname);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login with state:', { from: location });
    // Redirect to login page with current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
