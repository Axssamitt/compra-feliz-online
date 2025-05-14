
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from '@/types/supabase';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [purchaseLink, setPurchaseLink] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setName(data.name);
        setDescription(data.description || '');
        setPrice(data.price.toString());
        setImageUrl(data.image_url || '');
        setPurchaseLink(data.purchase_link || '');
        setCategoryId(data.category_id ? data.category_id.toString() : '');
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o produto.",
        variant: "destructive"
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setShowNewCategoryInput(true);
      setCategoryId('');
    } else {
      setShowNewCategoryInput(false);
      setCategoryId(value);
    }
  };

  const createCategory = async (): Promise<number | null> => {
    if (!newCategory.trim()) return null;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update categories list
      setCategories([...categories, data]);
      
      toast({
        title: "Categoria criada",
        description: `A categoria "${newCategory}" foi criada com sucesso.`
      });
      
      return data.id;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Process category first
      let finalCategoryId = parseInt(categoryId);
      
      if (showNewCategoryInput) {
        const newCatId = await createCategory();
        if (newCatId) finalCategoryId = newCatId;
      }
      
      // Format price to number
      const numericPrice = parseFloat(price.replace(',', '.'));
      
      if (isNaN(numericPrice)) {
        throw new Error('Preço inválido');
      }

      const productData = {
        name,
        description: description || null,
        price: numericPrice,
        image_url: imageUrl || null,
        purchase_link: purchaseLink || null,
        category_id: finalCategoryId || null
      };

      if (isEditMode) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso."
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
        
        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso."
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">
          {isEditMode ? 'Editar Produto' : 'Adicionar Produto'}
        </h2>
      </div>
      
      <Card className="bg-dark-700 border border-gold-500">
        <CardHeader>
          <CardTitle className="text-gold-500">
            {isEditMode ? 'Editar Produto' : 'Novo Produto'}
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para {isEditMode ? 'atualizar o' : 'criar um novo'} produto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-dark-800 border-gold-500 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-dark-800 border-gold-500 text-white"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-dark-800 border-gold-500 text-white"
                  placeholder="0,00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={categoryId.toString()} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="bg-dark-800 border-gold-500 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Sem categoria</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Nova categoria</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                {showNewCategoryInput && (
                  <div className="mt-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-dark-800 border-gold-500 text-white"
                      placeholder="Nome da nova categoria"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-dark-800 border-gold-500 text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {imageUrl && (
                <div className="mt-2 p-2 border border-gold-500 rounded-md">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-40 max-w-full object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Erro+na+imagem';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseLink">Link de Compra</Label>
              <Input
                id="purchaseLink"
                type="url"
                value={purchaseLink}
                onChange={(e) => setPurchaseLink(e.target.value)}
                className="bg-dark-800 border-gold-500 text-white"
                placeholder="https://exemplo.com/comprar"
              />
            </div>
            
            <div className="flex gap-4 pt-2">
              <Button 
                type="submit" 
                className="bg-gold-500 hover:bg-gold-600 text-dark-900"
                disabled={saving}
              >
                {saving ? 'Salvando...' : isEditMode ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="border-gold-500 text-gold-500 hover:bg-dark-600"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
