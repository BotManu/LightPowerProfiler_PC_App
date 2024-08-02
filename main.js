const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort } = require('serialport');
let win;
// Require the serial handler module
require('./serialHandler.js');
const { getPort } = require('./serialPortManager');
const { nullifyPort } = require('./serialPortManager');

let graphWindows = [];

function createGraphWindow(serialPort, baudRate) {
  let graphWin = new BrowserWindow({
    width: 1200,
    height: 900,
    title: `Graph - ${serialPort} @ ${baudRate} Baud`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  graphWin.loadFile('index.html');

  // You can pass serialPort and baudRate to the renderer process if needed
  graphWin.webContents.on('did-finish-load', () => {
    graphWin.webContents.send('config', { serialPort, baudRate });
  });

  // Add the new graphWin to the list
  graphWindows.push(graphWin);

  // Optionally, handle window close to remove it from the list
  graphWin.on('closed', () => {
    graphWindows = graphWindows.filter(win => win !== graphWin);
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
  // Iterate over all graph windows and send the data to each
  graphWindows.forEach((graphWin) => {
    if (!graphWin.isDestroyed()) {
      graphWin.webContents.send('serial-data', data);
    }
  });
  console.log(data);
});

function listSerialPorts(targetWindow) {
  SerialPort.list().then((ports) => {
    targetWindow.webContents.send('serial-ports-list', ports);
  }).catch((err) => console.error(err));
}

// // In main.js
// ipcMain.on('serial-connected', () => {
//   // Assuming win is your BrowserWindow instance for the graph

//     createWindow()

// });

ipcMain.on('create-graph-window', (event, { serialPort, baudRate }) => {
  createGraphWindow(serialPort, baudRate);
});

// Call this function where appropriate, for example, after creating the window:
app.whenReady().then(() => {
  createControlPanel();
});