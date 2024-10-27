import { Link } from 'react-router-dom';
import { Terminal, Calculator, Network, Share2, Clipboard, GitGraph } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/memory-parser"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Terminal className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Memory Parser
          </h2>
          <p className="text-skyblue">
            Parse and analyze Cisco device memory information
          </p>
        </Link>

        <Link
          to="/subnet-calculator"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Subnet Calculator
          </h2>
          <p className="text-skyblue">
            Calculate network ranges and divide subnets
          </p>
        </Link>

        <Link
          to="/port-lookup"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Network className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Port Lookup
          </h2>
          <p className="text-skyblue">Search well-known ports and services</p>
        </Link>

        <Link
          to="/file-sharing"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Share2 className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Cloud Share
          </h2>
          <p className="text-skyblue">
            Share files securely through cloud storage with expiring links
          </p>
        </Link>

        <Link
          to="/file-sharing-2"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Share2 className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Local Share
          </h2>
          <p className="text-skyblue">
            Quick file sharing with secure local storage and download codes
          </p>
        </Link>

        <Link
          to="/cisco-cli-parser"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <Clipboard className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Cisco CLI Parser
          </h2>
          <p className="text-skyblue">
            Parse and visualize Cisco CLI output easily
          </p>
        </Link>

        <Link
          to="/network-topology"
          className="block p-6 bg-yankees rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-charcoal-light"
        >
          <div className="flex items-center justify-center mb-4">
            <GitGraph className="w-12 h-12 text-skyblue" />
          </div>
          <h2 className="text-2xl font-semibold text-platinum mb-2">
            Network Topology
          </h2>
          <p className="text-skyblue">
            Visualize network diagrams from CSV data with interactive nodes
          </p>
        </Link>
      </div>
    </div>
  );
}