
import React from 'react';
import { Product } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CategoryField from './CategoryField';
import { Category } from '@/types/supabase';

interface ProductFormFieldsProps {
  product: Product;
  onProductChange: (fields: Partial<Product>) => void;
  categories: Category[];
  newCategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mainImageUrl: string | null;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  product,
  onProductChange,
  categories,
  newCategory,
  onCategoryChange,
  mainImageUrl
}) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          value={product.name}
          onChange={(e) => onProductChange({ name: e.target.value })}
          className="border-gray-600 bg-dark-700 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={product.price}
          onChange={(e) => onProductChange({ price: Number(e.target.value) })}
          className="border-gray-600 bg-dark-700 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={product.description || ''}
          onChange={(e) => onProductChange({ description: e.target.value })}
          className="border-gray-600 bg-dark-700 text-white"
        />
      </div>
      
      <CategoryField
        value={newCategory}
        categories={categories}
        onChange={onCategoryChange}
      />
      
      <div>
        <Label htmlFor="purchase_link">Link de Compra</Label>
        <Input
          id="purchase_link"
          value={product.purchase_link || ''}
          onChange={(e) => onProductChange({ purchase_link: e.target.value })}
          placeholder="https://..."
          className="border-gray-600 bg-dark-700 text-white"
        />
      </div>
      
      {/* Display the main image if available */}
      {mainImageUrl && (
        <div>
          <Label>Imagem Principal</Label>
          <div className="mt-2">
            <img 
              src={mainImageUrl} 
              alt={product.name} 
              className="h-32 w-32 object-cover rounded-md border border-gold-500" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFormFields;
