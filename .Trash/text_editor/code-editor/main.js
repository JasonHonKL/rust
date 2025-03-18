const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle open folder dialog
ipcMain.handle('open-folder-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

// Handle reading directory content
// Add these IPC handlers
ipcMain.handle('readDirectory', async (_, dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    return files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(dirPath, file.name) // Ensure full path is included
    }));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('readFile', async (_, filePath) => {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('saveFile', async (_, filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
});