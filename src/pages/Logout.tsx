
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800">
      <div className="text-center px-4">
        <p className="text-xl text-gray-300 mb-6">Saindo...</p>
      </div>
    </div>
  );
};

export default Logout;
