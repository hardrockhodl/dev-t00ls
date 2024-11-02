
export const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export type CommandType = 'platform' | 'process' | 'both' | 'nexus';

export const platformColumns = {
  name: 'Name',
  value: 'Value',
  unit: 'Unit'
} as const;

export const processColumns = {
  pid: 'PID',
  tty: 'TTY',
  allocated: 'Allocated',
  freed: 'Freed',
  holding: 'Holding',
  getbufs: 'Getbufs',
  retbufs: 'Retbufs',
  process: 'Process'
} as const;

export const nexusProcessColumns = {
  pid: 'PID',
  memAlloc: 'Memory Allocated',
  memLimit: 'Memory Limit',
  memUsed: 'Memory Used',
  stackInfo: 'Stack Info',
  process: 'Process'
} as const;

export const processPoolColumns = {
  name: 'Pool Name',
  total: 'Total',
  used: 'Used',
  free: 'Free'
} as const;

function parseNumericValue(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10);
}

function detectCommandType(text: string): CommandType {
  if (text.includes('MemAlloc') && text.includes('StackBase/Ptr')) {
    return 'nexus';
  }
  const hasProcess = text.includes('show process memory') || text.includes('Processor Pool Total:');
  const hasPlatform = text.includes('show memor platfor') || text.includes('Memory (kB)');
  
  if (hasProcess && hasPlatform) return 'both';
  if (hasProcess) return 'process';
  return 'platform';
}

function parseNexusProcessTable(text: string): Array<Record<string, string>> {
  const lines = text.split('\n');
  const processes: Array<Record<string, string>> = [];
  
  // Find the header line
  const headerIndex = lines.findIndex(line => line.includes('PID') && line.includes('MemAlloc'));
  if (headerIndex === -1) return processes;
  
  // Skip the header and separator lines
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('-')) continue;
    
    // Parse using regex to handle variable spacing
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([^\s].*?)\s+(.+?)\s*$/);
    if (!match) continue;
    
    const [, pid, memAlloc, memLimit, memUsed, stackInfo, process] = match;
    
    processes.push({
      [nexusProcessColumns.pid]: pid,
      [nexusProcessColumns.memAlloc]: formatSize(parseInt(memAlloc)),
      [nexusProcessColumns.memLimit]: memLimit === '0' ? 'No Limit' : formatSize(parseInt(memLimit)),
      [nexusProcessColumns.memUsed]: formatSize(parseInt(memUsed)),
      [nexusProcessColumns.stackInfo]: stackInfo,
      [nexusProcessColumns.process]: process.trim()
    });
  }
  
  return processes;
}

function parseProcessPools(text: string): Array<Record<string, string>> {
  const poolRegex = /([\w\s]+)Pool Total:\s+(\d+)\s+Used:\s+(\d+)\s+Free:\s+(\d+)/g;
  const pools: Array<Record<string, string>> = [];
  
  let match;
  while ((match = poolRegex.exec(text)) !== null) {
    pools.push({
      [processPoolColumns.name]: match[1].trim(),
      [processPoolColumns.total]: formatSize(parseNumericValue(match[2])),
      [processPoolColumns.used]: formatSize(parseNumericValue(match[3])),
      [processPoolColumns.free]: formatSize(parseNumericValue(match[4]))
    });
  }
  
  return pools;
}

function parseProcessTable(text: string): Array<Record<string, string>> {
  const lines = text.split('\n');
  const processes: Array<Record<string, string>> = [];
  
  // Find the line with PID TTY header
  const headerIndex = lines.findIndex(line => line.includes('PID TTY'));
  if (headerIndex === -1) return processes;
  
  // Process each line after the header
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(/\s+/);
    if (parts.length < 8) continue;
    
    processes.push({
      [processColumns.pid]: parts[0],
      [processColumns.tty]: parts[1],
      [processColumns.allocated]: formatSize(parseNumericValue(parts[2])),
      [processColumns.freed]: formatSize(parseNumericValue(parts[3])),
      [processColumns.holding]: formatSize(parseNumericValue(parts[4])),
      [processColumns.getbufs]: formatSize(parseNumericValue(parts[5])),
      [processColumns.retbufs]: formatSize(parseNumericValue(parts[6])),
      [processColumns.process]: parts[7]
    });
  }
  
  return processes;
}

function parsePlatformMemory(text: string): Array<Record<string, string>> {
  const lines = text.trim().split('\n');
  const result: Array<Record<string, string>> = [];
  let currentSection = '';
  let currentUnit: typeof units[number] | null = null;

  lines.forEach(line => {
    line = line.trim();
    if (!line || line.includes('#')) return;

    // Check for section headers with units
    if (line.includes('(kB)')) {
      currentUnit = 'KB';
      currentSection = line.split('(')[0].trim();
      return;
    }

    // Handle section headers without units
    if (line.match(/^[A-Za-z ]+$/)) {
      currentSection = line;
      currentUnit = null;
      return;
    }

    // Parse key-value pairs
    const parts = line.split(':').map(part => part.trim());
    if (parts.length !== 2) return;

    const [name, valueStr] = parts;
    const fullName = currentSection ? `${currentSection} - ${name.trim()}` : name.trim();
    
    // Parse numeric values
    const numValue = parseFloat(valueStr.replace(/,/g, ''));
    let value = valueStr;
    let unit = currentUnit || '-';

    if (!isNaN(numValue)) {
      if (numValue < 1000 && !currentUnit) {
        value = numValue.toFixed(2);
      } else {
        const bytes = currentUnit ? convertSize(numValue, currentUnit, 'B') : numValue;
        value = formatSize(bytes);
        unit = currentUnit || 'B';
      }
    }

    result.push({
      [platformColumns.name]: fullName,
      [platformColumns.value]: value,
      [platformColumns.unit]: unit
    });
  });

  return result;
}

export function convertSize(size: number, fromUnit: typeof units[number], toUnit: typeof units[number]): number {
  const fromIndex = units.indexOf(fromUnit);
  const toIndex = units.indexOf(toUnit);
  const powerDiff = fromIndex - toIndex;
  return size * Math.pow(1024, powerDiff);
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  
  return `${value} ${units[i]}`;
}

export function parseNetworkOutput(text: string): {
  type: CommandType;
  platformData?: Array<Record<string, string>>;
  processData?: Array<Record<string, string>>;
  poolData?: Array<Record<string, string>>;
} {
  const commandType = detectCommandType(text);
  const result: ReturnType<typeof parseNetworkOutput> = { type: commandType };
  
  if (commandType === 'nexus') {
    result.processData = parseNexusProcessTable(text);
    return result;
  }
  
  // Parse platform data if present
  if (commandType === 'platform' || commandType === 'both') {
    result.platformData = parsePlatformMemory(text);
  }
  
  // Parse process data if present
  if (commandType === 'process' || commandType === 'both') {
    result.processData = parseProcessTable(text);
    result.poolData = parseProcessPools(text);
  }
  
  return result;
}