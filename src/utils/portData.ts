export interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  description: string;
}

export const commonPorts: PortInfo[] = [
  { port: 20, protocol: 'TCP', service: 'FTP-DATA', description: 'File Transfer Protocol (data channel)' },
  { port: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol (control channel)' },
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Telnet protocol - unencrypted text communications' },
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Simple Mail Transfer Protocol' },
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Domain Name System' },
  { port: 67, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Server)' },
  { port: 68, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Client)' },
  { port: 69, protocol: 'UDP', service: 'TFTP', description: 'Trivial File Transfer Protocol' },
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Hypertext Transfer Protocol' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'Post Office Protocol version 3' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'Network Time Protocol' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'Internet Message Access Protocol' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'Simple Network Management Protocol' },
  { port: 162, protocol: 'UDP', service: 'SNMPTRAP', description: 'SNMP Trap' },
  { port: 389, protocol: 'TCP', service: 'LDAP', description: 'Lightweight Directory Access Protocol' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'HTTP Secure' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block' },
  { port: 514, protocol: 'UDP', service: 'Syslog', description: 'System Logging Protocol' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP over SSL' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over SSL' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over SSL' },
  { port: 1433, protocol: 'TCP', service: 'MS SQL', description: 'Microsoft SQL Server' },
  { port: 1521, protocol: 'TCP', service: 'Oracle', description: 'Oracle Database' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL Database' },
  { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Remote Desktop Protocol' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL Database' },
  { port: 8080, protocol: 'TCP', service: 'HTTP Alt', description: 'Alternative HTTP Port' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS Alt', description: 'Alternative HTTPS Port' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB Database' }
];