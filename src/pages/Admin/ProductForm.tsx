
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Product, NewProduct } from '../../types/supabase';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Image, Upload, FolderOpen } from 'lucide-react';

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
    purchase_link: '',
    category_id: null
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [imageSource, setImageSource] = useState<'url' | 'upload' | 'existing'>('url');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  useEffect(() => {
    fetchCategories();
    fetchExistingImages();
    if (isEditMode && id) {
      fetchProduct(parseInt(id, 10));
    }
  }, [id, isEditMode]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const fetchExistingImages = async () => {
    try {
      // First check if we have any image files in the public directory
      const response = await fetch('/api/images');
      if (response.ok) {
        const data = await response.json();
        setExistingImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      // Silently fail, as this is not critical
    }
  };

  const fetchProduct = async (productId: number) => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to include purchase_link
        setFormData({
          ...data,
          purchase_link: data.purchase_link || data.image_url || '',
          category_id: data.category_id
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace('product-', '')]: id === 'product-price' 
        ? parseFloat(value) 
        : id === 'product-category_id' 
          ? (value ? parseInt(value, 10) : null) 
          : value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingImage(true);
    
    try {
      // Generate a unique filename
      const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setFormData({
        ...formData,
        image_url: publicUrlData.publicUrl
      });
      
      toast({
        title: "Imagem enviada com sucesso",
        description: "Sua imagem foi carregada e vinculada ao produto.",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível enviar a imagem. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleExistingImageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      image_url: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract data for Supabase
      const supabaseData = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        image_url: formData.image_url,
        purchase_link: formData.purchase_link,
        category_id: formData.category_id
      };
      
      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update(supabaseData)
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
          <label htmlFor="product-category_id" className="block gold-text mb-2">Categoria</label>
          <select
            id="product-category_id"
            value={formData.category_id || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
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
          <label className="block gold-text mb-2">Imagem do Produto</label>
          
          <div className="flex space-x-4 mb-3">
            <button
              type="button"
              onClick={() => setImageSource('url')}
              className={`flex items-center px-4 py-2 rounded ${imageSource === 'url' ? 'gold-bg text-dark-900' : 'border border-gold-500 text-gold-500'}`}
            >
              <Image className="h-4 w-4 mr-2" /> URL
            </button>
            <button
              type="button"
              onClick={() => setImageSource('upload')}
              className={`flex items-center px-4 py-2 rounded ${imageSource === 'upload' ? 'gold-bg text-dark-900' : 'border border-gold-500 text-gold-500'}`}
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </button>
            <button
              type="button"
              onClick={() => setImageSource('existing')}
              className={`flex items-center px-4 py-2 rounded ${imageSource === 'existing' ? 'gold-bg text-dark-900' : 'border border-gold-500 text-gold-500'}`}
            >
              <FolderOpen className="h-4 w-4 mr-2" /> Existentes
            </button>
          </div>
          
          {imageSource === 'url' && (
            <input 
              type="url" 
              id="product-image_url" 
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white" 
              placeholder="https://exemplo.com/imagem.jpg"
              required={!formData.image_url}
            />
          )}
          
          {imageSource === 'upload' && (
            <div className="space-y-2">
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden" 
              />
              <label 
                htmlFor="image-upload" 
                className="inline-block px-4 py-2 border border-gold-500 rounded-lg text-gold-500 cursor-pointer hover:bg-dark-600"
              >
                {uploadingImage ? 'Enviando...' : 'Selecionar Imagem'}
              </label>
              {formData.image_url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-300">Imagem selecionada:</p>
                  <div className="mt-1 h-24 w-24 border border-gold-500 rounded overflow-hidden">
                    <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {imageSource === 'existing' && (
            <div>
              {existingImages.length > 0 ? (
                <select
                  value={formData.image_url}
                  onChange={handleExistingImageSelect}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-dark-800 border-gold-500 text-white"
                >
                  <option value="">Selecione uma imagem</option>
                  {existingImages.map((image, index) => (
                    <option key={index} value={image}>{image.split('/').pop()}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-400">Nenhuma imagem disponível.</p>
              )}
              {formData.image_url && (
                <div className="mt-2">
                  <div className="mt-1 h-24 w-24 border border-gold-500 rounded overflow-hidden">
                    <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}
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
