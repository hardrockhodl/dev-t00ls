// components/topology/NodeInfoModal.tsx

import React from 'react';

interface NodeInfoModalProps {
  node: { id: string; data: { label: string; localPort: string } }; // Justera typen om du har en definierad typ för noden
  showPorts: boolean;
  onClose: () => void;
}

const NodeInfoModal: React.FC<NodeInfoModalProps> = ({ node, showPorts, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-bold text-charcoal">Node Information</h3>
        <p className="text-sm mt-2">
          <strong>ID:</strong> {node.id}
        </p>
        <p className="text-sm">
          <strong>Label:</strong> {node.data.label}
        </p>
        <p className="text-sm">
          <strong>Port Info:</strong> {showPorts && node.data.localPort}
        </p>
        {/* Lägg till mer nodinformation här om det behövs */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-bdazzled text-white rounded-md hover:bg-bdazzled-light transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NodeInfoModal;