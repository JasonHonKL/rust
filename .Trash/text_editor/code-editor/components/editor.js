// components/editor.js
import fileSystemService from '../services/file-system.js';
import themeService from '../services/theme-service.js';

class Editor {
  constructor(container, tabsContainer) {
    this.container = container;
    this.tabsContainer = tabsContainer;
    this.editor = null;
    this.monaco = null;
    this.tabs = new Map();
    this.activeTab = null;
    
    this.initialize();
  }
  
  async initialize() {
    // Initialize Monaco Editor
    await this.initMonaco();
    
    // Subscribe to file open events
    fileSystemService.onFileOpen((filePath, content) => {
      this.openTab(filePath, content);
    });
    
    // Subscribe to theme change events
    themeService.onThemeChange((theme) => {
      if (this.monaco) {
        this.monaco.editor.setTheme(theme.editorTheme);
      }
    });
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCurrentFile();
      }
    });
  }
  
  async initMonaco() {
    // Load Monaco Editor
    return new Promise((resolve) => {
      require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' }});
      require(['vs/editor/editor.main'], () => {
        this.monaco = window.monaco;
        
        // Create editor instance
        this.editor = this.monaco.editor.create(this.container, {
          value: '',
          language: 'javascript',
          theme: themeService.getTheme().editorTheme,
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          fontSize: 14,
          tabSize: 2
        });
        
        resolve();
      });
    });
  }
  
  openTab(filePath, content) {
    const fileName = filePath.split('/').pop();
    
    // Check if tab already exists
    if (this.tabs.has(filePath)) {
      this.activateTab(filePath);
      return;
    }
    
    // Create a new tab
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.dataset.path = filePath;
    tabElement.innerHTML = `
      <span class="tab-name">${fileName}</span>
      <span class="tab-close">×</span>
    `;
    
    // Add click handler to activate tab
    tabElement.addEventListener('click', (e) => {
      if (!e.target.className.includes('tab-close')) {
        this.activateTab(filePath);
      }
    });
    
    // Add click handler to close tab
    const closeBtn = tabElement.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeTab(filePath);
    });
    
    this.tabsContainer.appendChild(tabElement);
    this.tabs.set(filePath, { 
      element: tabElement, 
      model: this.createEditorModel(filePath, content) 
    });
    
    this.activateTab(filePath);
  }
  
  createEditorModel(filePath, content) {
    const fileExtension = filePath.split('.').pop();
    let language = 'plaintext';
    
    // Detect language based on file extension
    switch (fileExtension) {
      case 'js':
        language = 'javascript';
        break;
      case 'ts':
        language = 'typescript';
        break;
      case 'html':
        language = 'html';
        break;
      case 'css':
        language = 'css';
        break;
      case 'json':
        language = 'json';
        break;
      case 'md':
        language = 'markdown';
        break;
    }
    
    return this.monaco.editor.createModel(content, language);
  }
  
  activateTab(filePath) {
    if (!this.tabs.has(filePath)) return;
    
    // Deactivate current active tab
    if (this.activeTab) {
      const activeTab = this.tabs.get(this.activeTab);
      if (activeTab) {
        activeTab.element.classList.remove('active');
      }
    }
    
    // Activate new tab
    const tab = this.tabs.get(filePath);
    tab.element.classList.add('active');
    this.activeTab = filePath;
    
    // Set the editor model
    this.editor.setModel(tab.model);
    
    // Focus editor
    this.editor.focus();
  }
  
  closeTab(filePath) {
    if (!this.tabs.has(filePath)) return;
    
    const tab = this.tabs.get(filePath);
    
    // Remove tab element
    tab.element.remove();
    
    // Dispose the model
    tab.model.dispose();
    
    // Remove from tabs map
    this.tabs.delete(filePath);
    
    // If this was the active tab, activate another tab
    if (this.activeTab === filePath) {
      this.activeTab = null;
      if (this.tabs.size > 0) {
        this.activateTab(this.tabs.keys().next().value);
      } else {
        // No tabs left, clear editor
        this.editor.setModel(null);
      }
    }
    
    // Close the file in the file system service
    fileSystemService.closeFile(filePath);
  }
  
  async saveCurrentFile() {
    if (!this.activeTab) return;
    
    const content = this.editor.getValue();
    const success = await fileSystemService.saveFile(this.activeTab, content);
    
    if (success) {
      console.log('File saved successfully');
    } else {
      console.error('Failed to save file');
    }
  }
}

export default Editor;