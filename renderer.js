const { ipcRenderer } = require('electron');

const ctx = document.getElementById('dataChart').getContext('2d');
const dataChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Vbus', data: [], borderColor: 'red' },
      { label: 'Vshunt', data: [], borderColor: 'green' },
      { label: 'Current', data: [], borderColor: 'blue' },
      { label: 'Power', data: [], borderColor: 'yellow' },
      { label: 'Energy', data: [], borderColor: 'purple' },
      { label: 'Charge', data: [], borderColor: 'orange' }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: { duration: 0 }
  }
});

document.getElementById('toggleVbus').addEventListener('change', (event) => {
  dataChart.data.datasets[0].hidden = !event.target.checked;
  dataChart.update();
});

document.getElementById('toggleVshunt').addEventListener('change', (event) => {
  dataChart.data.datasets[1].hidden = !event.target.checked;
  dataChart.update();
});

document.getElementById('toggleCurrent').addEventListener('change', (event) => {
  dataChart.data.datasets[2].hidden = !event.target.checked;
  dataChart.update();
});

document.getElementById('togglePower').addEventListener('change', (event) => {
  dataChart.data.datasets[3].hidden = !event.target.checked;
  dataChart.update();
});

document.getElementById('toggleEnergy').addEventListener('change', (event) => {
  dataChart.data.datasets[4].hidden = !event.target.checked;
  dataChart.update();
});

document.getElementById('toggleCharge').addEventListener('change', (event) => {
  dataChart.data.datasets[5].hidden = !event.target.checked;
  dataChart.update();
});

ipcRenderer.on('serial-data', (event, floats) => {
  // Assuming floats is an array of 6 numbers
  if (floats.length === 6) {
    const nextIndex = dataChart.data.labels.length + 1;
    dataChart.data.labels.push(nextIndex.toString());
    // Iterate over each dataset and push the corresponding data point
    dataChart.data.datasets.forEach((dataset, index) => {
      if (index < floats.length) { // Ensure there's a corresponding float
        dataset.data.push(floats[index]);
      }
    });

    // Keep only the last N data points, where N is selected by the user
    if (dataChart.data.labels.length > maxDataPoints) {
      trimDataPoints();
    }

    dataChart.update();
  }
});

const dataPointsSelect = document.getElementById('dataPoints');
let maxDataPoints = parseInt(dataPointsSelect.value, 10);

dataPointsSelect.addEventListener('change', () => {
  maxDataPoints = parseInt(dataPointsSelect.value, 10);
  trimDataPoints();
});

function trimDataPoints() {
  while (dataChart.data.labels.length > maxDataPoints) {
    dataChart.data.labels.shift();
    dataChart.data.datasets.forEach(dataset => {
      dataset.data.shift();
    });
  }
  dataChart.update();
}

window.addEventListener('resize', () => {
  dataChart.resize();
});