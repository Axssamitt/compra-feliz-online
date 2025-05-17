
import React, { useEffect } from 'react';
import { useProductImages, ProductImage as ProductImageType } from '@/hooks/useProductImages';
import ProductImage from './ProductImage';
import ImageUploader from './ImageUploader';

interface ProductImageManagerProps {
  productId: number;
  onImagesChange?: (images: ProductImageType[]) => void;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ 
  productId,
  onImagesChange
}) => {
  const { 
    images, 
    loading, 
    fetchImages,
    addImage, 
    removeImage, 
    setMainImage 
  } = useProductImages(productId, onImagesChange);
  
  // Refetch images when productId changes
  useEffect(() => {
    if (productId) {
      fetchImages();
    }
  }, [productId, fetchImages]);
  
  const handleUploadSuccess = (imageData: { image_url: string, image_path?: string | null }) => {
    // When a new image is uploaded, add it to the list
    const newImage = {
      id: crypto.randomUUID(),
      image_url: imageData.image_url,
      image_path: imageData.image_path || null,
      is_main: images.length === 0, // If this is the first image, set as main
    };
    
    addImage(newImage);
  };
  
  return (
    <div className="space-y-4">
      <ImageUploader 
        productId={productId}
        disabled={loading} 
        onUploadSuccess={handleUploadSuccess} 
      />
      
      {loading ? (
        <div className="py-4 text-center">
          <p>Carregando imagens...</p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mt-4 mb-2">Imagens do Produto</h3>
          {images.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-4">
              Nenhuma imagem adicionada ainda. Envie imagens acima.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(image => (
                <ProductImage 
                  key={image.id}
                  id={image.id}
                  imageUrl={image.image_url}
                  isMain={image.is_main}
                  onSetMain={setMainImage}
                  onRemove={removeImage}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
