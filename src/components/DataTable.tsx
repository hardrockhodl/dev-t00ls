import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc';

interface DataTableProps {
  data: Array<Record<string, string>>;
  columns: Record<string, string>;
  title?: string;
}

export function DataTable({ data, columns, title }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-xl">
      {title && (
        <div className="px-6 py-4 bg-bdazzled border-b border-bdazzled-light">
          <h3 className="text-lg font-semibold text-platinum">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yankees">
            <tr>
              {Object.values(columns).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider cursor-pointer hover:bg-yankees-light transition-colors"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                {Object.values(columns).map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}