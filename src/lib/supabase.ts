import { createClient } from '@supabase/supabase-js';
import { shortenUrl } from './urlShortener';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const BUCKET_NAME = 'supabase-orange-river';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data, error: urlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(fileName, 3600);

  if (urlError) throw urlError;
  if (!data?.signedUrl) throw new Error('Failed to generate download URL');

  // Schedule file deletion after 1 hour
  setTimeout(async () => {
    try {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, 3600000);

  // Try to shorten the URL
  try {
    const shortUrl = await shortenUrl(data.signedUrl);
    return shortUrl;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return data.signedUrl; // Fallback to original URL if shortening fails
  }
}