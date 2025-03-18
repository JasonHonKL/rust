// services/terminal-service.js
import { Terminal } from 'xterm';

class TerminalService {
  constructor() {
    this.terminal = null;
    this.initialized = false;
  }

  initialize(domElement) {
    if (this.initialized) return;
    
    this.terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      },
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      rendererType: 'canvas'
    });
    
    this.terminal.open(domElement);
    
    // Placeholder for real terminal functionality
    this.terminal.writeln('Terminal functionality is limited in this preview.');
    this.terminal.writeln('In a full implementation, node-pty would be used to create a real terminal.');
    this.terminal.writeln('');
    this.terminal.write('$ ');
    
    this.terminal.onData(data => {
      this.terminal.write(data);
      
      if (data === '\r') {
        this.terminal.writeln('');
        this.terminal.write('$ ');
      }
    });
    
    this.initialized = true;
  }
  
  write(text) {
    if (this.terminal) {
      this.terminal.writeln(text);
    }
  }
  
  clear() {
    if (this.terminal) {
      this.terminal.clear();
    }
  }
  
  focus() {
    if (this.terminal) {
      this.terminal.focus();
    }
  }
}

export default new TerminalService();