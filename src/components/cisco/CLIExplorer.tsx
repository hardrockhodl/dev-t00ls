import React, { useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Import the commands
import commands from '../../lib/ciscoCommands';

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const inputBuffer = useRef<string>(''); // Buffer to store input

  useEffect(() => {
    if (terminalRef.current) {
      // Initialize Terminal and FitAddon
      term.current = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#151419',
          foreground: '#e6e6e6',
        },
      });
      fitAddon.current = new FitAddon();
      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      fitAddon.current.fit();

      // Display initial welcome message
      term.current.writeln('Welcome to Cisco Device Simulator');
      term.current.writeln('Type "help" to see available commands');
      term.current.write('Router> ');

      // Listen for user input
      term.current.onData((data) => {
        handleInput(data);
      });

      // Adjust terminal size on window resize
      const handleResize = () => {
        fitAddon.current?.fit();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        term.current?.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle input
  const handleInput = useCallback((data: string) => {
    if (data === '\r') {
      // Enter key detected, process the command
      handleCommand(inputBuffer.current);
      inputBuffer.current = ''; // Clear the buffer
      term.current?.write('\r\nRouter> '); // Show the prompt again
    } else if (data === '\u007F') {
      // Handle backspace
      if (inputBuffer.current.length > 0) {
        inputBuffer.current = inputBuffer.current.slice(0, -1);
        term.current?.write('\b \b'); // Erase character visually
      }
    } else {
      // Append character to buffer
      inputBuffer.current += data;
      term.current?.write(data); // Echo the character
    }
  }, []);

  // Function to process commands
  const handleCommand = (input: string) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput === 'exit') {
      term.current?.writeln('Exiting...');
    } else if (commands[trimmedInput]) {
      term.current?.writeln(commands[trimmedInput]);
    } else {
      term.current?.writeln(`Command not recognized: ${trimmedInput}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rounded-lg shadow-lg font-mono bg-yankees overflow-hidden border border-gray-700">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 text-gray-300">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-sm font-mono">Cisco CLI Explorer</div>
        <div></div> {/* Empty div to balance header layout */}
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="w-full min-h-[300px] pl-4 pb-4" 
        id="terminal-container"
      ></div>
    </div>
  );
};

export default TerminalComponent;