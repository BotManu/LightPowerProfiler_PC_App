const { ipcRenderer } = require('electron');

document.getElementById('connectBtn').addEventListener('click', () => {
  const serialPort = document.getElementById('serialPort').value;
  const baudRate = parseInt(document.getElementById('baudRate').value, 10);
  ipcRenderer.send('connect-serial', { serialPort, baudRate });
});

ipcRenderer.on('serial-ports-list', (event, ports) => {
    const serialPortSelect = document.getElementById('serialPort');
    // Clear existing options first
    serialPortSelect.innerHTML = '';
    // Populate the select element with received serial ports
    ports.forEach((port) => {
      const option = document.createElement('option');
      option.value = port.path;
      option.text = `${port.path} (${port.manufacturer || 'Unknown manufacturer'})`;
      serialPortSelect.appendChild(option);
    });
  });