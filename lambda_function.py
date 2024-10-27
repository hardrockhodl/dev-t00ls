import json
import re

def parse_show_interfaces(text):
    interfaces = []
    current_interface = None
    
    # Regex patterns
    interface_pattern = re.compile(r"^(\S+)\s+is\s+(up|down|administratively down)")
    protocol_pattern = re.compile(r"line protocol is\s+(up|down)")
    ip_pattern = re.compile(r"Internet address is\s+(\S+)")
    description_pattern = re.compile(r"Description:\s+(.+)$")
    
    for line in text.splitlines():
        line = line.strip()
        
        # Match interface header
        if match := interface_pattern.search(line):
            if current_interface:
                interfaces.append(current_interface)
            
            current_interface = {
                "interface": match.group(1),
                "status": match.group(2),
                "protocol": "unknown",
                "ip_address": None,
                "description": None
            }
            
            # Check for protocol status on the same line
            if proto_match := protocol_pattern.search(line):
                current_interface["protocol"] = proto_match.group(1)
        
        # Match additional interface details
        elif current_interface:
            if proto_match := protocol_pattern.search(line):
                current_interface["protocol"] = proto_match.group(1)
            elif ip_match := ip_pattern.search(line):
                current_interface["ip_address"] = ip_match.group(1)
            elif desc_match := description_pattern.search(line):
                current_interface["description"] = desc_match.group(1)
    
    # Add the last interface
    if current_interface:
        interfaces.append(current_interface)
    
    return interfaces

def parse_show_ip_int_brief(text):
    interfaces = []
    
    # Skip header lines
    lines = text.splitlines()[1:]
    
    for line in lines:
        parts = line.split()
        if len(parts) >= 6:
            interfaces.append({
                "interface": parts[0],
                "ip_address": parts[1] if parts[1] != "unassigned" else None,
                "status": parts[4].lower(),
                "protocol": parts[5].lower(),
                "description": None
            })
    
    return interfaces

def lambda_handler(event, context):
    try:
        # Get the CLI output from the request body
        body = json.loads(event.get('body', '{}'))
        cli_text = body.get('body', '').strip()
        
        if not cli_text:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'No CLI output provided'
                })
            }
        
        # Determine the command type and parse accordingly
        interfaces = []
        if 'show interfaces' in cli_text.lower():
            interfaces = parse_show_interfaces(cli_text)
        elif 'show ip int' in cli_text.lower():
            interfaces = parse_show_ip_int_brief(cli_text)
        else:
            # Default to basic interface parsing
            interfaces = parse_show_interfaces(cli_text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'interfaces': interfaces,
                'command_type': 'show_interfaces'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }