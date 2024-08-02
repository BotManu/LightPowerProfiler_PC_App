const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort } = require('serialport');
let win;
// Require the serial handler module
require('./serialHandler.js');
const { getPort } = require('./serialPortManager');
const { nullifyPort } = require('./serialPortManager');

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

  const port = getPort();

  // Add this event listener for the window close event
  win.on('close', () => {
    if (port && port.isOpen) {
      port.close((err) => {
        if (err) {
          console.error('Failed to close the port', err);
        } else {
          console.log('Port closed successfully');
          nullifyPort(); // Nullify the port after closing
        }
      });
    }
  });
}

function createControlPanel() {
  const controlWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  controlWin.loadFile('controlPanel.html');
  // Add an event listener for 'ready-to-show'
  controlWin.on('ready-to-show', () => {
    // Now that the window is ready, list the serial ports
    listSerialPorts(controlWin);
  });
}

ipcMain.on('serial-data', (event, data) => {
    win.webContents.send('serial-data', data);
    console.log(data);
  });

function listSerialPorts(targetWindow) {
  SerialPort.list().then((ports) => {
    targetWindow.webContents.send('serial-ports-list', ports);
  }).catch((err) => console.error(err));
}

// In main.js
ipcMain.on('serial-connected', () => {
  // Assuming win is your BrowserWindow instance for the graph
  
    createWindow()
  
});

// Call this function where appropriate, for example, after creating the window:
app.whenReady().then(() => {
  createControlPanel();
  });