
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Compra Feliz</h3>
            <p className="text-gray-600 mb-4">
              O seu destino para compras online com as melhores ofertas e produtos de qualidade.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-teal-600">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-teal-600">Produtos</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-teal-600">Carrinho</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Contato</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: contato@comprafeliz.com</li>
              <li>Telefone: (11) 1234-5678</li>
              <li>Endereço: Av. Paulista, 1000, São Paulo</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500">
          <p>&copy; {currentYear} Compra Feliz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
