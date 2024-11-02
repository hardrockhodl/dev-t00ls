import React from 'react';
import ReactFlow, { ReactFlowProps, Node, Edge, OnNodesChange, OnEdgesChange } from 'reactflow';
import { FloatingConnectionLineProps } from '../../types/FloatingConnectionLineProps';
import { NetworkNode } from './NetworkNode';
import FloatingEdge from './FloatingEdge';

type ExtendedReactFlowProps = ReactFlowProps & {
  floatingconnectionLine: ({ toX, toY, fromPosition, toPosition, fromNode }: FloatingConnectionLineProps) => JSX.Element | null;
};

const ExtendedReactFlow: React.FC<ExtendedReactFlowProps> = (props) => {
  return <ReactFlow {...props} />;
};

const nodeTypes = {
  networkNode: NetworkNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const floatingconnectionLine = ({  }: FloatingConnectionLineProps) => {
  // Your implementation here
  return <div>Custom Connection Line</div>;
};

export function NetworkTopology() {
  const nodes: Node[] = []; // Your nodes here
  const edges: Edge[] = []; // Your edges here

  const onNodesChange: OnNodesChange = () => {
    // Handle node changes
  };

  const onEdgesChange: OnEdgesChange = () => {
    // Handle edge changes
  };

  return (
    <ExtendedReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      floatingconnectionLine={floatingconnectionLine}
    />
  );
}

export { ExtendedReactFlow };
    export type { FloatingConnectionLineProps };

