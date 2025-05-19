
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductImageManager from '@/components/ProductImageManager';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProductForm } from '@/hooks/useProductForm';
import ProductFormFields from '@/components/ProductFormFields';

const ProductForm: React.FC = () => {
  const {
    state,
    isEditMode,
    updateProduct,
    handleCategoryChange,
    handleSubmit,
    handleImageManagerClose,
    handleImagesChange
  } = useProductForm();

  if (state.isLoading) {
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
      
      {/* Main product form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductFormFields
          product={state.product}
          onProductChange={updateProduct}
          categories={state.categories}
          newCategory={state.newCategory}
          onCategoryChange={handleCategoryChange}
          mainImageUrl={state.mainImageUrl}
        />
        
        <Button type="submit" disabled={state.isSubmitting} className="w-full">
          {state.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Salvando...' : 'Criando...'}
            </>
          ) : (
            isEditMode ? 'Salvar Alterações' : 'Criar Produto'
          )}
        </Button>
      </form>
      
      {/* Image Manager Dialog */}
      <Dialog open={state.showImageManager} onOpenChange={handleImageManagerClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Imagens do Produto</DialogTitle>
          </DialogHeader>
          {state.savedProductId && (
            <ProductImageManager 
              productId={state.savedProductId} 
              onImagesChange={handleImagesChange}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={handleImageManagerClose}>Concluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductForm;
