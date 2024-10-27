export interface SubnetNode {
  depth: number;
  children: number;
  subnets: [SubnetNode, SubnetNode] | null;
}

export function parseNetworkAddress(address: string, bits: number): { address: string; bits: number } | null {
  const parts = address.split('.');
  if (parts.length !== 4) return null;

  const octets = parts.map(part => parseInt(part, 10));
  if (octets.some(octet => isNaN(octet) || octet < 0 || octet > 255)) return null;
  if (bits < 0 || bits > 32) return null;

  // Ensure address is on network boundary
  const mask = ~((1 << (32 - bits)) - 1);
  const ip = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  const network = ip & mask;

  return {
    address: [
      (network >> 24) & 255,
      (network >> 16) & 255,
      (network >> 8) & 255,
      network & 255
    ].join('.'),
    bits
  };
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0);
}

function numberToIp(num: number): string {
  return [
    (num >> 24) & 255,
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ].join('.');
}

export function calculateSubnetInfo(network: string, bits: number) {
  const networkNum = ipToNumber(network);
  const numAddresses = Math.pow(2, 32 - bits);
  const lastAddress = networkNum + numAddresses - 1;
  
  // Calculate useable range (excluding network and broadcast for /31 and larger)
  let useableFirst = networkNum;
  let useableLast = lastAddress;
  let numHosts = numAddresses;
  
  if (bits < 31) {
    useableFirst = networkNum + 1;
    useableLast = lastAddress - 1;
    numHosts = numAddresses - 2;
  }

  // Generate netmask
  const netmaskNum = ~((1 << (32 - bits)) - 1);

  return {
    address: `${network}/${bits}`,
    netmask: numberToIp(netmaskNum),
    range: `${numberToIp(networkNum)} - ${numberToIp(lastAddress)}`,
    useable: bits < 31 
      ? `${numberToIp(useableFirst)} - ${numberToIp(useableLast)}`
      : numberToIp(networkNum),
    hosts: numHosts
  };
}

export function calculateSubnets(network: string, bits: number, node: SubnetNode): void {
  if (!node.subnets) return;

  const baseIp = ipToNumber(network);
  const subnetSize = 1 << (32 - (bits + 1));

  // Calculate addresses for both subnets
  const subnet1 = baseIp;
  const subnet2 = baseIp + subnetSize;

  calculateSubnets(
    numberToIp(subnet1),
    bits + 1,
    node.subnets[0]
  );

  calculateSubnets(
    numberToIp(subnet2),
    bits + 1,
    node.subnets[1]
  );
}