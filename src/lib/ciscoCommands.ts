// ciscoCommands.ts

const commands: Record<string, string> = {
    'show ip interface brief': `
    Interface              IP-Address      OK? Method Status                Protocol
    GigabitEthernet0/0     192.168.1.1     YES manual up                    up
    GigabitEthernet0/1     unassigned      YES unset  administratively down down
    GigabitEthernet0/2     10.10.10.1      YES manual up                    up`,
    
    'show version': `
    Cisco IOS Software, C800 Software (C800-UNIVERSALK9-M), Version 15.2(4)M6, RELEASE SOFTWARE (fc1)
    Technical Support: http://www.cisco.com/techsupport
    Compiled Tue 07-Jan-20 17:51 by prod_rel_team
  
    ROM: System Bootstrap, Version 15.0(1r)M16, RELEASE SOFTWARE (fc1)
  
    Router uptime is 1 week, 3 days, 22 hours, 10 minutes
    System image file is "flash:c800-universalk9-mz.SPA.152-4.M6.bin"`,
    
    'help': `
    Available commands:
    - show ip interface brief
    - show version
    - configure terminal (mock, does not change state)
    - exit`,
    
    'configure terminal': 'Enter configuration commands, one per line. End with CNTL/Z.',
  };
  
  export default commands;