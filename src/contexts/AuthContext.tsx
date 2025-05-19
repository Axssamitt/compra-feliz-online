
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
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // Set up auth state listener and check session only once at initialization
  useEffect(() => {
    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      // Update application state based on session
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user || null);
      setIsLoading(false);
      setAuthInitialized(true);
    });

    // Check for existing session on initial load
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data } = await supabase.auth.getSession();
        
        // Only update state if we haven't already initialized from onAuthStateChange
        if (!authInitialized) {
          console.log('Session check result:', data.session ? 'Session exists' : 'No session');
          setIsAuthenticated(!!data.session);
          setCurrentUser(data.session?.user || null);
          setIsLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    checkSession();

    // Clean up subscription when component unmounts
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      // Auth state will be handled by the onAuthStateChange listener
      console.log('Login successful:', data.session ? 'Session created' : 'No session');
      return !!data.session;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      await supabase.auth.signOut();
      // Auth state will be handled by the onAuthStateChange listener
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Attempting password change');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        console.error('Password change error:', error);
        return { success: false, message: error.message };
      }
      
      console.log('Password changed successfully');
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error: any) {
      console.error('Password change error:', error);
      return { success: false, message: error?.message || 'Erro ao alterar a senha.' };
    }
  };

  // Render loading indicator while checking authentication
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
