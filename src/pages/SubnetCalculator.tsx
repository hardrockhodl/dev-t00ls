import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SubnetForm } from '../components/subnet/SubnetForm';
import { SubnetTable } from '../components/subnet/SubnetTable';
import { SubnetNode, parseNetworkAddress, calculateSubnets } from '../utils/subnetCalculator';

export function SubnetCalculator() {
  const [network, setNetwork] = useState('192.168.0.0');
  const [netBits, setNetBits] = useState(24);
  const [visibleColumns, setVisibleColumns] = useState({
    subnet: true,
    netmask: false,
    range: true,
    useable: true,
    hosts: true,
    divide: true,
    join: true,
  });
  const [subnets, setSubnets] = useState<SubnetNode>({ depth: 0, children: 0, subnets: null });

  const handleNetworkUpdate = (newNetwork: string, newNetBits: number) => {
    const parsedNetwork = parseNetworkAddress(newNetwork, newNetBits);
    if (parsedNetwork) {
      setNetwork(parsedNetwork.address);
      setNetBits(newNetBits);
      setSubnets({ depth: 0, children: 0, subnets: null });
    }
  };

  const handleColumnToggle = (columnName: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const handleDivide = (node: SubnetNode) => {
    node.subnets = [
      { depth: 0, children: 0, subnets: null },
      { depth: 0, children: 0, subnets: null }
    ];
    setSubnets({ ...subnets });
  };

  const handleJoin = (node: SubnetNode) => {
    node.subnets = null;
    setSubnets({ ...subnets });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-bdazzled" />
        <h1 className="text-3xl font-bold text-charcoal">Visual Subnet Calculator</h1>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <SubnetForm
          network={network}
          netBits={netBits}
          visibleColumns={visibleColumns}
          onUpdateNetwork={handleNetworkUpdate}
          onToggleColumn={handleColumnToggle}
        />
        
        <p className="text-bdazzled mt-4">
          Click below to split and join subnets. The table will update automatically as you make changes.
        </p>
      </div>

      <SubnetTable
        network={network}
        netBits={netBits}
        visibleColumns={visibleColumns}
        subnets={subnets}
        onDivide={handleDivide}
        onJoin={handleJoin}
      />
    </div>
  );
}