import { useRef } from 'react';
import { Upload, Copy, Check } from 'lucide-react';
import type { UploadProgress } from '../../lib/supabase';

interface CloudUploadSectionProps {
  file: File | null;
  shareLink: string;
  uploadStatus: UploadProgress;
  copied: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
  onCopy: () => Promise<void>;
}

export function CloudUploadSection({
  file,
  shareLink,
  uploadStatus,
  copied,
  onFileSelect,
  onUpload,
  onCopy
}: CloudUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-charcoal mb-4">Upload to Cloud</h2>
      
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-bdazzled rounded-lg p-8 text-center cursor-pointer hover:border-skyblue transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
              const event = { target: { files: [droppedFile] } } as React.ChangeEvent<HTMLInputElement>;
              onFileSelect(event);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 mx-auto text-bdazzled mb-2" />
          <p className="text-bdazzled">
            {file ? file.name : 'Click or drag file here to upload'}
          </p>
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileSelect}
            className="hidden"
          />
        </div>

        {uploadStatus.progress > 0 && (
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-bdazzled transition-all duration-300 ease-out"
                style={{ width: `${uploadStatus.progress}%` }}
              />
            </div>
            {uploadStatus.message && (
              <p className="text-sm text-bdazzled text-center">{uploadStatus.message}</p>
            )}
          </div>
        )}

        <button
          onClick={onUpload}
          disabled={!file || uploadStatus.progress > 0}
          className="w-full px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload to Cloud</span>
        </button>

        {shareLink && (
          <div className="mt-4">
            <p className="text-charcoal mb-2">Share this link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-bdazzled rounded-md bg-gray-50"
              />
              <button
                onClick={onCopy}
                className="px-3 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Link expires in 1 hour
            </p>
          </div>
        )}
      </div>
    </div>
  );
}