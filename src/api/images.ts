
import fs from 'fs';
import path from 'path';

export async function fetchImages() {
  const imagesDir = path.join(process.cwd(), 'src/images');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      return { images: [] };
    }
    
    // Read directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => `/images/${file}`);
    
    return { images };
  } catch (error) {
    console.error('Error reading images directory:', error);
    return { images: [], error: 'Failed to read images directory' };
  }
}
