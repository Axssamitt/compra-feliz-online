
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { sha256 } from 'js-sha256';

// Define User type
export type User = {
  id: number;
  username: string;
  password_hash: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demonstration - in a real app, this would be fetched from a secure backend
const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    password_hash: sha256('admin123') // Pre-hashed password for 'admin123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if there's a saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Hash the password with SHA-256
      const hashedPassword = sha256(password);
      
      // Find user with matching username and password
      const user = MOCK_USERS.find(
        u => u.username === username && u.password_hash === hashedPassword
      );
      
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) {
        return { success: false, message: 'Usuário não autenticado.' };
      }

      // Check if current password is correct
      const hashedCurrentPassword = sha256(currentPassword);
      if (hashedCurrentPassword !== currentUser.password_hash) {
        return { success: false, message: 'A senha atual está incorreta.' };
      }

      // Hash the new password
      const hashedNewPassword = sha256(newPassword);

      // Update password in local state and storage
      const updatedUser = { ...currentUser, password_hash: hashedNewPassword };
      
      // In a real app, you would update the database here
      // For now, we just update the mock user and local state
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the MOCK_USERS array to simulate database persistence
      const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
      if (userIndex >= 0) {
        MOCK_USERS[userIndex] = updatedUser;
      }

      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: 'Erro ao alterar a senha.' };
    }
  };

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
