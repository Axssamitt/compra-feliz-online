import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the intended destination after login
  const from = (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso."
        });
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-dark-700 rounded-lg shadow-lg border border-gold-500">
        <h1 className="text-2xl font-bold mb-6 text-center gold-text">Login Administrativo</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block gold-text mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
