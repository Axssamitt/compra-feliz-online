
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  cartItems: CartItem[];
  addProduct: (product: ProductFormData) => void;
  editProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  getCartTotal: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProduct = (product: ProductFormData) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
    toast.success("Product added successfully!");
  };

  const editProduct = (id: string, product: ProductFormData) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...product } : item))
    );
    toast.success("Product updated successfully!");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success("Product deleted successfully!");
  };

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cartItems,
        addProduct,
        editProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getCartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
