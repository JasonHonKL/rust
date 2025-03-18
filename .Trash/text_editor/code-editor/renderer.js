// renderer.js
import FileExplorer from './components/file-explorer.js';
import Editor from './components/editor.js';
import ChatPanel from './components/chat-panel.js';
import Terminal from './components/terminal.js';
import terminalService from './services/terminal-service.js';
import themeService from './services/theme-service.js';

// Apply initial theme
themeService.applyTheme();

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Split.js for resizable panels
  const topSplit = Split(['#file-explorer', '#editor-container', '#chat-panel'], {
    sizes: [20, 60, 20],
    minSize: [150, 300, 150],
    gutterSize: 5,
    cursor: 'col-resize'
  });
  
  const verticalSplit = Split(['#top-container', '#terminal-container'], {
    direction: 'vertical',
    sizes: [80, 20],
    minSize: [300, 100],
    gutterSize: 5,
    cursor: 'row-resize'
  });
  
  // Initialize components
  const fileExplorer = new FileExplorer(
    document.getElementById('file-explorer'),
    document.getElementById('file-tree')
  );
  
  const editor = new Editor(
    document.getElementById('editor'),
    document.getElementById('tabs-container')
  );
  
  const chatPanel = new ChatPanel(
    document.getElementById('chat-panel')
  );
  
  const terminal = new Terminal(
    document.getElementById('terminal-container')
  );
  
  // Set up global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+` to toggle terminal focus
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      terminal.focus();
    }
    
    // Ctrl+B to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const explorer = document.getElementById('file-explorer');
      if (explorer.style.width === '0px') {
        topSplit.setSizes([20, 60, 20]);
      } else {
        explorer.style.width = '0px';
        document.getElementById('editor-container').style.width = '80%';
      }
    }
    
    // F5 to run/debug (placeholder)
    if (e.key === 'F5') {
      e.preventDefault();
      terminal.focus();
      terminalService.write('Running application... (placeholder)');
    }
  });
});