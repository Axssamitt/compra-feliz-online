
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Product } from '../types/supabase';
import { useToast } from '@/hooks/use-toast';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to include purchase_link
        const productsWithPurchaseLink = data?.map(product => ({
          ...product,
          purchase_link: product.image_url || '' // Using image_url as a fallback for purchase_link
        })) || [];

        setProducts(productsWithPurchaseLink);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center gold-text">Nossos Produtos</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl">Nenhum produto disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card bg-dark-700 rounded-xl shadow-md overflow-hidden transition duration-300 border border-gold-500"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold gold-text mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold gold-text">R$ {product.price.toFixed(2)}</span>
                  <a 
                    href={product.purchase_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 transition duration-300"
                  >
                    Comprar Agora
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
