const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { ipcMain } = require('electron');
const { setPort } = require('./serialPortManager');
const { getPort } = require('./serialPortManager');

let port;
let parser;

ipcMain.on('connect-serial', (event, { serialPort, baudRate }) => {
  // if (port) {
  //   // If there's an existing connection, close it before creating a new one
  //   port.close();
  // }
  
  // Create a new SerialPort instance with the received configuration
  setPort(new SerialPort({ path: serialPort, baudRate: baudRate }));

  port = getPort();
  
  // In serialHandler.js
  ipcMain.emit('serial-connected');

  // Set up the parser
  parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  // Set up the data event listener
  parser.on('data', (data) => {
    const floats = data.split(' ').map(Number);
    ipcMain.emit('serial-data', null, floats);
    console.log(floats);
  });
});