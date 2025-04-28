
import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter, { FilterOptions } from '@/components/filter/ProductFilter';
import { useLocation } from 'react-router-dom';

const ProductsPage = () => {
  const { products } = useStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();

  // Find the max price for the slider
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  // Get URL parameters
  const getInitialFilterOptions = (): FilterOptions => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    return {
      search: '',
      categories: category ? [category] : [],
      minPrice: 0,
      maxPrice: maxPrice,
      onlyInStock: false,
      onlyFeatured: false,
    };
  };

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(getInitialFilterOptions);

  useEffect(() => {
    // Apply all filters
    let result = products;
    
    // Search filter
    if (filterOptions.search) {
      const searchTerm = filterOptions.search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(searchTerm) || 
             p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Category filter
    if (filterOptions.categories.length > 0) {
      result = result.filter(p => filterOptions.categories.includes(p.category));
    }
    
    // Price range filter
    result = result.filter(
      p => p.price >= filterOptions.minPrice && p.price <= filterOptions.maxPrice
    );
    
    // Stock filter
    if (filterOptions.onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }
    
    // Featured filter
    if (filterOptions.onlyFeatured) {
      result = result.filter(p => p.featured);
    }
    
    setFilteredProducts(result);
  }, [filterOptions, products]);

  // Update filters when URL parameters change
  useEffect(() => {
    setFilterOptions(getInitialFilterOptions());
  }, [location.search]);

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="lg:grid lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-2 px-4 bg-gray-100 rounded-md flex justify-between items-center"
          >
            <span>Filters</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className={`w-4 h-4 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <ProductFilter onFilterChange={handleFilterChange} maxPrice={maxPrice} />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500 mt-2">Try changing your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
