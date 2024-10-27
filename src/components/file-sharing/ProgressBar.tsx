interface ProgressBarProps {
  progress: number;
  message?: string;
}

export function ProgressBar({ progress, message }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-bdazzled transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {message && (
        <p className="text-sm text-bdazzled text-center">{message}</p>
      )}
    </div>
  );
}