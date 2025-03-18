// components/terminal.js
import terminalService from '../services/terminal-service.js';

class Terminal {
  constructor(container) {
    this.container = container;
    this.terminalElement = container.querySelector('#terminal');
    
    this.initialize();
  }
  
  initialize() {
    // Initialize the terminal service with the DOM element
    terminalService.initialize(this.terminalElement);
  }
  
  focus() {
    terminalService.focus();
  }
  
  clear() {
    terminalService.clear();
  }
}

export default Terminal;