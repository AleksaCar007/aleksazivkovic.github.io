window.addEventListener('DOMContentLoaded', function () {
  Papa.parse('data.CSV', {
    download: true,
    header: false,
    skipEmptyLines: true,
    complete: function (results) {
      const allRows = results.data;
      displayFullTable(allRows);

      const dataRows = allRows.slice(2);
      const headers = allRows[0];

      const idx = {
        time: headers.indexOf('Time'),
        temperature: headers.indexOf('Temperature'),
        pressure: headers.indexOf('Pressure'),
        sound: headers.indexOf('Sound'),
        light: headers.indexOf('Light'),
        pressure2: headers.lastIndexOf('Pressure'),
        humidity: headers.indexOf('Humidity')
      };

      createSensorChart('chart-temperature', dataRows, idx.time, idx.temperature, 'Temperatura (°C)', 'red');
      createSensorChart('chart-pressure', dataRows, idx.time, idx.pressure, 'Pritisak (kPa)', 'blue');
      createSensorChart('chart-pressure2', dataRows, idx.time, idx.pressure2, 'Pritisak 2 (kPa)', 'purple');
      createSensorChart('chart-sound', dataRows, idx.time, idx.sound, 'Zvuk (dBA)', 'orange');
      createSensorChart('chart-light', dataRows, idx.time, idx.light, 'Svetlo (lx)', 'gold');
      createSensorChart('chart-humidity', dataRows, idx.time, idx.humidity, 'Vlaznost (%RH)', 'green');
    }
  });
});

function createSensorChart(canvasId, dataRows, timeIdx, valueIdx, label, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const labels = dataRows.map(row => row[timeIdx]);
  const values = dataRows.map(row => parseFloat(row[valueIdx]));

  const transparentColorMap = {
    red: 'rgba(255, 0, 0, 0.2)',
    blue: 'rgba(0, 0, 255, 0.2)',
    purple: 'rgba(128, 0, 128, 0.2)',
    orange: 'rgba(255, 165, 0, 0.2)',
    gold: 'rgba(255, 215, 0, 0.2)',
    green: 'rgba(0, 128, 0, 0.2)'
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        borderColor: color,
        backgroundColor: transparentColorMap[color] || 'rgba(0,0,0,0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Vreme (s)',
            font: { size: 14 }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: label
          }
        }
      }
    }
  });
}

function displayFullTable(rows) {
  const container = document.getElementById('table-container');
  if (!rows.length) {
    container.innerHTML = '<p>Nema podataka.</p>';
    return;
  }

  // Count duplicate columns for Pressure
  const headerRow = rows[0];
  let pressureCount = 0;

  const headerTranslations = {
    'Time': 'Vreme',
    'Temperature': 'Temperatura (°C)',
    'Pressure': () => {
      pressureCount++;
      return pressureCount === 1 ? 'Pritisak (kPa)' : 'Pritisak 2 (kPa)';
    },
    'Sound': 'Zvuk (dBA)',
    'Light': 'Svetlo (lx)',
    'Humidity': 'Vlaznost (%RH)'
  };

  let html = '<table border="1">';
  rows.forEach((row, idx) => {
    html += '<tr>';
    row.forEach((val, colIndex) => {
      let displayVal = val;

      if (idx === 0) {
        const originalVal = val;
        if (typeof headerTranslations[originalVal] === 'function') {
          displayVal = headerTranslations[originalVal]();
        } else {
          displayVal = headerTranslations[originalVal] || val;
        }
      }

      html += idx < 2 ? `<th>${displayVal}</th>` : `<td>${val}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  container.innerHTML = html;
}

