
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { uploadImage } from '@/utils/imageUtils';

interface ImageUploaderProps {
  productId: number | null;
  disabled: boolean;
  onUploadSuccess: (imageData: { image_url: string, image_path?: string | null }) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  productId, 
  disabled,
  onUploadSuccess 
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !productId) return;
    
    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload file to storage
        const { success, imageUrl, filePath, error } = await uploadImage(file);
        
        if (!success || !imageUrl) {
          toast({
            title: "Erro ao enviar imagem",
            description: error || "Não foi possível enviar a imagem.",
            variant: "destructive"
          });
          continue;
        }
        
        // Save to product_images table
        const { error: dbError, data: imageData } = await saveImageToDatabase({
          productId,
          imageUrl,
          filePath
        });
        
        if (dbError) {
          toast({
            title: "Erro ao salvar imagem",
            description: "A imagem foi enviada, mas não foi possível salvá-la no banco de dados.",
            variant: "destructive"
          });
          continue;
        }
        
        if (imageData) {
          onUploadSuccess(imageData);
        }
      }
      
      toast({
        title: "Imagens enviadas",
        description: "As imagens foram adicionadas com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro ao enviar imagens",
        description: "Não foi possível enviar as imagens.",
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
    if (!imageUrl.trim() || !productId) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL de imagem válida.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Save to product_images table
      const { error, data } = await saveImageToDatabase({
        productId,
        imageUrl
      });
        
      if (error) throw error;
      
      if (data) {
        onUploadSuccess(data);
        setImageUrl('');
      }
      
      toast({
        title: "Imagem adicionada",
        description: "A URL da imagem foi adicionada com sucesso.",
      });
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

  const saveImageToDatabase = async ({ 
    productId, 
    imageUrl, 
    filePath = null 
  }: { 
    productId: number, 
    imageUrl: string, 
    filePath?: string | null 
  }) => {
    return await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        image_path: filePath,
        is_main: false
      })
      .select()
      .single();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product-images">Enviar imagens</Label>
        <Input 
          id="product-images" 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileUpload} 
          disabled={uploading || disabled}
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
            disabled={uploading || disabled}
            className="border-gray-600 bg-dark-700 text-white"
          />
          <Button 
            onClick={addImageUrl} 
            disabled={uploading || !imageUrl.trim() || disabled}
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
    </div>
  );
};

export default ImageUploader;
