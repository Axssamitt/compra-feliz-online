
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateAdminUser: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('errejota.ecomerce@gmail.com');
  const [password, setPassword] = useState('@Ro17524');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error('Erro ao criar usuário:', error.message);
        console.error('Erro ao criar usuário:', error);
      } else {
        toast.success('Usuário criado com sucesso!', {
          description: 'Verifique seu email para confirmar a conta.',
        });
        
        // Para desenvolvimento, você pode querer redirecionar para a página de login
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Ocorreu um erro inesperado ao criar o usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-800 p-4">
      <Card className="w-full max-w-md border border-gold-500">
        <CardHeader className="text-gold-500">
          <CardTitle className="text-2xl font-bold">Criar Usuário Administrador</CardTitle>
          <CardDescription>
            Crie o usuário administrador para acessar o painel de controle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-dark-700 border-gold-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-dark-700 border-gold-500 text-white"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900"
            >
              {loading ? 'Criando usuário...' : 'Criar Usuário'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdminUser;
