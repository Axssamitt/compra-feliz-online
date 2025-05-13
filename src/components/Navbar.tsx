
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-dark-900 text-gold-500 shadow-lg border-b border-gold-500">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Crown className="mr-2" />
          RJ Ecommerce
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gold-600">Loja</Link>
          {isAuthenticated && (
            <Link to="/admin" className="hover:text-gold-600">Admin</Link>
          )}
          {!isAuthenticated ? (
            <Link to="/login" className="hover:text-gold-600">Login</Link>
          ) : (
            <Link to="/logout" className="hover:text-gold-600">Sair</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
