import Papa from 'papaparse';
import { Node, Edge, Position } from 'reactflow';
import { z } from 'zod';
import ELK, { ElkNode, ElkEdge } from 'elkjs';

const TopologyRowSchema = z.object({
  source: z.string(),
  target: z.string(),
  type: z.string(),
  localPort: z.string().optional(),
  remotePort: z.string().optional(),
  localPortName: z.string().optional(),
  remotePortName: z.string().optional(),
  bandwidth: z.string().optional(),
  label: z.string().optional(),
});

type TopologyRow = z.infer<typeof TopologyRowSchema>;

interface ParsedTopology {
  nodes: Node[];
  edges: Edge[];
}

interface DevicePorts {
  [deviceId: string]: {
    [portId: string]: {
      name?: string;
      connections: number;
    };
  };
}

function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function calculateNodePosition(index: number, total: number): { x: number; y: number } {
  const radius = Math.min(total * 50, 300);
  const angle = (index / total) * 2 * Math.PI;
  return {
    x: radius * Math.cos(angle) + radius,
    y: radius * Math.sin(angle) + radius,
  };
}

function getNodeType(deviceType: string): string {
  const type = deviceType.toLowerCase();
  if (type.includes('router')) return 'router';
  if (type.includes('switch')) return 'switch';
  if (type.includes('firewall')) return 'firewall';
  if (type.includes('server')) return 'server';
  if (type.includes('client')) return 'client';
  if (type.includes('clientwin')) return 'clientwin';
  if (type.includes('clientmac')) return 'clientmac';
  return 'default';
}

function calculatePortOffset(portIndex: number, totalPorts: number): number {
  if (totalPorts === 1) return 50;
  const spacing = 100 / (totalPorts + 1);
  return spacing * (portIndex + 1);
}

function formatPortInfo(row: TopologyRow, isSource: boolean): string {
  const parts: string[] = [];

  const portNumber = isSource ? row.localPort : row.remotePort;
  const portName = isSource ? row.localPortName : row.remotePortName;

  if (portName) {
    parts.push(portName);
  }
  if (portNumber && (!portName || !portName.includes(portNumber))) {
    parts.push(`Port ${portNumber}`);
  }
  if (row.bandwidth) {
    parts.push(`${row.bandwidth}`);
  }

  return parts.join(' - ');
}

async function layoutNodesAndEdges(nodes: Node[], edges: Edge[]): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const elk = new ELK();
  const elkNodes: ElkNode[] = nodes.map((node) => ({
    id: node.id,
    width: 100,
    height: 100,
  }));

  const elkEdges: ElkEdge[] = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const elkGraph = {
    id: 'root',
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await elk.layout(elkGraph);

  const positionedNodes = nodes.map((node) => {
    const elkNode = layout.children?.find((n) => n.id === node.id);
    if (!elkNode) {
      throw new Error(`Node with id ${node.id} not found in layout`);
    }
    return {
      ...node,
      position: {
        x: elkNode.x ?? 0,
        y: elkNode.y ?? 0,
      },
    };
  });

  return { nodes: positionedNodes, edges };
}

export async function parseTopologyCSV(csvContent: string, showPorts: boolean = true): Promise<ParsedTopology> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: Papa.ParseResult<Record<string, string>>) => {
        try {
          const rows = results.data as Record<string, string>[];

          if (!rows.length) {
            throw new Error('CSV file is empty');
          }

          const requiredColumns = ['source', 'target', 'type'];
          const missingColumns = requiredColumns.filter(
            (col) => !Object.keys(rows[0]).includes(col)
          );

          if (missingColumns.length) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
          }

          const validRows = rows.map((row) => {
            const parsed = TopologyRowSchema.safeParse(row);
            if (!parsed.success) {
              throw new Error(`Invalid row data: ${JSON.stringify(row)}`);
            }
            return parsed.data;
          });

          // Map to track ports for each device
          const devicePorts: DevicePorts = {};

          // First pass: collect all ports
          validRows.forEach((row) => {
            // Source device ports
            if (!devicePorts[row.source]) {
              devicePorts[row.source] = {};
            }
            const sourcePortId = row.localPort || 'default';
            if (!devicePorts[row.source][sourcePortId]) {
              devicePorts[row.source][sourcePortId] = {
                name: row.localPortName,
                connections: 0,
              };
            }
            devicePorts[row.source][sourcePortId].connections++;

            // Target device ports
            if (!devicePorts[row.target]) {
              devicePorts[row.target] = {};
            }
            const targetPortId = row.remotePort || 'default';
            if (!devicePorts[row.target][targetPortId]) {
              devicePorts[row.target][targetPortId] = {
                name: row.remotePortName,
                connections: 0,
              };
            }
            devicePorts[row.target][targetPortId].connections++;
          });

          // Create nodes with proper port configurations
          const nodes: Node[] = Object.entries(devicePorts).map(
            ([deviceId, ports], index) => {
              const portsList = Object.entries(ports).map(
                ([portId, portInfo], portIndex) => ({
                  id: `${deviceId}-${portId}`,
                  name: portInfo.name,
                  position: Position.Bottom,
                  offset: calculatePortOffset(
                    portIndex,
                    Object.keys(ports).length
                  ),
                })
              );

              return {
                id: deviceId,
                type: 'networkNode',
                position: calculateNodePosition(
                  index,
                  Object.keys(devicePorts).length
                ),
                data: {
                  label: deviceId,
                  type: getNodeType(
                    validRows.find(
                      (row) =>
                        row.source === deviceId || row.target === deviceId
                    )?.type || 'default'
                  ),
                  ports: portsList,
                  showPorts,
                },
                draggable: true,
              };
            }
          );

          // Create edges with proper source and target handles
          const edges: Edge[] = validRows.map((row) => {
            const sourcePortId = `${row.source}-${row.localPort || 'default'}`;
            const targetPortId = `${row.target}-${row.remotePort || 'default'}`;

            const sourcePortInfo = formatPortInfo(row, true);
            const targetPortInfo = formatPortInfo(row, false);

            let label = row.label || '';
            if (showPorts && (sourcePortInfo || targetPortInfo)) {
              label = `${sourcePortInfo}\n↔\n${targetPortInfo}`;
            }

            return {
              id: generateNodeId(),
              source: row.source,
              target: row.target,
              sourceHandle: sourcePortId,
              targetHandle: targetPortId,
              label,
              type: 'smoothstep',
              animated: true,
              labelStyle: {
                fill: '#475569',
                fontFamily: 'monospace',
                fontSize: 12,
              },
              style: { stroke: '#64748b', strokeWidth: 2 },
            };
          });

          resolve(await layoutNodesAndEdges(nodes, edges));
        } catch (error) {
          reject(error);
        }
      },
      error: (error: any) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}