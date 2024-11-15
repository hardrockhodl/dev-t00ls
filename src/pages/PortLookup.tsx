import { useState, useEffect, useCallback, useRef } from 'react';
import { Network, Search, Loader2 } from 'lucide-react';
import { getAllPorts, searchPorts, initializeDatabase, type Port } from '../lib/db';

export const PortLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
      } catch (err) {
        console.error('Error initializing database:', err);
      }
    };
    setupDatabase();
  }, []);

  const loadPorts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPorts();
      setPorts(data);
    } catch (err) {
      setError('Failed to load ports. Please try again later.');
      console.error('Error loading ports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPorts();
  }, [loadPorts]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(async () => {
      if (searchTerm) {
        try {
          setLoading(true);
          const results = await searchPorts(searchTerm);
          setPorts(results);
        } catch (err) {
          setError('Failed to search ports. Please try again later.');
          console.error('Error searching ports:', err);
        } finally {
          setLoading(false);
        }
      } else {
        loadPorts();
      }
    }, 300);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchTerm, loadPorts]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-8 h-8 text-bdazzled" />
        <h1 className="text-3xl font-bold text-charcoal">Port Lookup</h1>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by port number, service name, or protocol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-bdazzled focus:ring-2 focus:ring-skyblue focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-bdazzled" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yankees">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Port</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Protocol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-thundra divide-y divide-gray-400">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-bdazzled" />
                      <span className="ml-2">Loading ports...</span>
                    </div>
                  </td>
                </tr>
              ) : ports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No ports found matching your search.
                  </td>
                </tr>
              ) : (
                ports.map((port) => (
                  <tr key={port.unik_key} className="hover:bg-thundra even:bg-gray-100 ">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">
                      {port.port_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {port.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {port.service_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal">
                      {port.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> 
    </div>
  );
}
