
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { deleteImage } from '@/utils/imageUtils';

export interface ProductImage {
  id: string;
  image_url: string;
  image_path?: string | null;
  is_main: boolean;
}

export const useProductImages = (productId: number | null, onChange?: (images: ProductImage[]) => void) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (productId) {
      fetchProductImages();
    } else {
      setImages([]);
    }
  }, [productId]);
  
  const fetchProductImages = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('is_main', { ascending: false });

      if (error) throw error;
      
      setImages(data || []);
      if (onChange) onChange(data || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
      toast({
        title: "Erro ao carregar imagens",
        description: "Não foi possível carregar as imagens do produto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addImage = (newImage: ProductImage) => {
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    if (onChange) onChange(updatedImages);
  };
  
  const removeImage = async (imageId: string) => {
    try {
      // Get the image data first
      const imageToRemove = images.find(img => img.id === imageId);
      if (!imageToRemove) return;
      
      // Delete from database
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;

      // If the image has a path, also remove it from storage
      if (imageToRemove.image_path) {
        await deleteImage(imageToRemove.image_path);
      }
      
      // Update local state
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      if (onChange) onChange(updatedImages);
      
      // If we removed the main image and there are other images, set a new main
      if (imageToRemove.is_main && updatedImages.length > 0) {
        await setMainImage(updatedImages[0].id);
      }
      
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Erro ao remover imagem",
        description: "Não foi possível remover a imagem.",
        variant: "destructive"
      });
    }
  };
  
  const setMainImage = async (imageId: string) => {
    try {
      // Find the current main image and update it to not be main
      const currentMain = images.find(img => img.is_main);
      if (currentMain && currentMain.id !== imageId) {
        await supabase
          .from('product_images')
          .update({ is_main: false })
          .eq('id', currentMain.id);
      }
      
      // Set the new main image
      const { error } = await supabase
        .from('product_images')
        .update({ is_main: true })
        .eq('id', imageId);
        
      if (error) throw error;
      
      // Update local state
      const updatedImages = images.map(img => ({
        ...img,
        is_main: img.id === imageId
      }));
      
      setImages(updatedImages);
      if (onChange) onChange(updatedImages);
      
      toast({
        title: "Imagem principal definida",
        description: "A imagem principal foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error setting main image:', error);
      toast({
        title: "Erro ao definir imagem principal",
        description: "Não foi possível definir a imagem principal.",
        variant: "destructive"
      });
    }
  };
  
  return {
    images,
    loading,
    fetchImages: fetchProductImages,
    addImage,
    removeImage,
    setMainImage
  };
};
