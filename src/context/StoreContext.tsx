
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';
import { toast } from 'sonner';

interface StoreContextType {
  products: Product[];
  addProduct: (product: ProductFormData) => void;
  editProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoggedIn: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Admin credentials - in a real app, this would be in the backend
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('rj-admin-logged-in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

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

  const login = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      // Store login status in localStorage
      localStorage.setItem('rj-admin-logged-in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('rj-admin-logged-in');
    toast.success("Você foi desconectado com sucesso.");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
        login,
        logout,
        isLoggedIn
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
