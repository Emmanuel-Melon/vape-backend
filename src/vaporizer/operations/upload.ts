import { PrismaClient } from '@prisma/client';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';

const prisma = new PrismaClient();

interface UploadVaporizerImageOptions {
  vaporizerId: number;
}

/**
 * Uploads a vaporizer image to Supabase storage and updates the vaporizer record with the image URL
 */
export const uploadVaporizerImage = async (
  file: Express.Multer.File,
  options: UploadVaporizerImageOptions
) => {
  if (!process.env.SERVICE_ROLE_KEY || !process.env.SUPABASE_URL) {
    throw new Error('Supabase configuration missing. Please set SERVICE_ROLE_KEY and SUPABASE_URL in your .env file');
  }
  
  // Find the vaporizer
  const vaporizer = await prisma.vaporizer.findUnique({
    where: { id: options.vaporizerId }
  });

  if (!vaporizer) {
    throw new Error(`Vaporizer with ID ${options.vaporizerId} not found`);
  }

  const uniqueId = uuidv4();
  const filename = uniqueId + path.extname(file.originalname);
  const bucket = 'vaporizer-images';

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error:', error);
    if (error.message.includes('row-level security')) {
      throw new Error('Storage permission denied. Please check your Supabase configuration and storage bucket policies.');
    }
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  if (!data || !data.path) {
    throw new Error('Upload succeeded but no path returned from Supabase');
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = await supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  // Update the vaporizer with the image URL
  // const updatedVaporizer = await prisma.vaporizer.update({
  //   where: { id: options.vaporizerId },
  //   data: { imageUrl: publicUrl }
  // });

  return { 
   // vaporizer: updatedVaporizer,
    imageUrl: publicUrl
  };
};
