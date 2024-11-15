import React from 'react';
import TerminalComponent from '../components/cisco/CLIExplorer';

const TerminalPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cisco CLI explorer</h1>
      <TerminalComponent />
    </div>
  );
};

export default TerminalPage;