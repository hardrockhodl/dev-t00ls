import { createClient } from '@libsql/client';

const db = createClient({
  url: 'file:ports.db',
});

const commonPorts = [
  { port_number: 20, protocol: 'TCP', service: 'FTP-DATA', description: 'File Transfer Protocol (data channel)', is_official: true },
  { port_number: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol (control channel)', is_official: true },
  { port_number: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell', is_official: true },
  { port_number: 23, protocol: 'TCP', service: 'Telnet', description: 'Telnet protocol - unencrypted text communications', is_official: true },
  { port_number: 25, protocol: 'TCP', service: 'SMTP', description: 'Simple Mail Transfer Protocol', is_official: true },
  { port_number: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Domain Name System', is_official: true },
  { port_number: 67, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Server)', is_official: true },
  { port_number: 68, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Client)', is_official: true },
  { port_number: 69, protocol: 'UDP', service: 'TFTP', description: 'Trivial File Transfer Protocol', is_official: true },
  { port_number: 80, protocol: 'TCP', service: 'HTTP', description: 'Hypertext Transfer Protocol', is_official: true },
  { port_number: 110, protocol: 'TCP', service: 'POP3', description: 'Post Office Protocol version 3', is_official: true },
  { port_number: 123, protocol: 'UDP', service: 'NTP', description: 'Network Time Protocol', is_official: true },
  { port_number: 143, protocol: 'TCP', service: 'IMAP', description: 'Internet Message Access Protocol', is_official: true },
  { port_number: 161, protocol: 'UDP', service: 'SNMP', description: 'Simple Network Management Protocol', is_official: true },
  { port_number: 162, protocol: 'UDP', service: 'SNMPTRAP', description: 'SNMP Trap', is_official: true },
  { port_number: 389, protocol: 'TCP', service: 'LDAP', description: 'Lightweight Directory Access Protocol', is_official: true },
  { port_number: 443, protocol: 'TCP', service: 'HTTPS', description: 'HTTP Secure', is_official: true },
  { port_number: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block', is_official: true },
  { port_number: 514, protocol: 'UDP', service: 'Syslog', description: 'System Logging Protocol', is_official: true },
  { port_number: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP over SSL', is_official: true },
  { port_number: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over SSL', is_official: true },
  { port_number: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over SSL', is_official: true },
  { port_number: 1433, protocol: 'TCP', service: 'MS SQL', description: 'Microsoft SQL Server', is_official: true },
  { port_number: 1521, protocol: 'TCP', service: 'Oracle', description: 'Oracle Database', is_official: true },
  { port_number: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL Database', is_official: true },
  { port_number: 3389, protocol: 'TCP', service: 'RDP', description: 'Remote Desktop Protocol', is_official: true },
  { port_number: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL Database', is_official: true },
  { port_number: 8080, protocol: 'TCP', service: 'HTTP Alt', description: 'Alternative HTTP Port', is_official: true },
  { port_number: 8443, protocol: 'TCP', service: 'HTTPS Alt', description: 'Alternative HTTPS Port', is_official: true },
  { port_number: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB Database', is_official: true }
];

async function setupDatabase() {
  try {
    // Create the ports table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        port_number INTEGER NOT NULL,
        protocol TEXT NOT NULL,
        service TEXT NOT NULL,
        description TEXT NOT NULL,
        is_official BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert initial data
    for (const port of commonPorts) {
      await db.execute({
        sql: `
          INSERT INTO ports (port_number, protocol, service, description, is_official)
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [port.port_number, port.protocol, port.service, port.description, port.is_official]
      });
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();