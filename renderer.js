const { ipcRenderer } = require('electron');

const ctx = document.getElementById('dataChart').getContext('2d');
const dataChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Time or measurement index
    datasets: [
      // Create 6 datasets, one for each float number
    //   { label: 'Sensor 1', data: [], borderColor: 'red' },
    //   { label: 'Sensor 2', data: [], borderColor: 'green' },
      { label: 'Sensor 3', data: [], borderColor: 'blue' }
    //   { label: 'Sensor 4', data: [], borderColor: 'yellow' },
    //   { label: 'Sensor 5', data: [], borderColor: 'purple' },
    //   { label: 'Sensor 6', data: [], borderColor: 'orange' }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: {duration: 0}
  }
});

ipcRenderer.on('serial-data', (event, floats) => {
    // Assuming floats is an array of 6 numbers
    if (floats.length === 6) {
        const nextIndex = dataChart.data.labels.length + 1;
        dataChart.data.labels.push(nextIndex.toString());
        // floats.forEach((value, index) => {
        //   dataChart.data.datasets[index].data.push(value);
        // });
        dataChart.data.datasets[0].data.push(floats[2]);

        // Keep only the last 50 data points
        if (dataChart.data.labels.length > 500) {
            dataChart.data.labels.shift();
            dataChart.data.datasets[0].data.shift();
        }

        dataChart.update();
    }
});

window.addEventListener('resize', () => {
    dataChart.resize();
});