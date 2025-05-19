import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Category } from '@/types/supabase';
import { ensureProductImagesBucket } from '@/utils/imageUtils';

export interface ProductFormState {
  product: Product;
  categories: Category[];
  newCategory: string;
  categoryId: number | null;
  isLoading: boolean;
  isSubmitting: boolean;
  savedProductId: number | null;
  showImageManager: boolean;
  mainImageUrl: string | null;
}

export const useProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<ProductFormState>({
    categories: [],
    newCategory: '',
    categoryId: null,
    isLoading: false,
    isSubmitting: false,
    savedProductId: null,
    showImageManager: false,
    mainImageUrl: null,
    product: {
      id: 0,
      name: '',
      price: 0,
      description: '',
      image_url: '',
      category_id: null,
      created_at: null,
      purchase_link: '',
    }
  });

  const { toast } = useToast();
  const isEditMode = Boolean(id);

  // Helper to update state
  const updateState = (newState: Partial<ProductFormState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  // Update product fields
  const updateProduct = (fields: Partial<Product>) => {
    updateState({ product: { ...state.product, ...fields } });
  };

  // Ensure storage bucket exists when component loads
  useEffect(() => {
    const checkStorageBucket = async () => {
      await ensureProductImagesBucket();
    };
    
    checkStorageBucket();
  }, []);

  // Fetch product if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      updateState({ isLoading: true });
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;

        if (data) {
          updateState({ 
            product: data,
            categoryId: data.category_id,
            savedProductId: data.id
          });
          
          // If the product has a category, set newCategory to its name
          if (data.category_id) {
            const { data: categoryData, error: categoryError } = await supabase
              .from('categories')
              .select('name')
              .eq('id', data.category_id)
              .single();
              
            if (!categoryError && categoryData) {
              updateState({ newCategory: categoryData.name });
            }
          }
          
          // Fetch main image
          const { data: imageData, error: imageError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', data.id)
            .eq('is_main', true)
            .maybeSingle();
            
          if (!imageError && imageData) {
            updateState({ mainImageUrl: imageData.image_url });
          } else {
            updateState({ mainImageUrl: data.image_url }); // Fallback to legacy image
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
        updateState({ isLoading: false });
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
        updateState({ categories: data });
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryName = e.target.value;
    updateState({ newCategory: categoryName });

    if (categoryName) {
      const categoryExists = state.categories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (categoryExists) {
        updateState({ categoryId: categoryExists.id });
      } else {
        updateState({ categoryId: null });
      }
    } else {
      updateState({ categoryId: null });
    }
  };

  const createCategory = async () => {
    if (!state.newCategory.trim()) return null;
    
    try {
      // Check if the category already exists
      const { data: existingCategory, error: findError } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', state.newCategory.trim())
        .maybeSingle();

      if (findError) throw findError;

      // If category exists, return its ID
      if (existingCategory) {
        updateState({ categoryId: existingCategory.id });
        return existingCategory.id;
      }

      // Otherwise create new category
      const { data: newCategoryData, error } = await supabase
        .from('categories')
        .insert({ name: state.newCategory.trim() })
        .select()
        .single();
      
      if (error) throw error;
      
      if (newCategoryData) {
        updateState({ 
          categoryId: Number(newCategoryData.id),
          categories: [...state.categories, newCategoryData]
        });
        
        toast({
          title: "Categoria criada",
          description: `Categoria "${state.newCategory}" foi criada com sucesso.`,
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
    updateState({ isSubmitting: true });
    
    try {
      // Handle category first
      let finalCategoryId = state.categoryId;
      
      if (state.newCategory && !state.categoryId) {
        finalCategoryId = await createCategory();
      }
      
      const productData = {
        ...state.product,
        category_id: finalCategoryId
      };
      
      let result;
      
      if (isEditMode) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', parseInt(id as string))
          .select()
          .single();
          
        if (result.error) throw result.error;
        updateState({ savedProductId: parseInt(id as string) });
        
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
          
        if (result.error) throw result.error;
        
        if (result.data) {
          updateState({ savedProductId: result.data.id });
        }
      }
      
      toast({
        title: isEditMode ? "Produto atualizado" : "Produto criado",
        description: isEditMode 
          ? "O produto foi atualizado com sucesso. Você pode gerenciar as imagens agora." 
          : "O produto foi criado com sucesso. Você pode adicionar imagens agora.",
      });
      
      // Open image manager if we have a product ID
      if (state.savedProductId || (result.data && result.data.id)) {
        const productId = state.savedProductId || (result.data && result.data.id);
        updateState({ 
          savedProductId: productId,
          showImageManager: true 
        });
        console.log("Saved product ID for image manager:", productId);
      } else {
        // Redirect to products list if for some reason we don't have a product ID
        navigate('/admin');
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  const handleImageManagerClose = () => {
    updateState({ showImageManager: false });
    // Redirect to products list
    navigate('/admin');
  };

  const handleImagesChange = (images: any[]) => {
    console.log("Images changed:", images);
    const mainImage = images.find(img => img.is_main);
    if (mainImage) {
      updateState({ mainImageUrl: mainImage.image_url });
    }
  };

  return {
    state,
    isEditMode,
    updateProduct,
    handleCategoryChange,
    handleSubmit,
    handleImageManagerClose,
    handleImagesChange
  };
};
