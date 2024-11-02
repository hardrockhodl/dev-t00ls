import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { saveFile, downloadFile, FileError } from '../lib/localFileStorage';
import { UploadSection } from '../components/file-sharing/UploadSection';
import { DownloadSection } from '../components/file-sharing/DownloadSection';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileSharing2() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadCode, setDownloadCode] = useState('');
  const [downloadInputCode, setDownloadInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ progress: 0, message: '' });
  const [downloadStatus, setDownloadStatus] = useState({ progress: 0, message: '' });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 50MB limit');
        return;
      }
      setFile(selectedFile);
      setDownloadCode('');
      setUploadStatus({ progress: 0, message: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus({ progress: 20, message: 'Starting upload...' });
    try {
      const id = await saveFile(file);
      setDownloadCode(id);
      setUploadStatus({ progress: 100, message: 'Upload complete!' });
      toast.success('File uploaded successfully! Share the 6-character code to download.');
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof FileError 
        ? error.message 
        : 'Failed to upload file. Please try again.';
      toast.error(message);
      setUploadStatus({ progress: 0, message: '' });
    }
  };

  const handleDownload = async () => {
    if (!downloadInputCode) {
      toast.error('Please enter a download code');
      return;
    }

    if (!/^[0-9a-z]{6}$/.test(downloadInputCode)) {
      toast.error('Invalid code format. Code should be 6 characters long and contain only numbers and lowercase letters.');
      return;
    }

    setDownloadStatus({ progress: 20, message: 'Starting download...' });
    try {
      setDownloadStatus({ progress: 50, message: 'Downloading file...' });
      const { blob, filename } = await downloadFile(downloadInputCode);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadStatus({ progress: 100, message: 'Download complete!' });
      toast.success('File downloaded successfully!');
      setTimeout(() => {
        setDownloadStatus({ progress: 0, message: '' });
        setDownloadInputCode('');
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      const message = error instanceof FileError
        ? error.message
        : 'Failed to download file. Please check the code and try again.';
      toast.error(message);
      setDownloadStatus({ progress: 0, message: '' });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-8 h-8 text-bdazzled" />
        <h1 className="text-3xl font-bold text-charcoal">Local File Sharing</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <UploadSection
          file={file}
          downloadCode={downloadCode}
          uploadStatus={uploadStatus}
          copied={copied}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          onCopy={copyToClipboard}
        />

        <DownloadSection
          downloadCode={downloadInputCode}
          downloadStatus={downloadStatus}
          onDownloadCodeChange={(e) => setDownloadInputCode(e.target.value.toLowerCase())}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}