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

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-200">
        <Navigation />
        <main className="w-full h-screen px-4 py-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/network-topology" element={<NetworkTopology />} />
            <Route path="/memory-parser" element={<MemoryParser />} />
            <Route path="/subnet-calculator" element={<SubnetCalculator />} />
            <Route path="/port-lookup" element={<PortLookup />} />
            <Route path="/file-sharing" element={<FileSharing />} />
            <Route path="/file-sharing-2" element={<FileSharing2 />} />
            <Route path="/cisco-cli-parser" element={<CiscoCLIParser />} />          
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
