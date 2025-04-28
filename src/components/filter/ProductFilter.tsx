
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/types/product';

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export interface FilterOptions {
  search: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  onlyFeatured: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, maxPrice }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categories: [],
    minPrice: 0,
    maxPrice: maxPrice || 1000,
    onlyInStock: false,
    onlyFeatured: false,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] || filters.maxPrice };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (field: 'onlyInStock' | 'onlyFeatured') => {
    const newFilters = { ...filters, [field]: !filters[field] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      categories: [],
      minPrice: 0,
      maxPrice: maxPrice || 1000,
      onlyInStock: false,
      onlyFeatured: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
      <div>
        <Label htmlFor="search" className="mb-2 block">Search</Label>
        <Input
          id="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <label 
                htmlFor={`category-${category}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label>Price Range</Label>
          <span className="text-sm">
            R${filters.minPrice} - R${filters.maxPrice}
          </span>
        </div>
        <Slider
          defaultValue={[filters.minPrice, filters.maxPrice]}
          max={maxPrice || 1000}
          step={10}
          onValueChange={handlePriceChange}
          className="my-6"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Checkbox
            id="in-stock"
            checked={filters.onlyInStock}
            onCheckedChange={() => handleCheckboxChange('onlyInStock')}
          />
          <label htmlFor="in-stock" className="ml-2 text-sm cursor-pointer">
            In Stock Only
          </label>
        </div>

        <div className="flex items-center">
          <Checkbox
            id="featured"
            checked={filters.onlyFeatured}
            onCheckedChange={() => handleCheckboxChange('onlyFeatured')}
          />
          <label htmlFor="featured" className="ml-2 text-sm cursor-pointer">
            Featured Only
          </label>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={handleReset}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
