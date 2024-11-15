import { ParseResponse, APIError } from '../types/cisco';
import { toast } from 'react-hot-toast';

export async function parseCiscoCLI(input: string): Promise<ParseResponse> {
  if (!input.trim()) {
    throw new Error('CLI input is required');
  }

  const apiUrl = import.meta.env.VITE_AWS_API_URL;
  const apiKey = import.meta.env.VITE_AWS_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('API configuration is missing');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ body: input.trim() }), // Changed to match API expectation
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errorData: APIError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
  // Define an interface for the expected structure
    interface NetworkInterface {
      interface?: string;
      status?: string;
      protocol?: string;
      ip_address?: string;
      description?: string;
      mtu?: number;
    }

    // Handle the specific response format from the AWS Lambda
    const interfaces = data.interfaces?.map((intf: NetworkInterface) => ({
      name: intf.interface || 'Unknown',
      status: intf.status || 'Unknown',
      protocol: intf.protocol || 'Unknown',
      ipAddress: intf.ip_address || 'N/A',
      description: intf.description,
      mtu: intf.mtu
    })) || [];

    return {
      interfaces,
      timestamp: new Date().toISOString(),
      deviceType: 'Cisco Device'
    };
  } catch (error) {
    let message = 'An unknown error occurred';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        message = 'Request timed out';
      } else if (error.message.includes('fetch')) {
        message = 'Unable to connect to the server';
      } else {
        message = error.message;
      }
    }
    
    toast.error(message);
    throw error;
  }
}