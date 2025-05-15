
import fs from 'fs';
import path from 'path';
import { supabase } from '@/integrations/supabase/client';

// Ensure storage bucket exists
export async function ensureProductImagesBucket() {
  try {
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
        console.error('Error creating bucket:', createBucketError);
        return false;
      }
      console.log('Bucket created successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
    return false;
  }
}

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
