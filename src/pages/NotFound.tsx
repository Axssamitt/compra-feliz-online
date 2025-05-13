
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4 gold-text">404</h1>
        <p className="text-xl text-gray-300 mb-6">Página não encontrada</p>
        <Link to="/" className="px-6 py-3 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 inline-block">
          Voltar à Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
