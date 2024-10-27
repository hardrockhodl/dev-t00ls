import { Terminal, AlertCircle } from 'lucide-react';
import { ParsedInterface } from '../../types/cisco';

interface CLIOutputProps {
  output: {
    interfaces: ParsedInterface[];
    timestamp: string;
    deviceType?: string;
  } | null;
}

export function CLIOutput({ output }: CLIOutputProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-5 h-5 text-bdazzled" />
        <h2 className="text-xl font-semibold text-charcoal">Parsed Output</h2>
      </div>

      {output ? (
        <div className="space-y-6">
          {output.deviceType && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-charcoal">
                <span className="font-semibold">Device Type:</span> {output.deviceType}
              </p>
              <p className="text-sm text-charcoal">
                <span className="font-semibold">Timestamp:</span> {output.timestamp}
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yankees">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Interface</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Protocol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {output.interfaces.map((intf, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap">{intf.name}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        intf.status.toLowerCase().includes('up') 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {intf.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap">{intf.protocol}</td>
                    <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap">{intf.ipAddress || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-500 space-y-2">
          <AlertCircle className="w-8 h-8" />
          <p>No output to display. Paste some CLI output and click "Parse Output" to begin.</p>
        </div>
      )}
    </div>
  );
}