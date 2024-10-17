document.addEventListener('DOMContentLoaded', () => {
    const activityList = document.getElementById('activity-list');
    const carbonForm = document.getElementById('carbon-form');
    const carbonChartElement = document.getElementById('carbonChart');
    const suggestionsElement = document.getElementById('suggestions');

    let activities = [];
    let chart;

    document.getElementById('add-activity').addEventListener('click', () => {
        const activityElement = document.getElementById('activity');
        const hoursElement = document.getElementById('hours');

        const activity = activityElement.options[activityElement.selectedIndex].text;
        const co2PerHour = parseFloat(activityElement.options[activityElement.selectedIndex].dataset.co2);
        const hours = parseFloat(hoursElement.value);

        const totalCO2 = co2PerHour * hours;
        activities.push({ activity, totalCO2 });

        const listItem = document.createElement('li');
        listItem.textContent = `${activity}: ${totalCO2.toFixed(2)} kg CO2`;
        activityList.appendChild(listItem);

        if (activities.length >= 5) {
            plotChart();
            showSuggestions();
        }
    });

    function plotChart() {
        const labels = activities.map(a => a.activity);
        const data = activities.map(a => a.totalCO2);

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

        const config = {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    hoverOffset: 4
                }]
            }
        };

        if (chart) chart.destroy();
        chart = new Chart(carbonChartElement, config);
    }

    function showSuggestions() {
        const totalCO2 = activities.reduce((acc, cur) => acc + cur.totalCO2, 0);
        let category = '';

        if (totalCO2 < 50) {
            category = 'Low';
        } else if (totalCO2 < 200) {
            category = 'High';
        } else {
            category = 'Very High';
        }

        const suggestions = {
            'Low': [
                'Continue your current habits.',
                'Walk or bike instead of driving short distances.',
                'Use energy-efficient appliances.',
                'Turn off lights when not in use.',
                'Use renewable energy where possible.'
            ],
            'High': [
                'Reduce car travel by using public transport.',
                'Switch to a hybrid or electric vehicle.',
                'Limit heating and air conditioning use.',
                'Use energy-efficient lighting and appliances.',
                'Consider solar panels for your home.'
            ],
            'Very High': [
                'Carpool or use public transport.',
                'Limit air travel.',
                'Invest in renewable energy sources.',
                'Offset your carbon footprint through various programs.',
                'Educate yourself and others about reducing carbon footprints.'
            ]
        };

        suggestionsElement.innerHTML = `<h3>Suggestions for ${category} Carbon Footprint:</h3><ul>` +
            suggestions[category].map(s => `<li>${s}</li>`).join('') +
            `</ul>`;
    }

    // Handle complaint form submission
    document.getElementById('complaint-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const complaintText = e.target.querySelector('textarea').value;
        const fileInput = e.target.querySelector('#file-upload');
        const file = fileInput.files[0];

        // Simulate sending the complaint via email (this part would require server-side implementation)
        alert('Complaint submitted!');

        // Reset form
        e.target.reset();
    });
});
