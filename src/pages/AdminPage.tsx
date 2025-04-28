
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, ProductFormData } from '@/types/product';
import ProductForm from '@/components/product/ProductForm';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
    }
  };

  const handleAddProduct = (data: ProductFormData) => {
    addProduct(data);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      editProduct(editingProduct.id, data);
      setEditingProduct(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="add">Add Product</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredProducts.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Category</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Price</th>
                        <th className="px-4 py-3 hidden lg:table-cell">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">{product.category}</td>
                          <td className="px-4 py-3 hidden sm:table-cell">R${product.price.toFixed(2)}</td>
                          <td className="px-4 py-3 hidden lg:table-cell">{product.stock}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>No products found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
                <h2 className="text-xl font-bold mb-6">Edit Product</h2>
                <ProductForm
                  initialData={editingProduct}
                  onSubmit={handleUpdateProduct}
                  buttonText="Update Product"
                />
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleAddProduct} buttonText="Add Product" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
