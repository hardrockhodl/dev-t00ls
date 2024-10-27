import { Download } from 'lucide-react';

interface DownloadSectionProps {
  downloadCode: string;
  downloadStatus: { progress: number; message: string };
  onDownloadCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => Promise<void>;
}

export function DownloadSection({
  downloadCode,
  downloadStatus,
  onDownloadCodeChange,
  onDownload
}: DownloadSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-charcoal mb-4">Download File</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="download-code" className="block text-sm font-medium text-charcoal mb-1">
            Enter Download Code
          </label>
          <input
            type="text"
            id="download-code"
            value={downloadCode}
            onChange={onDownloadCodeChange}
            className="w-full px-3 py-2 border border-bdazzled rounded-md focus:ring-2 focus:ring-skyblue focus:border-transparent font-mono text-lg text-center"
            placeholder="Enter the 6-digit code"
            maxLength={6}
            pattern="[a-z0-9]{6}"
          />
        </div>

        {downloadStatus.progress > 0 && (
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-bdazzled transition-all duration-300 ease-out"
                style={{ width: `${downloadStatus.progress}%` }}
              />
            </div>
            {downloadStatus.message && (
              <p className="text-sm text-bdazzled text-center">{downloadStatus.message}</p>
            )}
          </div>
        )}

        <button
          onClick={onDownload}
          disabled={!downloadCode || downloadStatus.progress > 0}
          className="w-full px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Download File</span>
        </button>
      </div>
    </div>
  );
}