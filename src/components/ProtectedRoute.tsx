
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Verificar se está autenticado
  if (!isAuthenticated) {
    // Redirecionar para login apenas se não estivermos já na página de login
    // Isto evita um loop infinito de redirecionamento
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderizar os componentes filhos
  return <>{children}</>;
};

export default ProtectedRoute;
