
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '../types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductWithImages extends Product {
  images?: Array<{
    id: string;
    image_url: string;
    is_main: boolean;
  }>;
  currentImageIndex?: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
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

        // Fetch images for each product
        const productsWithImages: ProductWithImages[] = [];
        
        for (const product of data || []) {
          const { data: imageData, error: imageError } = await supabase
            .from('product_images')
            .select('id, image_url, is_main')
            .eq('product_id', product.id)
            .order('is_main', { ascending: false });
            
          if (imageError) {
            console.error('Error fetching product images:', imageError);
          }
          
          // If we have no images, use the legacy image_url if available
          const images = imageData && imageData.length > 0 
            ? imageData 
            : product.image_url 
              ? [{ id: 'legacy', image_url: product.image_url, is_main: true }] 
              : [];
              
          productsWithImages.push({
            ...product,
            images,
            currentImageIndex: 0
          });
        }

        setProducts(productsWithImages);
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

  const navigateImage = (productId: number, direction: 'next' | 'prev') => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId && product.images && product.images.length > 1) {
        const currentIndex = product.currentImageIndex || 0;
        const totalImages = product.images.length;
        let newIndex = direction === 'next' 
          ? (currentIndex + 1) % totalImages 
          : (currentIndex - 1 + totalImages) % totalImages;
        
        return { ...product, currentImageIndex: newIndex };
      }
      return product;
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
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
              <div className="h-48 overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img 
                      src={product.images[product.currentImageIndex || 0]?.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-opacity"
                      onError={(e) => {
                        console.error(`Error loading image for ${product.name}`);
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Image navigation buttons */}
                    {product.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            navigateImage(product.id, 'prev');
                          }}
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            navigateImage(product.id, 'next');
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                        
                        {/* Image indicators */}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
                          {product.images.map((_, idx) => (
                            <span 
                              key={idx} 
                              className={`block h-1.5 w-1.5 rounded-full ${idx === (product.currentImageIndex || 0) ? 'bg-gold-500' : 'bg-white bg-opacity-60'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-dark-800 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold gold-text mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold gold-text">R$ {product.price.toFixed(2)}</span>
                  {product.purchase_link && (
                    <a 
                      href={product.purchase_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 transition duration-300"
                    >
                      Comprar Agora
                    </a>
                  )}
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
