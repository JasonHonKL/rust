// components/file-explorer.js
import fileSystemService from '../services/file-system.js';

class FileExplorer {
  constructor(container, fileTreeContainer) {
    this.container = container;
    this.fileTreeContainer = fileTreeContainer;
    this.currentFolder = null;
    
    this.initialize();
  }
  
  initialize() {
    // Set up event listener for the open folder button
    const openFolderBtn = this.container.querySelector('#open-folder-btn');
    if (openFolderBtn) {
      openFolderBtn.addEventListener('click', () => this.handleOpenFolder());
    }
    
    // Subscribe to folder open event
    fileSystemService.onFolderOpen((folderPath) => this.loadFolder(folderPath));
  }
  
  async handleOpenFolder() {
    await fileSystemService.openFolder();
  }
  
  async loadFolder(folderPath) {
    this.currentFolder = folderPath;
    const contents = await fileSystemService.getDirectoryContents(folderPath);
    this.renderFileTree(contents, this.fileTreeContainer, folderPath);
  }
  
  renderFileTree(items, container, parentPath) {
    container.innerHTML = '';
    
    // Sort directories first, then files, both alphabetically
    items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    for (const item of items) {
      const itemElement = document.createElement('div');
      itemElement.className = 'file-item';
      
      const itemIcon = document.createElement('span');
      itemIcon.className = 'file-icon';
      itemIcon.textContent = item.isDirectory ? '📁' : '📄';
      
      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      
      itemElement.appendChild(itemIcon);
      itemElement.appendChild(itemName);
      
      if (item.isDirectory) {
        itemElement.addEventListener('click', async (event) => {
          event.stopPropagation();
          
          // Toggle folder expanded state
          const folderContent = itemElement.nextElementSibling;
          if (folderContent && folderContent.className === 'folder-content') {
            folderContent.remove();
            itemIcon.textContent = '📁';
          } else {
            const contents = await fileSystemService.getDirectoryContents(item.path);
            const folderContentElement = document.createElement('div');
            folderContentElement.className = 'folder-content';
            container.insertBefore(folderContentElement, itemElement.nextSibling);
            this.renderFileTree(contents, folderContentElement, item.path);
            itemIcon.textContent = '📂';
          }
        });
      } else {
        itemElement.addEventListener('click', () => {
          fileSystemService.openFile(item.path);
        });
      }
      
      container.appendChild(itemElement);
    }
  }
}

export default FileExplorer;