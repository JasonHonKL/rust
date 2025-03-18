const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const path = require('path');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld(
  'api', {
    openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
    readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    getHomePath: () => os.homedir(),
    getPathSeparator: () => path.sep
  }
);