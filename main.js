const { app, BrowserWindow, ipcMain } = require('electron');
let win;
// Require the serial handler module
require('./serialHandler.js');

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.on('serial-data', (event, data) => {
    win.webContents.send('serial-data', data);
    console.log(data);
  });
  
app.whenReady().then(createWindow);