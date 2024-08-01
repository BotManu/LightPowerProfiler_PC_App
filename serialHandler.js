const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { ipcMain } = require('electron');

const port = new SerialPort({ path: "COM6", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
  const floats = data.split(' ').map(Number);
  ipcMain.emit('serial-data', null, floats);
  console.log(floats);
});