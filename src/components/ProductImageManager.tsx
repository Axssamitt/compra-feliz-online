
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, X, ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProductImage {
  id: string;
  image_url: string;
  image_path?: string | null;
  is_main: boolean;
}

interface ProductImageManagerProps {
  productId: number | null;
  onImagesChange?: (images: ProductImage[]) => void;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ productId, onImagesChange }) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();
  const MAX_IMAGES = 5;

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
      if (onImagesChange) onImagesChange(data || []);
      console.log('Fetched images:', data);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (images.length + files.length > MAX_IMAGES) {
      toast({
        title: "Limite de imagens excedido",
        description: `Você pode adicionar no máximo ${MAX_IMAGES} imagens por produto.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        console.log('Uploading file:', fileName);
        
        // Check if the product_images bucket exists
        const { data: bucketExists, error: bucketError } = await supabase.storage
          .getBucket('product_images');
          
        // If bucket doesn't exist, create it
        if (bucketError && bucketError.message.includes('does not exist')) {
          console.log('Bucket does not exist, creating...');
          const { error: createBucketError } = await supabase.storage
            .createBucket('product_images', {
              public: true
            });
            
          if (createBucketError) {
            throw createBucketError;
          }
          console.log('Bucket created successfully');
        }
        
        // Upload to Supabase Storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        console.log('File uploaded successfully');
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product_images')
          .getPublicUrl(filePath);
          
        console.log('Public URL:', publicUrlData.publicUrl);
        
        // Save to product_images table
        const isMain = images.length === 0; // First image is main
        const { error: dbError, data: imageData } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            image_path: filePath,
            is_main: isMain
          })
          .select()
          .single();
          
        if (dbError) throw dbError;
        
        console.log('Image saved to database:', imageData);
        
        // Update local state
        if (imageData) {
          setImages(prev => [...prev, imageData]);
          if (onImagesChange) onImagesChange([...images, imageData]);
        }
      }
      
      toast({
        title: "Imagens enviadas",
        description: "As imagens foram adicionadas com sucesso.",
      });
      
      // Refresh the images list
      fetchProductImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro ao enviar imagens",
        description: "Não foi possível enviar as imagens. Verifique se o bucket 'product_images' existe.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset the input
      const fileInput = document.getElementById('product-images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const addImageUrl = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL de imagem válida.",
        variant: "destructive"
      });
      return;
    }
    
    if (images.length >= MAX_IMAGES) {
      toast({
        title: "Limite de imagens excedido",
        description: `Você pode adicionar no máximo ${MAX_IMAGES} imagens por produto.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Save to product_images table
      const isMain = images.length === 0; // First image is main
      const { error, data } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: imageUrl,
          is_main: isMain
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      if (data) {
        setImages(prev => [...prev, data]);
        if (onImagesChange) onImagesChange([...images, data]);
        setImageUrl('');
      }
      
      toast({
        title: "Imagem adicionada",
        description: "A URL da imagem foi adicionada com sucesso.",
      });
      
      // Refresh the images list
      fetchProductImages();
    } catch (error) {
      console.error('Error adding image URL:', error);
      toast({
        title: "Erro ao adicionar imagem",
        description: "Não foi possível adicionar a URL da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
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
        const { error: storageError } = await supabase.storage
          .from('product_images')
          .remove([imageToRemove.image_path]);
          
        if (storageError) console.error('Error removing from storage:', storageError);
      }
      
      // Update local state
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);
      
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
      if (onImagesChange) onImagesChange(updatedImages);
      
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

  if (loading) {
    return <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-gold-500" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Display existing images */}
        {images.length > 0 && (
          <div>
            <Label className="mb-2 block">Imagens do produto ({images.length}/{MAX_IMAGES})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative rounded-md border ${image.is_main ? 'border-gold-500 ring-2 ring-gold-500' : 'border-gray-600'}`}
                >
                  <img 
                    src={image.image_url} 
                    alt="Product" 
                    className="h-24 w-full object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-1 right-1 flex space-x-1">
                    {!image.is_main && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-5 w-5 bg-dark-800 hover:bg-dark-700"
                        onClick={() => setMainImage(image.id)}
                        title="Definir como principal"
                      >
                        <ImagePlus size={12} className="text-gold-500" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-5 w-5 bg-dark-800 hover:bg-dark-700" 
                      onClick={() => removeImage(image.id)}
                      title="Remover imagem"
                    >
                      <X size={12} className="text-red-500" />
                    </Button>
                  </div>
                  {image.is_main && (
                    <div className="absolute bottom-1 left-1 bg-gold-500 text-dark-900 text-xs px-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new images */}
        {images.length < MAX_IMAGES && productId && (
          <>
            <div>
              <Label htmlFor="product-images">Enviar imagens (máx {MAX_IMAGES})</Label>
              <Input 
                id="product-images" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileUpload} 
                disabled={uploading || !productId}
                className="border-gray-600 bg-dark-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="image-url">Ou adicionar URL da imagem</Label>
              <div className="flex space-x-2">
                <Input 
                  id="image-url" 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  disabled={uploading || !productId}
                  className="border-gray-600 bg-dark-700 text-white"
                />
                <Button 
                  onClick={addImageUrl} 
                  disabled={uploading || !imageUrl.trim() || !productId}
                  className="whitespace-nowrap"
                >
                  {uploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adicionando...</>
                  ) : (
                    'Adicionar URL'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {images.length >= MAX_IMAGES && (
          <p className="text-sm text-gold-500">Limite de {MAX_IMAGES} imagens atingido. Remova algumas para adicionar novas.</p>
        )}

        {!productId && (
          <p className="text-sm text-gray-300">Salve o produto primeiro para adicionar imagens.</p>
        )}
      </div>
    </div>
  );
};

export default ProductImageManager;
