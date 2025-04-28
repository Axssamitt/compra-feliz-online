
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gold-500/30 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-400">R&J Ecommerce</h3>
            <p className="text-gray-300 mb-4">
              O seu destino para compras online com as melhores ofertas e produtos de qualidade.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-400">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gold-400">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-gold-400">Produtos</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-gold-400">Carrinho</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-400">Contato</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: contato@rjecommerce.com</li>
              <li>Telefone: (11) 1234-5678</li>
              <li>Endereço: Av. Paulista, 1000, São Paulo</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gold-500/30 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {currentYear} R&J Ecommerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
