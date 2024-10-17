// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Section 1: Emission Input Submission
  document
    .getElementById("emissionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const mode = document.getElementById("mode");
      const hours = document.getElementById("hours");
      const co2PerHour =
        mode.options[mode.selectedIndex].getAttribute("data-co2");

      const data = {
        mode: mode.value,
        co2PerHour: co2PerHour,
        hours: hours.value,
      };

      // Sending data to backend
      fetch("/add/emmission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);

          // Reset input fields after successful submission
          mode.selectedIndex = 0;
          hours.value = "";

          // Show success popup
          alert("Success: CO2 emission data submitted!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

  // Section 2: Emission Graph Plotting
  function drawEmissionGraph(xCoords, yCoords) {
    const ctx = document.getElementById("emissionChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xCoords,
        datasets: [
          {
            label: "CO2 Emission",
            data: yCoords,
            borderColor: "#4c9a2a",
            borderWidth: 5,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Example graph data
  const xCoords = ["8am", "10am", "12pm", "2pm", "4pm", "6pm"];
  const yCoords = [0.5, 1.2, 0.8, 1.5, 0.9, 1.7];

  // Draw the graph after ensuring the canvas exists
  const emissionCanvas = document.getElementById("emissionChart");
  if (emissionCanvas) {
    drawEmissionGraph(xCoords, yCoords);
  } else {
    console.error("Canvas element not found for the graph");
  }
});
