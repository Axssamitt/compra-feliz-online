
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { StoreProvider, useStore } from "./context/StoreContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Since we need to use the context inside the ProtectedRoute, we need to move the Routes inside the StoreProvider
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout><HomePage /></Layout>} />
    <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
    <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
    <Route 
      path="/admin" 
      element={
        <Layout>
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        </Layout>
      } 
    />
    <Route path="*" element={<Layout><NotFound /></Layout>} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
