import { useState, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadFile } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { UploadZone } from './UploadZone';
import { ShareLink } from './ShareLink';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadFile(file);
      setShareLink(url);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setShareLink('');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Share Your Files</h1>
      </div>

      <div className="space-y-6">
        <UploadZone
          onFileSelect={handleFileSelect}
          isLoading={loading}
          selectedFile={file}
        />

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload File</span>
              </>
            )}
          </button>
        )}

        {shareLink && <ShareLink url={shareLink} />}
      </div>
    </div>
  );
}