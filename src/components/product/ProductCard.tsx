
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg border-gold-500/30 bg-black">
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
          <span className="absolute top-2 right-2 bg-gold-500 text-black text-xs font-bold px-2 py-1 rounded-md">
            Destaque
          </span>
        )}
      </div>
      <CardContent className="py-4 flex-grow">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-2 text-white">{product.name}</h3>
          <span className="font-bold text-gold-400">R${product.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-300 text-sm line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button asChild variant="outline" className="w-full border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-black">
          <Link to={`/products/${product.id}`}>Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
