
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if there's an active session
  useEffect(() => {
    // Função para atualizar o estado baseado na sessão
    const updateStateFromSession = (session: any) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    // Primeiro configurar o listener para mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      updateStateFromSession(session);
    });

    // Depois verificar se já existe uma sessão ativa
    const checkExistingSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        updateStateFromSession(data.session);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setIsAuthenticated(true);
        setCurrentUser(data.session.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error: any) {
      console.error('Password change error:', error);
      return { success: false, message: error?.message || 'Erro ao alterar a senha.' };
    }
  };

  // Renderizar o loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
