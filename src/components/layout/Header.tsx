
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useStore();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
          <Link to="/admin" className="text-white hover:text-gold-400 font-medium">Admin</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300 hover:bg-black/40">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gold-500 text-black">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
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
            <Link to="/admin" className="text-white hover:text-gold-400 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
