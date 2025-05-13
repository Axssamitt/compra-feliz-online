
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { Product } from '../../types/supabase';

const ExportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateHtml = async (products: Product[]): Promise<string> => {
    // Group products by category
    const productsByCategory: Record<string, Product[]> = {};
    const categoriesMap: Record<number, string> = {};
    
    // First fetch all categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');
      
    if (categories) {
      categories.forEach(cat => {
        categoriesMap[cat.id] = cat.name;
      });
    }
    
    // Group products by category
    products.forEach(product => {
      const categoryName = product.category_id && categoriesMap[product.category_id] 
        ? categoriesMap[product.category_id] 
        : 'Sem Categoria';
        
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }
      productsByCategory[categoryName].push(product);
    });
    
    const css = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }
      body {
        background-color: #121212;
        color: #e0e0e0;
        line-height: 1.6;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      header {
        background: #1a1a1a;
        border-bottom: 2px solid #d4af37;
        padding: 20px 0;
        text-align: center;
      }
      h1 {
        color: #d4af37;
        font-size: 2.5rem;
        margin-bottom: 10px;
      }
      .category-section {
        margin: 40px 0;
      }
      h2 {
        color: #d4af37;
        font-size: 1.8rem;
        border-bottom: 1px solid #d4af37;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .product-card {
        background: #1a1a1a;
        border: 1px solid #d4af37;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s;
      }
      .product-card:hover {
        transform: translateY(-5px);
      }
      .product-image {
        height: 200px;
        overflow: hidden;
      }
      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .product-details {
        padding: 15px;
      }
      .product-name {
        color: #d4af37;
        font-size: 1.2rem;
        margin-bottom: 10px;
      }
      .product-price {
        color: #d4af37;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .product-description {
        color: #b0b0b0;
        margin-bottom: 15px;
      }
      .buy-button {
        background: #d4af37;
        color: #121212;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: background 0.3s;
      }
      .buy-button:hover {
        background: #b8960b;
      }
      footer {
        background: #1a1a1a;
        border-top: 2px solid #d4af37;
        text-align: center;
        padding: 20px 0;
        margin-top: 40px;
      }
      @media (max-width: 768px) {
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }
    `;

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Loja - Exportação HTML</title>
          <style>${css}</style>
      </head>
      <body>
          <header>
              <div class="container">
                  <h1>RJ Ecommerce</h1>
                  <p>Nossa seleção de produtos</p>
              </div>
          </header>
          
          <main class="container">
              ${Object.entries(productsByCategory).map(([category, products]) => `
                  <section class="category-section">
                      <h2>${category}</h2>
                      <div class="products-grid">
                          ${products.map(product => `
                              <div class="product-card">
                                  <div class="product-image">
                                      ${product.image_url ? 
                                          `<img src="${product.image_url}" alt="${product.name}">` : 
                                          '<div class="no-image">Sem imagem</div>'
                                      }
                                  </div>
                                  <div class="product-details">
                                      <h3 class="product-name">${product.name}</h3>
                                      <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                                      <p class="product-description">${product.description || ''}</p>
                                      <a href="${product.purchase_link}" class="buy-button" target="_blank">Comprar Agora</a>
                                  </div>
                              </div>
                          `).join('')}
                      </div>
                  </section>
              `).join('')}
          </main>
          
          <footer>
              <div class="container">
                  <p>&copy; ${new Date().getFullYear()} RJ Ecommerce. Todos os direitos reservados.</p>
              </div>
          </footer>
      </body>
      </html>
    `;

    return html;
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all products
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      if (!products || products.length === 0) {
        toast({
          title: "Aviso",
          description: "Não há produtos para exportar.",
          variant: "default"
        });
        setLoading(false);
        return;
      }

      // Convert products to include purchase_link
      const productsWithLinks = products.map(product => ({
        ...product,
        purchase_link: product.purchase_link || product.image_url || ''
      }));

      // Generate HTML
      const html = await generateHtml(productsWithLinks);
      
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

  const downloadHtml = () => {
    if (!exportUrl) return;
    
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = 'loja.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              <button 
                onClick={downloadHtml}
                className="px-4 py-2 border border-gold-500 text-gold-500 rounded-lg hover:bg-dark-600"
              >
                Baixar HTML
              </button>
              <div className="p-4 bg-dark-800 rounded border border-gold-500 overflow-auto">
                <pre className="text-xs text-gray-300">
                  &lt;!DOCTYPE html&gt;<br/>
                  &lt;html&gt;<br/>
                  &nbsp;&nbsp;&lt;head&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Loja - Exportação HTML&lt;/title&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                  &nbsp;&nbsp;&lt;/head&gt;<br/>
                  &nbsp;&nbsp;&lt;body&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                  &nbsp;&nbsp;&lt;/body&gt;<br/>
                  &lt;/html&gt;
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
