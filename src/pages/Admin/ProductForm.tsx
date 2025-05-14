import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Category } from '../../types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    price: 0,
    description: null,
    image_url: null,
    category_id: null,
    created_at: null,
    purchase_link: null,
  });
  const { toast } = useToast();

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
    if (!newCategory.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: newCategory.trim() })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCategoryId(Number(data.id));
        setCategories([...categories, data]);
        
        toast({
          title: "Categoria criada",
          description: `Categoria "${newCategory}" foi criada com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .insert([{ ...product, category_id: categoryId }]);
      
      if (error) throw error;

      toast({
        title: "Produto salvo",
        description: "O produto foi salvo com sucesso.",
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (newCategory && !categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
        await createCategory();
      }
      
      await saveProduct();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div>
      <h1 className="text-2xl font-bold">Adicionar Produto</h1>
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
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
