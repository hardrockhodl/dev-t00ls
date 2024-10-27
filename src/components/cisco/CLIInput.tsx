import { Clipboard, Terminal, Loader2 } from 'lucide-react';

interface CLIInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onParse: () => void;
  onClear: () => void;
}

export function CLIInput({ value, loading, onChange, onParse, onClear }: CLIInputProps) {
  const exampleOutput = `Interface                      Status         Protocol  Description
GigabitEthernet0/0           up             up        WAN Interface
GigabitEthernet0/1           up             up        LAN Interface
FastEthernet1/0              down           down      Backup Link
Vlan1                        up             up        Management`;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clipboard className="w-5 h-5 text-bdazzled" />
        <h2 className="text-xl font-semibold text-charcoal">Input</h2>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[400px] p-4 font-mono text-sm border border-bdazzled rounded-md focus:ring-2 focus:ring-skyblue focus:border-transparent"
            placeholder={`Paste Cisco CLI output here (e.g., "show interfaces" or "show ip interface brief")\n\nExample:\n${exampleOutput}`}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onParse}
            disabled={loading || !value.trim()}
            className="px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5" />
                <span>Parse Output</span>
              </>
            )}
          </button>

          <button
            onClick={onClear}
            disabled={loading}
            className="px-4 py-2 bg-charcoal text-white rounded-md hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}