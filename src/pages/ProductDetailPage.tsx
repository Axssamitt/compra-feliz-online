
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
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
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const handleBuyNow = () => {
    if (product.paymentLink) {
      window.open(product.paymentLink, '_blank');
    } else {
      addToCart(product, 1);
      navigate('/cart');
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
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
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-teal-600 mt-2">
              R${product.price.toFixed(2)}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p>{product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stock</h3>
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow} 
              variant="outline"
              className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50"
              disabled={product.stock <= 0}
            >
              {product.paymentLink ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              ) : (
                'Buy Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
