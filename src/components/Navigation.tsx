import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Calculator,
  Network,
  Share2,
  Clipboard,
  GitGraph,
  ChevronDown,
  Wrench
} from 'lucide-react';

export function Navigation() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const tools = [
    { path: '/memory-parser', icon: Terminal, label: 'Memory Parser' },
    { path: '/subnet-calculator', icon: Calculator, label: 'Subnet Calculator' },
    { path: '/port-lookup', icon: Network, label: 'Port Lookup' },
    { path: '/cisco-cli-parser', icon: Clipboard, label: 'CLI Parser' },
    { path: '/network-topology', icon: GitGraph, label: 'Network Topology' }
  ];

  const sharing = [
    { path: '/file-sharing', icon: Share2, label: 'Cloud Share' },
    { path: '/file-sharing-2', icon: Share2, label: 'Local Share' }
  ];

  return (
    <nav className="bg-yankees shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white hover:text-gray-300"
            >
              <Network className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg leading-tight">Network Tools</div>
                <div className="text-xs text-gray-300">A collection of nifty things</div>
              </div>
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <Wrench className="w-6 h-6" />
                <span className="font-semibold">Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {tools.map(({ path, icon: Icon, label }) => (
                      <Link
                        key={path}
                        to={path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <Icon className="w-5 h-5 mr-3 text-gray-500" />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    {sharing.map(({ path, icon: Icon, label }) => (
                      <Link
                        key={path}
                        to={path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsToolsOpen(false)}
                      >
                        <Icon className="w-5 h-5 mr-3 text-gray-500" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}