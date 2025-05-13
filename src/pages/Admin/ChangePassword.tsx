
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChangePassword: React.FC = () => {
  const { changePassword } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    if (id === 'newPassword') {
      checkPasswordStrength(value);
    }

    if (id === 'confirmPassword' || id === 'newPassword') {
      setPasswordMismatch(
        formData.newPassword !== value && 
        (id === 'newPassword' ? value !== formData.confirmPassword : formData.newPassword !== value)
      );
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Contains uppercase, lowercase, numbers and special chars
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Cap at 4 (for our strength meter)
    strength = Math.min(strength, 4);
    
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if new password meets requirements
    if (formData.newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso!",
        });
        
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar a senha. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">Alterar Senha</h2>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-dark-700 p-6 rounded-lg shadow border border-gold-500"
      >
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block gold-text mb-2">Senha Atual</label>
          <div className="relative">
            <input 
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
              required
            />
            <button 
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-3 text-gold-500 hover:text-gold-600"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="newPassword" className="block gold-text mb-2">Nova Senha</label>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
              required
            />
            <button 
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-gold-500 hover:text-gold-600"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className={`password-strength strength-${passwordStrength}`}></div>
          <div className="text-xs text-gold-500 mt-1">
            A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block gold-text mb-2">Confirmar Nova Senha</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
              required
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gold-500 hover:text-gold-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordMismatch && (
            <div className="text-xs text-red-500 mt-1">
              As senhas não coincidem.
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button"
            onClick={() => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              setPasswordStrength(0);
              setPasswordMismatch(false);
            }}
            className="px-4 py-2 border border-gold-500 rounded-lg text-gold-500 hover:bg-dark-600"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading || passwordMismatch}
            className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
