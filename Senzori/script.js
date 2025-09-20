
window.addEventListener('DOMContentLoaded', function() {
    Papa.parse('data.CSV', {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            const allRows = results.data;
            displayFullTable(allRows);
            // For charts, use only data rows (skip first two rows)
            const dataRows = allRows.slice(2);
            const headers = allRows[0];
            // Find column indices (there are two Pressure columns)
            const idx = {
                time: headers.indexOf('Time'),
                temperature: headers.indexOf('Temperature'),
                pressure: headers.indexOf('Pressure'),
                sound: headers.indexOf('Sound'),
                light: headers.indexOf('Light'),
                pressure2: headers.lastIndexOf('Pressure'),
                humidity: headers.indexOf('Humidity')
            };
            // Prepare data for each chart
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
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                backgroundColor: color + '22',
                fill: true
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: { beginAtZero: false }
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
    let html = '<table border="1">';
    rows.forEach((row, idx) => {
        html += '<tr>';
        row.forEach(val => {
            // Use <th> for first two rows, <td> for others
            html += idx < 2 ? `<th>${val}</th>` : `<td>${val}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;
}

function displayTable(data) {
    const container = document.getElementById('table-container');
    if (!data.length) {
        container.innerHTML = '<p>Nema podataka.</p>';
        return;
    }
    let html = '<table border="1"><tr>';
    // Table headers
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
    });
    html += '</tr>';
    // Table rows
    data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
            html += `<td>${val}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;
}

function displayChart(data) {
    if (!data.length) return;
    // Assume first column is label, second is value
    const labels = data.map(row => Object.values(row)[0]);
    const values = data.map(row => parseFloat(Object.values(row)[1]));
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Senzorski podaci',
                data: values,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.1)',
                fill: true
            }]
        },
        options: {
            responsive: false
        }
    });
}
