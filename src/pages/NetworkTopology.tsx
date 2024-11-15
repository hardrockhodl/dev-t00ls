import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  Node,
  Edge,
  XYPosition,
  NodeChange,
} from 'reactflow';
import { GitGraph, Upload, Eye, EyeOff, Maximize, Minimize, Menu } from 'lucide-react';
import { parseTopologyCSV } from '../utils/topologyParser';
import ELK from 'elkjs/lib/elk.bundled';
import 'reactflow/dist/style.css';
import { toast } from 'react-hot-toast';
import FloatingConnectionLine from '../components/topology/FloatingConnectionLine';
import { NetworkNode } from '../components/topology/NetworkNode';
import NodeInfoModal from '../components/topology/NodeInfoModal';

const nodeTypes = { networkNode: NetworkNode };

async function layoutNodesAndEdges(nodes: Node[], edges: Edge[], layoutOption: string) {
  const elk = new ELK();
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: 50,
    height: 25,
  }));
  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const elkGraph = {
    id: 'root',
    children: elkNodes,
    edges: elkEdges,
    layoutOptions: {
      'elk.algorithm': layoutOption,
    },
  };

  const layout = await elk.layout(elkGraph);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      position: {
        x: layout.children?.find((n) => n.id === node.id)?.x ?? 0,
        y: layout.children?.find((n) => n.id === node.id)?.y ?? 0,
      },
    })),
    edges,
  };
}
interface NodePositions {
  [nodeId: string]: XYPosition;
}

export default function NetworkTopology() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [showPorts, setShowPorts] = useState(true);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [layoutOption, setLayoutOption] = useState<string>('mrtree');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [variant, setVariant] = useState('lines');
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodePositions, setNodePositions] = useState<NodePositions>({});

  const handleNodeClick = (node: React.SetStateAction<Node | null>) => {
    setSelectedNode(node); // Sätter vald nod vid klick
  };

  const closeModal = () => {
    setSelectedNode(null); // Stänger modalen genom att återställa `selectedNode`
  };

  const handleLayoutChange = useCallback((newLayout: string) => {
    setLayoutOption(newLayout);
    if (nodes.length > 0 && edges.length > 0) {
      layoutNodesAndEdges(nodes, edges, newLayout).then(({ nodes: layoutedNodes, edges }) => {
        // Store new positions after layout
        const newPositions: NodePositions = {};
        layoutedNodes.forEach((node) => {
          newPositions[node.id] = node.position;
        });
        setNodePositions(newPositions);
        setNodes(layoutedNodes);
        setEdges(edges);
      });
    }
  }, [nodes, edges, setNodes, setEdges]);

  const updateTopology = useCallback(
    async (content: string, showPortInfo: boolean, useExistingPositions = false) => {
      try {
        const { nodes: parsedNodes, edges: parsedEdges } = await parseTopologyCSV(content, showPortInfo);
        // If we have existing positions and want to use them, apply them to the parsed nodes		
        //const { nodes: newNodes, edges: newEdges } = await layoutNodesAndEdges(parsedNodes, parsedEdges, layoutOption);
        let nodesWithPositions = parsedNodes;
        if (useExistingPositions && Object.keys(nodePositions).length > 0) {
          //setEdges(newEdges);
          nodesWithPositions = parsedNodes.map((node) => ({
            ...node,
            position: nodePositions[node.id] || node.position,
          }));
          setNodes(nodesWithPositions);
          setEdges(parsedEdges);
        } else {
          // Otherwise, perform layout		
          const { nodes: layoutedNodes, edges: layoutedEdges } = await layoutNodesAndEdges(
            parsedNodes,
            parsedEdges,
            layoutOption
          );
          // Store new positions		
          const newPositions: NodePositions = {};
          layoutedNodes.forEach((node) => {
            newPositions[node.id] = node.position;
          });
          setNodePositions(newPositions);
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        }
        toast.success('Network topology updated successfully');
      } catch {
        toast.error('Failed to update topology. Please check your CSV file.');
      }
    },
    [layoutOption, setNodes, setEdges, nodePositions]
  );

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setCsvContent(text);
          // When uploading a new file, don't use existing positions
          await updateTopology(text, showPorts, false);
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, [showPorts, updateTopology]);

  const togglePortVisibility = async () => {
    const newShowPorts = !showPorts;
    setShowPorts(newShowPorts);
    if (csvContent) {		
      // When toggling ports, use existing positions		    
      // Uppdatera showPorts för varje nod utan att beräkna om positionerna
      await updateTopology(csvContent, newShowPorts, true);
    }
  };

  // const togglePortVisibility = async () => {
  //   const newShowPorts = !showPorts;
  //   setShowPorts(newShowPorts);
  //   if (csvContent) {
  //     await updateTopology(csvContent, newShowPorts);
  //   }
  // };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  // Update node positions when nodes are dragged		
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    // Update stored positions for moved nodes
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        setNodePositions((prev) => {
          const newPositions = { ...prev };
          if (change.position) {
            newPositions[change.id] = change.position;
          }
          return newPositions;
        });
      }
    });
  }, [onNodesChange]);

  return (
    <div className="relative h-screen w-full bg-gray-100">
      <button
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-graymas text-white rounded-md hover:bg-asfalt active:bg-graymas transition-colors"
      >
        <Menu className="w-6 h-6" />
        {/* <span>{isMenuVisible ? '' : ''}</span>   */}
      </button>

      {isMenuVisible && (
        <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <GitGraph className="w-5 h-5 text-bdazzled" />
              <h2 className="text-lg font-semibold text-charcoal">Network Topology</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Upload Topology CSV
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="layoutSelect" className="block text-sm font-medium text-charcoal mb-2">
                  Layout Algorithm
                </label>
                <select
                  id="layoutSelect"
                  value={layoutOption}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-bdazzled focus:border-transparent"
                >
                  <option value="mrtree">Tree Layout</option>
                  <option value="layered">Layered Layout</option>
                  <option value="radial">Radial Layout</option>
                </select>
              </div>

              <div>
                <label htmlFor="backgroundSelect" className="block text-sm font-medium text-charcoal mb-2">
                  Background Style
                </label>
                <select
                  id="backgroundSelect"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-bdazzled focus:border-transparent"
                >
                  <option value="dots">Dots</option>
                  <option value="lines">Lines</option>
                  <option value="cross">Cross</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={togglePortVisibility}
                  className="flex items-center gap-2 px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors"
                >
                  {showPorts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPorts ? 'Hide Ports' : 'Show Ports'}</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2 px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        onNodeClick={(_, node) => handleNodeClick(node)} // Lägg till onClick-händelse för nod
        fitViewOptions={{ padding: 2.5 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
        }}
        connectionLineComponent={FloatingConnectionLine}
        className="bg-gray-50"
      >
        <Background color="#94a3b8" variant={variant} />
        <Controls className="bg-lava rounded-lg shadow-lg border border-gray-200"/>
        <Panel position="top-center" className="bg-white p-2 rounded-t-lg shadow-lg">
          <div className="text-sm text-gray-600">
            {nodes.length} nodes • {edges.length} connections
          </div>
        </Panel>
      </ReactFlow>
      {/* Visa NodeInfoModal när en nod är vald */}
      {selectedNode && (
        <NodeInfoModal
          node={selectedNode}
          showPorts={showPorts}
          onClose={closeModal}
        />
      )}
    </div>
  );
}