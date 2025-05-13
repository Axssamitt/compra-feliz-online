
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, CirclePlus, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
    navigate('/');
  };

  return (
    <div className="flex">
      {/* Admin Sidebar */}
      <div className="w-64 min-h-screen admin-nav text-gold-500 p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Box className="mr-2" /> Painel Admin
        </h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin"
              className={`block py-2 px-4 rounded hover:bg-dark-700 border border-gold-500 ${
                location.pathname === '/admin' ? 'bg-dark-700' : ''
              }`}
            >
              <Box className="inline-block mr-2" /> Produtos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/add-product"
              className={`block py-2 px-4 rounded hover:bg-dark-700 border border-gold-500 ${
                location.pathname === '/admin/add-product' || location.pathname.includes('/admin/edit-product') 
                  ? 'bg-dark-700' 
                  : ''
              }`}
            >
              <CirclePlus className="inline-block mr-2" /> Adicionar Produto
            </Link>
          </li>
          <li>
            <Link
              to="/admin/change-password"
              className={`block py-2 px-4 rounded hover:bg-dark-700 border border-gold-500 ${
                location.pathname === '/admin/change-password' ? 'bg-dark-700' : ''
              }`}
            >
              <Key className="inline-block mr-2" /> Alterar Senha
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left block py-2 px-4 rounded hover:bg-dark-700 border border-gold-500"
            >
              <LogOut className="inline-block mr-2" /> Sair
            </button>
          </li>
        </ul>
      </div>

      {/* Admin Content */}
      <div className="flex-1 p-8 bg-dark-800">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
