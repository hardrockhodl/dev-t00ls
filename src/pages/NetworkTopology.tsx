import { useState, useCallback } from 'react';
import {
  Network,
  Upload,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'react-hot-toast';
import { parseTopologyCSV } from '../utils/topologyParser.ts';
import { NetworkNode } from '../components/topology/NetworkNode';

const nodeTypes = {
  networkNode: NetworkNode,
};

const exampleCsv = `source,target,type,localPort,remotePort,localPortName,remotePortName,bandwidth,label
Router1,Switch1,router,1,1,GigabitEthernet0/1,Ethernet1/1,1Gbps,Core Link
Router1,Firewall1,router,2,1,GigabitEthernet0/2,WAN1,1Gbps,WAN Link
Switch1,Server1,switch,10,1,Ethernet1/10,eth0,10Gbps,Server Connection`;

export function NetworkTopology() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);
  const [showPorts, setShowPorts] = useState(true);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const downloadExample = () => {
    const blob = new Blob([exampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network-topology-example.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const updateTopology = useCallback(
    async (content: string, showPortInfo: boolean) => {
      try {
        const { nodes: parsedNodes, edges: parsedEdges } =
          await parseTopologyCSV(content, showPortInfo);
        setNodes(parsedNodes);
        setEdges(parsedEdges);
        setError(null);
        toast.success('Network topology updated');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to parse CSV file';
        setError(message);
        toast.error(message);
      }
    },
    [setNodes, setEdges]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          setError('Invalid file content');
          toast.error('Invalid file content');
          return;
        }

        setCsvContent(text);
        await updateTopology(text, showPorts);
      };

      reader.onerror = () => {
        setError('Failed to read file');
        toast.error('Failed to read file');
      };

      reader.readAsText(file);
    },
    [showPorts, updateTopology]
  );

  const togglePortVisibility = async () => {
    setShowPorts(!showPorts);
    if (csvContent) {
      await updateTopology(csvContent, !showPorts);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'max-w-6xl mx-auto'
      }`}
    >
      {!isFullscreen && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <Network className="w-8 h-8 text-bdazzled" />
            <h1 className="text-3xl font-bold text-charcoal">
              Network Topology Visualizer
            </h1>
          </div>
          {/* 6666 */}
          <div className="bg-white rounded-lg drop-shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-charcoal mb-2">
                  Upload Network Topology
                </h2>
                <p className="text-bdazzled mb-2">
                  Upload a CSV file containing your network topology
                  information.
                </p>
                <p className="text-sm text-gray-600">
                  Required columns: source, target, type
                  <br />
                  Optional columns: localPort, remotePort, localPortName,
                  remotePortName, bandwidth, label
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadExample}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Download Example</span>
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Upload CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-700">
                    Error parsing CSV
                  </h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {/* 666 */}

      <div
        className={`bg-white drop-shadow-md border-dotted border-2 border-gray-200 rounded-lg ${
          isFullscreen ? 'h-screen' : 'h-[600px]'
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2 },
          }}
        >
          <Background />
          <Controls position="top-left" />{' '}
          {/* Flyttar kontrollpanelen till top-left */}
          <Panel
            position="top-right"
            className="bg-white p-2 rounded shadow-lg space-y-2"
          >
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-bdazzled text-white rounded hover:bg-bdazzled-light transition-colors"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
            <button
              onClick={togglePortVisibility}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-bdazzled text-white rounded hover:bg-bdazzled-light transition-colors"
            >
              {showPorts ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Port Info</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show Port Info</span>
                </>
              )}
            </button>
            {!isFullscreen && (
              <div className="text-sm text-gray-600">
                <p>Drag to move nodes</p>
                <p>Scroll to zoom</p>
                <p>Hover over connections to see details</p>
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
