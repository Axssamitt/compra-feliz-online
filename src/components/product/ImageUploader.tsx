
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Folder } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  initialImageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, initialImageUrl }) => {
  const [selectedOption, setSelectedOption] = useState<'url' | 'upload' | 'existing'>('url');
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching existing images (in a real app, this would come from the backend)
    const defaultImages = [
      '/images/smartphone.jpg',
      '/images/headphones.jpg',
      '/images/tshirt.jpg',
      '/images/coffeemaker.jpg',
      '/images/cream.jpg',
      '/images/yogamat.jpg',
    ];
    setExistingImages(defaultImages);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    onImageSelected(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('O arquivo selecionado não é uma imagem válida.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter menos de 5MB.');
      return;
    }

    setIsLoading(true);

    try {
      // In a real app with backend, you would upload to server here
      // For this demo, we'll create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl);
        onImageSelected(dataUrl);
        setIsLoading(false);
        toast.success('Imagem carregada com sucesso!');
      };
      reader.onerror = () => {
        toast.error('Erro ao carregar a imagem.');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao processar a imagem.');
      setIsLoading(false);
    }
  };

  const handleExistingImageSelect = (url: string) => {
    setImageUrl(url);
    onImageSelected(url);
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedOption}
        onValueChange={(value) => setSelectedOption(value as 'url' | 'upload' | 'existing')}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="url" id="url" />
          <Label htmlFor="url">URL da Imagem</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload">Fazer Upload</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="existing" />
          <Label htmlFor="existing">Imagens Existentes</Label>
        </div>
      </RadioGroup>

      {selectedOption === 'url' && (
        <Input
          type="text"
          placeholder="https://exemplo.com/imagem.jpg"
          value={imageUrl}
          onChange={handleUrlChange}
        />
      )}

      {selectedOption === 'upload' && (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            onClick={() => document.getElementById('image-upload')?.click()}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? 'Carregando...' : 'Selecionar Arquivo'}
          </Button>
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-48 rounded-md object-contain"
              />
            </div>
          )}
        </div>
      )}

      {selectedOption === 'existing' && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((img, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-md border-2 p-1 transition-all ${
                imageUrl === img ? 'border-gold-500' : 'border-transparent'
              }`}
              onClick={() => handleExistingImageSelect(img)}
            >
              <img
                src={img}
                alt={`Existing image ${index + 1}`}
                className="aspect-square w-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {imageUrl && selectedOption !== 'upload' && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-48 rounded-md object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
