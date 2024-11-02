import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../lib/supabase';
import { CloudUploadSection } from '../components/cloud-sharing/CloudUploadSection';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileSharing() {
  const [file, setFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ progress: 0, message: '' });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 50MB limit');
        return;
      }
      setFile(selectedFile);
      setShareLink('');
      setUploadStatus({ progress: 0, message: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus({ progress: 20, message: 'Starting upload...' });
    try {
      const url = await uploadFile(file);
      setShareLink(url);
      setUploadStatus({ progress: 100, message: 'Upload complete!' });
      toast.success('File uploaded successfully! Link expires in 1 hour.');
    } catch {
      console.error('Upload error');
      toast.error('Failed to upload file. Please try again.');
      setUploadStatus({ progress: 0, message: '' });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-8 h-8 text-bdazzled" />
        <h1 className="text-3xl font-bold text-charcoal">Cloud File Sharing</h1>
      </div>

      <CloudUploadSection
        file={file}
        shareLink={shareLink}
        uploadStatus={uploadStatus}
        copied={copied}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        onCopy={copyToClipboard}
      />
    </div>
  );
}
