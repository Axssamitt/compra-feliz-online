import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Product } from '../../types/supabase';
import { useToast } from '@/hooks/use-toast';

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include purchase_link
      const productsWithPurchaseLink = data?.map(product => ({
        ...product,
        purchase_link: product.image_url || '' // Using image_url as fallback for purchase_link
      })) || [];

      setProducts(productsWithPurchaseLink);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        setProducts(products.filter(product => product.id !== id));
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso!",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erro ao excluir produto",
          description: "Não foi possível excluir o produto. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">Gerenciar Produtos</h2>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center p-8 bg-dark-700 rounded-lg border border-gold-500">
          <p className="text-gray-300 mb-4">Nenhum produto cadastrado.</p>
          <Link 
            to="/admin/add-product" 
            className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 transition duration-300"
          >
            Adicionar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="rounded-lg shadow overflow-hidden border border-gold-500">
          <table className="min-w-full divide-y divide-gold-500">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Imagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-dark-700 divide-y divide-gold-500">
              {products.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={product.image_url} 
                        alt={product.name}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm gold-text">R$ {product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 truncate max-w-xs">{product.purchase_link}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button 
                      onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                      className="gold-text hover:text-gold-600 mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
