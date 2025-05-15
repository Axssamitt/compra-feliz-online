
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado e não estiver na página de login, redirecionar para login
  if (!isAuthenticated && location.pathname !== '/login') {
    // Salvar a localização atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado ou já estiver na página de login, renderizar os componentes filhos
  return <>{children}</>;
};

export default ProtectedRoute;
