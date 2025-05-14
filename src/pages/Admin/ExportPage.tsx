
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { Product } from '../../types/supabase';
import { generateHtml } from '../../utils/exportHtml';
import HtmlPreview from '../../components/ExportHtml/HtmlPreview';
import DownloadButton from '../../components/ExportHtml/DownloadButton';

const ExportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all products
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      // Even if there are no products, we'll generate the HTML
      const productsToUse = products || [];

      // Generate HTML
      const html = await generateHtml(productsToUse);
      
      // Create a blob and download link
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setExportUrl(url);

      toast({
        title: "Exportação concluída",
        description: "O HTML da loja foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o HTML da loja.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold gold-text">Exportar Loja</h2>
      </div>
      
      <div className="bg-dark-700 p-6 rounded-lg shadow border border-gold-500">
        <p className="text-gray-300 mb-4">
          Exporte sua loja como um arquivo HTML estático que pode ser hospedado em qualquer servidor web.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 gold-bg text-dark-900 rounded-lg hover:bg-gold-600 disabled:opacity-50"
          >
            {loading ? 'Gerando HTML...' : 'Gerar HTML'}
          </button>
          
          {exportUrl && (
            <div className="flex flex-col space-y-4">
              <p className="text-green-400">HTML gerado com sucesso!</p>
              <DownloadButton exportUrl={exportUrl} />
              <HtmlPreview exportUrl={exportUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
