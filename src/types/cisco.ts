export interface ParsedInterface {
  name: string;
  status: string;
  protocol: string;
  description?: string;
  ipAddress?: string;
  mtu?: number;
}

export interface ParseResponse {
  interfaces: ParsedInterface[];
  timestamp: string;
  deviceType?: string;
}

export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}