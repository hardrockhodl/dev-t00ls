import { SubnetNode } from '../../utils/subnetCalculator';
import { calculateSubnetInfo } from '../../utils/subnetCalculator';

interface SubnetTableProps {
  network: string;
  netBits: number;
  visibleColumns: Record<string, boolean>;
  subnets: SubnetNode;
  onDivide: (node: SubnetNode) => void;
  onJoin: (node: SubnetNode) => void;
}

interface SubnetInfo {
  address: string;
  netmask: string;
  range: string;
  useable: string;
  hosts: number;
}

function SubnetRow({ 
  info, 
  node, 
  visibleColumns, 
  onDivide, 
  onJoin,
  depth = 0 
}: { 
  info: SubnetInfo; 
  node: SubnetNode;
  visibleColumns: Record<string, boolean>;
  onDivide: (node: SubnetNode) => void;
  onJoin: (node: SubnetNode) => void;
  depth?: number;
}) {
  return (
    <>
      <tr className="hover:bg-gray-50">
        {visibleColumns.subnet && (
          <td className="px-6 py-4 text-sm text-charcoal">{info.address}</td>
        )}
        {visibleColumns.netmask && (
          <td className="px-6 py-4 text-sm text-charcoal">{info.netmask}</td>
        )}
        {visibleColumns.range && (
          <td className="px-6 py-4 text-sm text-charcoal">{info.range}</td>
        )}
        {visibleColumns.useable && (
          <td className="px-6 py-4 text-sm text-charcoal">{info.useable}</td>
        )}
        {visibleColumns.hosts && (
          <td className="px-6 py-4 text-sm text-charcoal">{info.hosts}</td>
        )}
        {visibleColumns.divide && (
          <td className="px-6 py-4 text-sm">
            {info.hosts > 1 && !node.subnets ? (
              <button
                onClick={() => onDivide(node)}
                className="text-bdazzled hover:text-bdazzled-light transition-colors"
              >
                Divide
              </button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
        )}
        {visibleColumns.join && (
          <td className="px-6 py-4 text-sm">
            {depth > 0 ? (
              <button
                onClick={() => onJoin(node)}
                className="text-bdazzled hover:text-bdazzled-light transition-colors"
              >
                Join
              </button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
        )}
      </tr>
      {node.subnets?.map((subnet, index) => {
        const subnetBits = info.address.split('/')[1];
        const newMask = parseInt(subnetBits) + 1;
        const baseIp = info.address.split('/')[0].split('.');
        const subnetNum = parseInt(baseIp[3]) + (index * Math.pow(2, 32 - newMask));
        baseIp[3] = subnetNum.toString();
        const subnetInfo = calculateSubnetInfo(baseIp.join('.'), newMask);
        
        return (
          <SubnetRow
            key={index}
            info={subnetInfo}
            node={subnet}
            visibleColumns={visibleColumns}
            onDivide={onDivide}
            onJoin={onJoin}
            depth={depth + 1}
          />
        );
      })}
    </>
  );
}

export function SubnetTable({
  network,
  netBits,
  visibleColumns,
  subnets,
  onDivide,
  onJoin
}: SubnetTableProps) {
  const initialSubnetInfo = calculateSubnetInfo(network, netBits);

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yankees">
            <tr>
              {visibleColumns.subnet && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Subnet address
                </th>
              )}
              {visibleColumns.netmask && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Netmask
                </th>
              )}
              {visibleColumns.range && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Range of addresses
                </th>
              )}
              {visibleColumns.useable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Useable IPs
                </th>
              )}
              {visibleColumns.hosts && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Hosts
                </th>
              )}
              {visibleColumns.divide && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Divide
                </th>
              )}
              {visibleColumns.join && (
                <th className="px-6 py-3 text-left text-xs font-medium text-platinum uppercase tracking-wider">
                  Join
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <SubnetRow
              info={initialSubnetInfo}
              node={subnets}
              visibleColumns={visibleColumns}
              onDivide={onDivide}
              onJoin={onJoin}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}