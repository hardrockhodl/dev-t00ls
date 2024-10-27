import { supabase, BUCKET_NAME } from './supabase';

export interface UploadProgress {
  progress: number;
  message: string;
}

export interface DownloadProgress {
  progress: number;
  message: string;
}

export function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8).toLowerCase();
}

export async function uploadFile(
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<string> {
  const shortCode = generateShortCode();
  const fileName = `${shortCode}-${file.name}`;

  try {
    onProgress({ progress: 20, message: 'Starting upload...' });

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    onProgress({ progress: 100, message: 'Upload complete!' });
    return shortCode;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}

export async function downloadFile(
  code: string,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  try {
    onProgress({ progress: 20, message: 'Locating file...' });

    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (listError) throw listError;

    const file = files.find(f => f.name.startsWith(code));
    if (!file) throw new Error('File not found or has expired');

    onProgress({ progress: 50, message: 'Preparing download...' });

    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(file.name, 300); // 5 minutes expiry

    if (urlError) throw urlError;
    if (!urlData?.signedUrl) throw new Error('Failed to generate download URL');

    onProgress({ progress: 80, message: 'Starting download...' });

    const response = await fetch(urlData.signedUrl);
    if (!response.ok) throw new Error('Failed to download file');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name.substring(7); // Remove shortCode prefix
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    onProgress({ progress: 100, message: 'Download complete!' });

    // Schedule file deletion after successful download
    setTimeout(async () => {
      try {
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([file.name]);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }, 5000);
  } catch (error) {
    console.error('Download error:', error);
    throw error instanceof Error ? error : new Error('Failed to download file');
  }
}