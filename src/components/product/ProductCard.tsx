
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative pt-[100%]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </span>
        )}
      </div>
      <CardContent className="py-4 flex-grow">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <span className="font-bold text-teal-600">R${product.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
        <Button asChild variant="outline" className="w-1/2">
          <Link to={`/products/${product.id}`}>Details</Link>
        </Button>
        <Button onClick={handleAddToCart} className="w-1/2 bg-teal-600 hover:bg-teal-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
