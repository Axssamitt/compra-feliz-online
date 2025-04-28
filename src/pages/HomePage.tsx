
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import { categories } from '@/types/product';

const HomePage = () => {
  const { products } = useStore();
  
  // Get featured products
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  
  // Get a random category to highlight
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryProducts = products
    .filter(p => p.category === randomCategory)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-teal-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-teal-700 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Compra Feliz Online
          </h1>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl">
            Sua loja online para produtos incríveis com os melhores preços e entrega rápida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-teal-800 hover:bg-teal-50">
              <Link to="/products">Ver Produtos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-teal-800">
              <Link to="/admin">Administrar Loja</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Produtos em Destaque</h2>
          <Link to="/products" className="text-teal-600 hover:text-teal-800 font-medium">
            Ver Todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              Não há produtos em destaque no momento.
            </p>
          )}
        </div>
      </section>

      {/* Category Highlight */}
      {categoryProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {randomCategory}
            </h2>
            <Link 
              to={`/products?category=${randomCategory}`} 
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Ver Categoria →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Promotion Banner */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Promoção Especial</h2>
        <p className="text-lg mb-6">
          Ganhe 10% de desconto na sua primeira compra!
        </p>
        <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50">
          <Link to="/products">Comprar Agora</Link>
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
