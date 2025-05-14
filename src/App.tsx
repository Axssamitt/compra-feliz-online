
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

import AdminLayout from "./pages/Admin/AdminLayout";
import ChangePassword from "./pages/Admin/ChangePassword";
import ProductForm from "./pages/Admin/ProductForm";
import ProductsList from "./pages/Admin/ProductsList";
import ExportPage from "./pages/Admin/ExportPage";
import CompanyInfoPage from "./pages/Admin/CompanyInfoPage";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductsList />} />
            <Route path="add-product" element={<ProductForm />} />
            <Route path="edit-product/:id" element={<ProductForm />} />
            <Route path="company-info" element={<CompanyInfoPage />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="export" element={<ExportPage />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
