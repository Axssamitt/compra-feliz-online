
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStore } from '@/context/StoreContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useStore();

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(username, password);
      
      if (success) {
        toast.success('Login bem-sucedido!');
        navigate('/admin');
      } else {
        toast.error('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-black border-gold-500/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gold-400">Área do Administrador</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Digite suas credenciais para acessar o painel de administração
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-200">
                Nome de usuário
              </label>
              <Input
                id="username"
                placeholder="Insira seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-gold-500/30 bg-black text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gold-500/30 bg-black text-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gold-500 hover:bg-gold-400 text-black" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
