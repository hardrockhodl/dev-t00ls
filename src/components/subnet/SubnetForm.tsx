interface SubnetFormProps {
  network: string;
  netBits: number;
  visibleColumns: Record<string, boolean>;
  onUpdateNetwork: (network: string, netBits: number) => void;
  onToggleColumn: (columnName: string) => void;
}

export function SubnetForm({ 
  network, 
  netBits, 
  visibleColumns, 
  onUpdateNetwork, 
  onToggleColumn 
}: SubnetFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newNetwork = formData.get('network') as string;
    const newNetBits = parseInt(formData.get('netbits') as string, 10);
    onUpdateNetwork(newNetwork, newNetBits);
  };

  return (
    <div>
      <p className="text-bdazzled mb-4">Enter the network you wish to subnet:</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 items-end">
          <div>
            <label htmlFor="network" className="block text-sm font-medium text-charcoal mb-1">
              Network Address
            </label>
            <input
              type="text"
              id="network"
              name="network"
              defaultValue={network}
              className="mt-1 block w-40 rounded-md border-bdazzled shadow-sm focus:border-skyblue focus:ring focus:ring-skyblue focus:ring-opacity-50"
              maxLength={15}
            />
          </div>
          <div>
            <label htmlFor="netbits" className="block text-sm font-medium text-charcoal mb-1">
              Mask bits
            </label>
            <div className="flex items-center">
              <span className="text-charcoal mr-1">/</span>
              <input
                type="text"
                id="netbits"
                name="netbits"
                defaultValue={netBits}
                className="mt-1 block w-16 rounded-md border-bdazzled shadow-sm focus:border-skyblue focus:ring focus:ring-skyblue focus:ring-opacity-50"
                maxLength={2}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors"
            >
              Update
            </button>
            <button
              type="reset"
              className="px-4 py-2 bg-charcoal text-white rounded-md hover:bg-charcoal-light transition-colors"
              onClick={() => onUpdateNetwork('192.168.0.0', 24)}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <p className="w-full text-charcoal font-medium">Show columns:</p>
          {Object.entries(visibleColumns).map(([name, checked]) => (
            <label key={name} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleColumn(name)}
                className="rounded border-bdazzled text-skyblue focus:ring-skyblue"
              />
              <span className="text-charcoal capitalize">
                {name === 'useable' ? 'Useable IPs' : name}
              </span>
            </label>
          ))}
        </div>
      </form>
    </div>
  );
}