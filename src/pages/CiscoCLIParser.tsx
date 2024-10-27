import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { CLIInput } from '../components/cisco/CLIInput';
import { CLIOutput } from '../components/cisco/CLIOutput';
import { parseCiscoCLI } from '../lib/cisco';
import type { ParseResponse } from '../types/cisco';
import { toast } from 'react-hot-toast';

export function CiscoCLIParser() {
  const [cliInput, setCliInput] = useState('');
  const [output, setOutput] = useState<ParseResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!cliInput.trim()) {
      toast.error('Please enter some CLI output to parse');
      return;
    }

    setLoading(true);
    try {
      const result = await parseCiscoCLI(cliInput);
      setOutput(result);
      toast.success('CLI output parsed successfully');
    } catch (error) {
      // Error is already handled by parseCiscoCLI
      setOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCliInput('');
    setOutput(null);
    toast.success('Input cleared');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-8 h-8 text-bdazzled" />
        <h1 className="text-3xl font-bold text-charcoal">Cisco CLI Parser</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CLIInput
          value={cliInput}
          loading={loading}
          onChange={setCliInput}
          onParse={handleParse}
          onClear={handleClear}
        />
        <CLIOutput output={output} />
      </div>
    </div>
  );
}