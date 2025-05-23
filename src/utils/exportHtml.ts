
import { Product } from '../types/supabase';
import { supabase } from '../integrations/supabase/client';

export const generateHtml = async (products: Product[]): Promise<string> => {
  // Fetch company info first
  const { data: companyInfoData } = await supabase
    .from('company_info')
    .select('*')
    .order('id')
    .limit(1)
    .single();
  
  const companyInfo = companyInfoData || {
    name: 'RJ Ecommerce',
    address: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    facebook: ''
  };
  
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
    .no-image {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2a2a2a;
      color: #777;
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
    .contact-info {
      background: #1a1a1a;
      padding: 20px;
      margin-top: 40px;
      border-radius: 8px;
      border: 1px solid #d4af37;
    }
    .contact-info h3 {
      color: #d4af37;
      margin-bottom: 15px;
    }
    .contact-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .contact-item i {
      color: #d4af37;
      margin-right: 10px;
      font-size: 1.2rem;
    }
    .empty-products {
      text-align: center;
      padding: 40px 0;
      color: #b0b0b0;
    }
    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  `;

  const productsSections = Object.keys(productsByCategory).length > 0 
    ? Object.entries(productsByCategory).map(([category, products]) => `
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
                            <a href="${product.purchase_link || '#'}" class="buy-button" target="_blank">Comprar Agora</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `).join('')
    : `<div class="empty-products">
          <h2>Loja em construção</h2>
          <p>Nossa loja está sendo preparada. Em breve teremos produtos disponíveis para você!</p>
       </div>`;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${companyInfo.name || 'Loja'} - Catálogo de Produtos</title>
        <style>${css}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <body>
        <header>
            <div class="container">
                <h1>${companyInfo.name || 'RJ Ecommerce'}</h1>
                <p>Nossa seleção de produtos</p>
            </div>
        </header>
        
        <main class="container">
            ${productsSections}
            
            <div class="contact-info">
                <h3>Entre em Contato</h3>
                <div class="contact-list">
                    ${companyInfo.address ? `
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${companyInfo.address}</span>
                        </div>
                    ` : ''}
                    
                    ${companyInfo.email ? `
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span><a href="mailto:${companyInfo.email}" style="color: inherit; text-decoration: none;">${companyInfo.email}</a></span>
                        </div>
                    ` : ''}
                    
                    ${companyInfo.phone ? `
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span><a href="tel:${companyInfo.phone}" style="color: inherit; text-decoration: none;">${companyInfo.phone}</a></span>
                        </div>
                    ` : ''}
                    
                    ${companyInfo.whatsapp ? `
                        <div class="contact-item">
                            <i class="fab fa-whatsapp"></i>
                            <span><a href="https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: inherit; text-decoration: none;">${companyInfo.whatsapp}</a></span>
                        </div>
                    ` : ''}
                    
                    ${companyInfo.instagram ? `
                        <div class="contact-item">
                            <i class="fab fa-instagram"></i>
                            <span><a href="https://instagram.com/${companyInfo.instagram.replace('@', '')}" target="_blank" style="color: inherit; text-decoration: none;">@${companyInfo.instagram.replace('@', '')}</a></span>
                        </div>
                    ` : ''}
                    
                    ${companyInfo.facebook ? `
                        <div class="contact-item">
                            <i class="fab fa-facebook"></i>
                            <span><a href="https://facebook.com/${companyInfo.facebook}" target="_blank" style="color: inherit; text-decoration: none;">${companyInfo.facebook}</a></span>
                        </div>
                    ` : ''}
                </div>
            </div>
        </main>
        
        <footer>
            <div class="container">
                <p>&copy; ${new Date().getFullYear()} ${companyInfo.name || 'RJ Ecommerce'}. Todos os direitos reservados.</p>
            </div>
        </footer>
    </body>
    </html>
  `;

  return html;
};
