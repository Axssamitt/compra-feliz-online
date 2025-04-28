
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black border-b border-gold-500/30 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/9c6e1f83-ca8c-40bf-bddf-1037a148d865.png" 
            alt="R&J Ecommerce" 
            className="h-12"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gold-400 font-medium">Home</Link>
          <Link to="/products" className="text-white hover:text-gold-400 font-medium">Produtos</Link>
          {isLoggedIn && (
            <Link to="/admin" className="text-white hover:text-gold-400 font-medium">Admin</Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gold-400 hover:text-gold-300 hover:bg-black/40"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300 hover:bg-black/40">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-gold-400 hover:text-gold-300 hover:bg-black/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-black border-t border-gold-500/30">
          <nav className="flex flex-col space-y-3 pb-3">
            <Link to="/" className="text-white hover:text-gold-400 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-white hover:text-gold-400 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Produtos</Link>
            {isLoggedIn && (
              <Link to="/admin" className="text-white hover:text-gold-400 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            )}
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                className="text-gold-400 hover:text-gold-300 justify-start p-2"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            ) : (
              <Link 
                to="/login" 
                className="text-gold-400 hover:text-gold-300 font-medium py-2 flex items-center" 
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
