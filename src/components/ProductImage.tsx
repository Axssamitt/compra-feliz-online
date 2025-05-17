
import React from 'react';
import { Button } from './ui/button';
import { ImagePlus, X } from 'lucide-react';

interface ProductImageProps {
  id: string;
  imageUrl: string;
  isMain: boolean;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  id, 
  imageUrl, 
  isMain, 
  onSetMain, 
  onRemove 
}) => {
  return (
    <div 
      className={`relative rounded-md border ${isMain ? 'border-gold-500 ring-2 ring-gold-500' : 'border-gray-600'}`}
    >
      <img 
        src={imageUrl} 
        alt="Product" 
        className="h-24 w-full object-cover rounded"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      <div className="absolute top-1 right-1 flex space-x-1">
        {!isMain && (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-5 w-5 bg-dark-800 hover:bg-dark-700"
            onClick={() => onSetMain(id)}
            title="Definir como principal"
          >
            <ImagePlus size={12} className="text-gold-500" />
          </Button>
        )}
        <Button 
          variant="outline" 
          size="icon" 
          className="h-5 w-5 bg-dark-800 hover:bg-dark-700" 
          onClick={() => onRemove(id)}
          title="Remover imagem"
        >
          <X size={12} className="text-red-500" />
        </Button>
      </div>
      {isMain && (
        <div className="absolute bottom-1 left-1 bg-gold-500 text-dark-900 text-xs px-1 rounded">
          Principal
        </div>
      )}
    </div>
  );
};

export default ProductImage;
