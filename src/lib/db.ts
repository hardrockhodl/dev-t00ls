import { supabase } from './supabase';

export interface Port {
  unik_key: number;
  service_name: string;
  port_number: string;
  protocol: string;
  description: string;
}

export async function searchPorts(query: string): Promise<Port[]> {
  try {
    // First, get exact matches on port_number
    const { data: exactMatches, error: exactError } = await supabase
      .from('mytable')
      .select('*')
      .eq('port_number', query); // Exact match on port_number

    if (exactError) throw exactError;

    // Then, get other partial matches
    const { data: partialMatches, error: partialError } = await supabase
      .from('mytable')
      .select('*')
      .or(
        `port_number.ilike.%${query}%,` +
        `protocol.ilike.%${query}%,` +
        `service_name.ilike.%${query}%,` +
        `description.ilike.%${query}%`
      );

    if (partialError) throw partialError;

    // Filter out any duplicates if `query` was part of other fields like `protocol`
    const uniquePartialMatches = partialMatches?.filter(
      (item) => item.port_number !== query
    );

    // Combine exact matches with the remaining partial matches
    return [...(exactMatches || []), ...(uniquePartialMatches || [])].sort(
      (a, b) => parseInt(a.port_number, 10) - parseInt(b.port_number, 10)
    );
  } catch (error) {
    console.error('Error searching ports:', error);
    return [];
  }
}

export async function getAllPorts(): Promise<Port[]> {
  try {
    const { data, error } = await supabase
      .from('mytable')
      .select('*')
      .order('port_number')
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ports:', error);
    return [];
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    // Check if we already have data
    const { count, error: countError } = await supabase
      .from('mytable')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Only insert if table is empty
    if (count === 0) {
      const commonPorts = [
        { service_name: 'FTP-DATA', port_number: '20', protocol: 'TCP', description: 'File Transfer Protocol (data channel)' },
        { service_name: 'FTP', port_number: '21', protocol: 'TCP', description: 'File Transfer Protocol (control channel)' },
        { service_name: 'SSH', port_number: '22', protocol: 'TCP', description: 'Secure Shell' },
        { service_name: 'Telnet', port_number: '23', protocol: 'TCP', description: 'Telnet protocol - unencrypted text communications' },
        { service_name: 'SMTP', port_number: '25', protocol: 'TCP', description: 'Simple Mail Transfer Protocol' },
        { service_name: 'DNS', port_number: '53', protocol: 'TCP/UDP', description: 'Domain Name System' },
        { service_name: 'HTTP', port_number: '80', protocol: 'TCP', description: 'Hypertext Transfer Protocol' },
        { service_name: 'HTTPS', port_number: '443', protocol: 'TCP', description: 'HTTP Secure' }
      ];

      const { error: insertError } = await supabase
        .from('mytable')
        .insert(commonPorts);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}