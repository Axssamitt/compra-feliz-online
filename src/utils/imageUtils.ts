
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

export const uploadImage = async (file: File) => {
  try {
    await ensureProductImagesBucket();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product_images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(filePath);
      
    return { 
      success: true,
      filePath,
      imageUrl: publicUrlData.publicUrl 
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      success: false,
      error: 'Failed to upload image' 
    };
  }
};

export const deleteImage = async (imagePath: string) => {
  if (!imagePath) return { success: true };
  
  try {
    const { error } = await supabase.storage
      .from('product_images')
      .remove([imagePath]);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from storage:', error);
    return { 
      success: false,
      error: 'Failed to delete image from storage' 
    };
  }
};
