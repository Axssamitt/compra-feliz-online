
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6 text-gray-600">The product you are looking for does not exist.</p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleBuyNow = () => {
    if (product.paymentLink) {
      window.open(product.paymentLink, '_blank');
    }
  };
  
  return (
    <div>
      <Button variant="ghost" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.featured && (
                <span className="bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  Destaque
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gold-400 mt-2">
              R${product.price.toFixed(2)}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-2">Descrição</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
              <p>{product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Estoque</h3>
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Sem estoque'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {product.paymentLink && (
              <Button 
                onClick={handleBuyNow} 
                className="flex-1 bg-gold-500 hover:bg-gold-400 text-black"
                disabled={product.stock <= 0}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Comprar Agora
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
