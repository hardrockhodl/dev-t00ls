import React, { useCallback, useState } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, ConnectionMode, Panel, Node, Edge } from 'reactflow';
import { TopologyToolsMenu } from '../components/topology/TopologyToolsMenu';
import { parseTopologyCSV } from '../utils/topologyParser';
import ELK from 'elkjs/lib/elk.bundled';
import 'reactflow/dist/style.css';
import { toast } from 'react-hot-toast';
import FloatingConnectionLine from '../components/topology/FloatingConnectionLine';
import { NetworkNode } from '../components/topology/NetworkNode';

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

export default function NetworkTopology() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [showPorts, setShowPorts] = useState(true);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [layoutOption, setLayoutOption] = useState<string>('mrtree');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [variant, setVariant] = useState('lines');

  const handleLayoutChange = useCallback((newLayout: string) => {
    setLayoutOption(newLayout);
    if (nodes.length > 0 && edges.length > 0) {
      layoutNodesAndEdges(nodes, edges, newLayout).then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      });
    }
  }, [nodes, edges, setNodes, setEdges]);

  const updateTopology = useCallback(
    async (content: string, showPortInfo: boolean) => {
      const { nodes: parsedNodes, edges: parsedEdges } = await parseTopologyCSV(content, showPortInfo);
      const { nodes: newNodes, edges: newEdges } = await layoutNodesAndEdges(parsedNodes, parsedEdges, layoutOption);
      setNodes(newNodes);
      setEdges(newEdges);
      toast.success('Network topology updated');
    },
    [layoutOption, setNodes, setEdges]
  );

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setCsvContent(text);
          await updateTopology(text, showPorts);
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, [showPorts, updateTopology]);

  const togglePortVisibility = async () => {
    setShowPorts(!showPorts);
    if (csvContent) {
      await updateTopology(csvContent, !showPorts);
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className="relative h-full w-full">
      <TopologyToolsMenu
        onUploadCSV={handleFileUpload}
        onLayoutChange={handleLayoutChange}
        togglePortVisibility={togglePortVisibility}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        showPorts={showPorts}
      />
      <div className="absolute inset-0 flex">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0 }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2 },
          }}
          connectionLineComponent={FloatingConnectionLine} // Only use here
        >
          <Controls position="top-left" />
          <Background color="#c3c3c3" variant={variant} />
          <Panel position="top-center">
            <div className="absolute top-4 right-4 flex gap-2 bg-white p-2 rounded shadow">
              <label htmlFor="layoutSelect" className="mr-2">Layout Algorithm:</label>
              <select
                id="layoutSelect"
                value={layoutOption}
                onChange={(e) => handleLayoutChange(e.target.value)}
                className="bg-gray-200 p-1 rounded"
              >
                <option value="mrtree">Mr. Tree</option>
                <option value="layered">Layered</option>
                <option value="radial">Radial</option>
              </select>
              <label htmlFor="backgroundSelect" className="ml-4 mr-2">Background:</label>
              <select
                id="backgroundSelect"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="bg-gray-200 p-1 rounded"
              >
                <option value="dots">Dots</option>
                <option value="lines">Lines</option>
                <option value="cross">Cross</option>
              </select>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
