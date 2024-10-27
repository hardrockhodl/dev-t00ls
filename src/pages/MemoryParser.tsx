import { useState } from 'react';
import { parseNetworkOutput, platformColumns, processColumns, processPoolColumns, nexusProcessColumns } from '../utils/dataConversion';
import { DataTable } from '../components/DataTable';

export function MemoryParser() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseNetworkOutput> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    if (newInput.trim()) {
      setParsedData(parseNetworkOutput(newInput));
    } else {
      setParsedData(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-charcoal mb-6">Cisco Memory Parser</h1>
      
      <div className="mb-8">
        <label htmlFor="input" className="block text-sm font-medium text-bdazzled mb-2">
          Paste Cisco device output here:
        </label>
        <textarea
          id="input"
          value={input}
          onChange={handleInputChange}
          className="w-full h-48 p-3 bg-white text-gray-900 border border-bdazzled rounded-md shadow-sm focus:ring-skyblue focus:border-skyblue transition-colors"
          placeholder="Paste your Cisco device output here (show memory platform, show process memory, or show processes memory for Nexus)..."
        />
      </div>

      {parsedData && (
        <div className="space-y-8">
          {parsedData.platformData && (
            <div>
              <DataTable 
                data={parsedData.platformData} 
                columns={platformColumns}
                title="Platform Memory Information" 
              />
            </div>
          )}
          
          {parsedData.poolData && (
            <div>
              <DataTable 
                data={parsedData.poolData} 
                columns={processPoolColumns}
                title="Memory Pools" 
              />
            </div>
          )}
          
          {parsedData.processData && (
            <div>
              <DataTable 
                data={parsedData.processData} 
                columns={parsedData.type === 'nexus' ? nexusProcessColumns : processColumns}
                title="Process Memory Usage" 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}