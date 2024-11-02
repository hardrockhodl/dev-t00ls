import React from 'react';

interface TopologyToolsMenuProps {
  onUploadCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLayoutChange: (layout: string) => void;
  togglePortVisibility: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  showPorts: boolean;
}

export function TopologyToolsMenu({
  onUploadCSV,
  onLayoutChange,
  togglePortVisibility,
  toggleFullscreen,
  isFullscreen,
  showPorts,
}: TopologyToolsMenuProps) {
  return (
    <div className="fixed top-0 right-0 bg-gray-700 text-white p-4 w-80 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Topology Tools</h2>
      <div className="mb-4">
        <label className="block mb-1">Upload CSV:</label>
        <input type="file" accept=".csv" onChange={onUploadCSV} />
      </div>
      <div className="mb-4">
        <label htmlFor="layoutSelect" className="block mb-1">Layout Algorithm:</label>
        <select 
          id="layoutSelect" 
          onChange={(e) => onLayoutChange(e.target.value)} 
          className="bg-gray-200 text-black p-1 rounded w-full"
        >
          <option value="mrtree">Mr. Tree</option>
          <option value="layered">Layered</option>
          <option value="radial">Radial</option>
        </select>
      </div>
      <div className="mb-4">
        <button 
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition w-full"
          onClick={togglePortVisibility}
        >
          {showPorts ? "Hide Ports" : "Show Ports"}
        </button>
      </div>
      <div>
        <button 
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition w-full"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>
      </div>
    </div>
  );
}
