
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-teal-600">Compra Feliz</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-teal-600 font-medium">Products</Link>
          <Link to="/admin" className="text-gray-700 hover:text-teal-600 font-medium">Admin</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-teal-500 text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
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
        <div className="md:hidden px-4 py-2 bg-white border-t border-gray-200">
          <nav className="flex flex-col space-y-3 pb-3">
            <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-teal-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/admin" className="text-gray-700 hover:text-teal-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
