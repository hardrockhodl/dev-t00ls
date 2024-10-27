import { customAlphabet } from 'nanoid';

export interface FileMetadata {
  id: string;
  originalName: string;
  size: number;
  type: string;
  createdAt: number;
}

export class FileError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FileError';
  }
}

// Create a nanoid generator that uses lowercase alphanumeric chars and generates 6 char IDs
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

export async function saveFile(file: File): Promise<string> {
  try {
    const fileId = generateId();
    const formData = new FormData();
    
    // Store original filename in a custom header
    const fileExtension = file.name.split('.').pop() || '';
    const metadata = {
      id: fileId,
      originalName: file.name,
      extension: fileExtension,
      size: file.size,
      type: file.type,
      createdAt: Date.now()
    };

    formData.append('file', file);
    formData.append('id', fileId);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/.share/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new FileError(
        `Upload failed: ${response.statusText}`,
        response.status.toString()
      );
    }

    const data = await response.json();
    if (!data.id) {
      throw new FileError('Invalid response from server');
    }

    return data.id;
  } catch (error) {
    if (error instanceof FileError) {
      throw error;
    }
    throw new FileError('Failed to save file', 'UPLOAD_ERROR');
  }
}

export async function downloadFile(id: string): Promise<{ blob: Blob; filename: string }> {
  if (!/^[0-9a-z]{6}$/.test(id)) {
    throw new FileError('Invalid download code format', 'INVALID_CODE');
  }

  try {
    const response = await fetch(`/.share/files/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new FileError('File not found or has expired', 'NOT_FOUND');
      }
      throw new FileError(
        `Download failed: ${response.statusText}`,
        response.status.toString()
      );
    }

    // Get the content type to determine file extension
    const contentType = response.headers.get('content-type');
    const contentDisposition = response.headers.get('content-disposition');
    let filename = '';
    
    // Try to get original filename from content-disposition
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // If no filename found, generate one with the correct extension
    if (!filename) {
      let extension = '';
      
      // Try to get extension from content-type
      if (contentType) {
        const mimeToExt: Record<string, string> = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'text/plain': '.txt',
          'application/pdf': '.pdf',
          'application/json': '.json',
          'application/zip': '.zip',
          // Add more mime types as needed
        };
        extension = mimeToExt[contentType] || '';
      }
      
      filename = `shared-file-${id}${extension}`;
    }

    const blob = await response.blob();
    return { blob, filename };
  } catch (error) {
    if (error instanceof FileError) {
      throw error;
    }
    throw new FileError('Failed to download file', 'DOWNLOAD_ERROR');
  }
}