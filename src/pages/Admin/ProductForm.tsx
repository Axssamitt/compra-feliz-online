
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Product, NewProduct } from '../../types/supabase';
import { useToast } from '@/hooks/use-toast';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    purchase_link: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct(parseInt(id, 10));
    }
  }, [id, isEditMode]);

  const fetchProduct = async (productId: number) => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to include purchase_link
        setFormData({
          ...data,
          purchase_link: data.image_url || '' // Using image_url as fallback for purchase_link
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto. Tente novamente mais tarde.",
        variant: "destructive"
      });
      navigate('/admin');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace('product-', '')]: id === 'product-price' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract Supabase-compatible fields (excluding purchase_link)
      const { purchase_link, ...supabaseData } = formData;
      
      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update({
            name: supabaseData.name,
            price: supabaseData.price,
            description: supabaseData.description,
            image_url: supabaseData.image_url,
            // Note: We're not including purchase_link in the database update
          })
          .eq('id', Number(id));

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([supabaseData]);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">
          {isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h2>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-dark-700 p-6 rounded-lg shadow border border-gold-500"
      >
        <div className="mb-4">
          <label htmlFor="product-name" className="block gold-text mb-2">Nome do Produto</label>
          <input 
            type="text" 
            id="product-name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="product-price" className="block gold-text mb-2">Preço</label>
          <input 
            type="number" 
            step="0.01" 
            id="product-price" 
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="product-description" className="block gold-text mb-2">Descrição</label>
          <textarea 
            id="product-description" 
            rows={3} 
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="product-image_url" className="block gold-text mb-2">URL da Imagem</label>
          <input 
            type="url" 
            id="product-image_url" 
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="product-purchase_link" className="block gold-text mb-2">Link de Compra</label>
          <input 
            type="url" 
            id="product-purchase_link" 
            value={formData.purchase_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
            required
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gold-500 rounded-lg text-gold-500 hover:bg-dark-600"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
