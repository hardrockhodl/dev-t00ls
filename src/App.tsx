import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { MemoryParser } from './pages/MemoryParser';
import { SubnetCalculator } from './pages/SubnetCalculator';
import { PortLookup } from './pages/PortLookup';
import { FileSharing } from './pages/FileSharing';
import { FileSharing2 } from './pages/FileSharing2';
import { CiscoCLIParser } from './pages/CiscoCLIParser';
import NetworkTopology from './pages/NetworkTopology';
// import Terminal from './pages/Terminal';
import CiscoCLIExplorer from './pages/CiscoCLIExplorer';
import TextDiffTool from './pages/TextDiffTool';


export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-300">
        <Navigation />
        <main className="w-full h-fit px-4 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/network-topology" element={<NetworkTopology />} />
            <Route path="/memory-parser" element={<MemoryParser />} />
            <Route path="/subnet-calculator" element={<SubnetCalculator />} />
            <Route path="/port-lookup" element={<PortLookup />} />
            <Route path="/file-sharing" element={<FileSharing />} />
            <Route path="/file-sharing-2" element={<FileSharing2 />} />
            <Route path="/cisco-cli-parser" element={<CiscoCLIParser />} />
            {/* <Route path="/terminal" element={<Terminal />} /> */}
            <Route path="/cli-explorer" element={<CiscoCLIExplorer />} />
            <Route path="/text-diff" element={<TextDiffTool />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
