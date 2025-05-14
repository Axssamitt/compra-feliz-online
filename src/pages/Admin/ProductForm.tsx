import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Category } from '../../types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    price: 0,
    description: '',
    image_url: '',
    category_id: null,
    created_at: null,
    purchase_link: '',
  });
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  // Fetch product if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id)) // Convert string id to number
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data);
          setCategoryId(data.category_id);
          
          // If the product has a category, set newCategory to its name
          if (data.category_id) {
            const { data: categoryData, error: categoryError } = await supabase
              .from('categories')
              .select('name')
              .eq('id', data.category_id)
              .single();
              
            if (!categoryError && categoryData) {
              setNewCategory(categoryData.name);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erro ao carregar produto",
          description: "Não foi possível carregar os dados do produto.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryName = e.target.value;
    setNewCategory(categoryName);

    if (categoryName) {
      const categoryExists = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
      if (categoryExists) {
        setCategoryId(categoryExists.id);
      } else {
        setCategoryId(null);
      }
    } else {
      setCategoryId(null);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return null;
    
    try {
      // Check if the category already exists
      const { data: existingCategory, error: findError } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', newCategory.trim())
        .maybeSingle();

      if (findError) throw findError;

      // If category exists, return its ID
      if (existingCategory) {
        setCategoryId(existingCategory.id);
        return existingCategory.id;
      }

      // Otherwise create new category
      const { data: newCategoryData, error } = await supabase
        .from('categories')
        .insert({ name: newCategory.trim() })
        .select()
        .single();
      
      if (error) throw error;
      
      if (newCategoryData) {
        setCategoryId(Number(newCategoryData.id));
        setCategories([...categories, newCategoryData]);
        
        toast({
          title: "Categoria criada",
          description: `Categoria "${newCategory}" foi criada com sucesso.`,
        });
        return newCategoryData.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle category first
      let finalCategoryId = categoryId;
      
      if (newCategory && !categoryId) {
        finalCategoryId = await createCategory();
      }
      
      const productData = {
        ...product,
        category_id: finalCategoryId
      };
      
      let result;
      
      if (isEditMode) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', parseInt(id as string)); // Convert string id to number
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }
      
      if (result.error) throw result.error;

      toast({
        title: isEditMode ? "Produto atualizado" : "Produto criado",
        description: isEditMode 
          ? "O produto foi atualizado com sucesso." 
          : "O produto foi criado com sucesso.",
      });
      
      // Redirect to products list
      navigate('/admin');
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold gold-text mb-6">
        {isEditMode ? 'Editar Produto' : 'Adicionar Produto'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <div className="flex space-x-2">
            <Input 
              id="category"
              value={newCategory}
              onChange={handleCategoryChange}
              placeholder="Digite ou selecione uma categoria"
              list="categories-list"
            />
            <datalist id="categories-list">
              {categories.map(category => (
                <option key={category.id} value={category.name} />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <Label htmlFor="purchase_link">Link de Compra</Label>
          <Input
            id="purchase_link"
            value={product.purchase_link || ''}
            onChange={(e) => setProduct({ ...product, purchase_link: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="image">Imagem</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {product.image_url && (
            <div className="mt-2">
              <p className="mb-1 text-sm">Preview:</p>
              <img 
                src={product.image_url} 
                alt="Preview" 
                className="h-32 w-32 object-cover rounded-md border border-gold-500" 
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Salvando...' : 'Criando...'}
            </>
          ) : (
            isEditMode ? 'Salvar Alterações' : 'Criar Produto'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
