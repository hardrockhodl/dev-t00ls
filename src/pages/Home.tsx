import { Link } from 'react-router-dom';
import { Terminal, Calculator, Network, Share2, Clipboard, GitGraph } from 'lucide-react';
import { DiCisco } from 'react-icons/di';

export function Home() {
  return (
    <div className="bg-hero-pattern bg-cover overflow-visible bg-center bg-repeat-y">
      <div className="max-w-4xl mx-auto py-10 ">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/memory-parser"
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-gray-800 hover:border-4 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight">
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
            to="/network-topology"
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight">
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
          <Link
            to="/subnet-calculator"
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
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
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
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
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
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
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
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
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-black border-2 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
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
            to="/text-diff"
            className="block p-6 bg-yankees rounded-lg shadow-md shadow-black hover:border-gray-800 hover:border-4 hover:shadow-inner active:bg-yankeesgray hover:bg-yankeeslight"
          >
            <div className="flex items-center justify-center mb-4">
              <Clipboard className="w-12 h-12 text-skyblue" /> {/* Choose any appropriate icon */}
            </div>
            <h2 className="text-2xl font-semibold text-platinum mb-2">
              Text Diff
            </h2>
            <p className="text-skyblue">
              Compare and highlight text differences quickly
            </p>
          </Link>
          <Link
            to="/terminal"
            className="mockup-code bg-WarmGray-800  shadow-md shadow-black border-2 border-gray-400 rounded-lg hover: hover:drop-shadow-md active:bg-WarmGray-900 hover:bg-gray-500  hover:border-gray-700 hover:shadow-inner hover:shadow-gray-900"
          >
            <div>
              <pre data-prefix="$"><code>open a local terminal</code></pre>
              <pre data-prefix="!" className="text-warning"><code>run scripts...</code></pre>
              <pre data-prefix="#" className="text-success"><code>remote to devices</code></pre>
              <pre data-prefix=">"><code>_</code></pre>
            </div>
          </Link>
          <Link
            to="/cli-explorer"
            className="block bg-yankees rounded-2xl shadow-md border-2 border-gray-400 shadow-black hover:border-gray-900 hover:shadow-inner drop-shadow-md active:bg-yankeesgray hover:bg-yankeeslight transition translate-x-2"
          >

            <div className="p-0 relative bg-gray-950 rounded-lg shadow-lg">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-start space-x-2 pl-3 bg-yankees rounded-t-lg h-11">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-mono text-gray-300 ml-auto pl-3">Cisco CLI Explorer</span>
                </div>
                {/* CLI Text Background */}
                <div className="text-md font-mono text-gray-500 opacity-60 bg-clip-text ml-3 mt-2 text-nowrap rounded-lg overflow-hidden relative after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-b after:from-transparent after:to-yankees">
                  <p>cisco-cli# conf t</p>
                  <p>cisco-cli# hostname Router</p>
                  <p>Router# show interfaces | incl </p>
                  <style>{`
                    .highlight {
                    color: green;
                  }
                  `}</style>
                  <p>  n rate <span className="text-rose-400"> 831 Mbits/sec</span>, 0 packets/sec</p>
                  <p>  n rate <span className="text-teal-300 opacity-100">142 Mbits/sec</span>, 4 packets/sec</p>
                  <p>  MTU 1500 bytes, BW 10000 Kbit, DLY 100000 usec, rely 255/255, load 1/255</p>
                  <p>  Encapsulation ARPA, loopback not set, keepalive set (10 sec)</p>
                </div>

                {/* Cisco Logo */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  <DiCisco className="w-40 h-40 text-skyblue opacity-100" />
                </div>

                {/* Description Text */}
                <p className="text-skyblue text-center absolute top-40 left-1/2 transform -translate-x-1/2 w-full px-4 mt-0">
                  Explore Cisco CLI commands and configurations in a mock terminal
                </p>
              </div>
          </Link>
        </div>
      </div>
    </div>
  );
}