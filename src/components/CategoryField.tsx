
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types/supabase';

interface CategoryFieldProps {
  value: string;
  categories: Category[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryField: React.FC<CategoryFieldProps> = ({ 
  value, 
  categories, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Categoria</Label>
      <div className="flex space-x-2">
        <Input 
          id="category"
          value={value}
          onChange={onChange}
          placeholder="Digite ou selecione uma categoria"
          list="categories-list"
          className="border-gray-600 bg-dark-700 text-white"
        />
        <datalist id="categories-list">
          {categories.map(category => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default CategoryField;
