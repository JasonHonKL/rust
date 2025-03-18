// services/file-system.js
class FileSystemService {
    constructor() {
      this.openFiles = new Map();
      this.currentFile = null;
      this.currentFolder = null;
      this.onFileOpenCallbacks = [];
      this.onFolderOpenCallbacks = [];
    }
  
    async openFolder() {
      const folderPath = await window.api.openFolderDialog();
      if (folderPath) {
        this.currentFolder = folderPath;
        this.notifyFolderOpen();
        return folderPath;
      }
      return null;
    }
  
    async getDirectoryContents(dirPath) {
      return await window.api.readDirectory(dirPath);
    }
  
    async openFile(filePath) {
      if (!this.openFiles.has(filePath)) {
        const content = await window.api.readFile(filePath);
        if (content !== null) {
          this.openFiles.set(filePath, content);
          this.currentFile = filePath;
          this.notifyFileOpen();
          return content;
        }
      } else {
        this.currentFile = filePath;
        this.notifyFileOpen();
        return this.openFiles.get(filePath);
      }
      return null;
    }
  
    async saveFile(filePath, content) {
      const success = await window.api.saveFile(filePath, content);
      if (success) {
        this.openFiles.set(filePath, content);
        return true;
      }
      return false;
    }
  
    closeFile(filePath) {
      this.openFiles.delete(filePath);
      if (this.currentFile === filePath) {
        this.currentFile = this.openFiles.keys().next().value || null;
        this.notifyFileOpen();
      }
    }
  
    onFileOpen(callback) {
      this.onFileOpenCallbacks.push(callback);
    }
  
    onFolderOpen(callback) {
      this.onFolderOpenCallbacks.push(callback);
    }
  
    notifyFileOpen() {
      for (const callback of this.onFileOpenCallbacks) {
        callback(this.currentFile, this.openFiles.get(this.currentFile));
      }
    }
  
    notifyFolderOpen() {
      for (const callback of this.onFolderOpenCallbacks) {
        callback(this.currentFolder);
      }
    }
  }
  
  export default new FileSystemService();