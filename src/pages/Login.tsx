
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        navigate('/admin');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto mt-16 p-8 rounded-xl shadow-xl login-container animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center gold-text">Área do Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block gold-text mb-2">Usuário</label>
            <input 
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-700 border-gold-500 text-white" 
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block gold-text mb-2">Senha</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-700 border-gold-500 text-white" 
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full gold-bg hover:bg-gold-600 text-dark-900 py-2 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center">
            Usuário ou senha incorretos!
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
