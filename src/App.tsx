
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Shop from './pages/Shop';
import Login from './pages/Login';
import Logout from './pages/Logout';
import AdminLayout from './pages/Admin/AdminLayout';
import ProductsList from './pages/Admin/ProductsList';
import ProductForm from './pages/Admin/ProductForm';
import ChangePassword from './pages/Admin/ChangePassword';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-dark-800">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<ProductsList />} />
                  <Route path="add-product" element={<ProductForm />} />
                  <Route path="edit-product/:id" element={<ProductForm />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
