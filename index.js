const stateInput    = document.getElementById("state-input");
const fetchBtn      = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage  = document.getElementById("error-message");

// function to fetch weather alerts
function fetchWeatherAlerts(state) {
    fetch(`https://api.weather.gov/alerts/active?area=${state}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);        
            displayAlerts(data);      
        })
        .catch(errorObject => {
            console.log(errorObject.message);
            showError(errorObject.message);
        });
}
//Function to display alerts
function displayAlerts(data) {
    //Summary
    const summary = document.createElement("p");
    summary.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(summary);

    // List of headlines
    const list = document.createElement("ul");
    data.features.forEach(alert => {
        const li = document.createElement("li");
        li.textContent = alert.properties.headline;
        list.appendChild(li);
    });
    alertsDisplay.appendChild(list);
}

//Function to clear UI
function clearUI() {
    alertsDisplay.innerHTML = "";
    stateInput.value = "";
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

fetchBtn.addEventListener("click", () => {
    const state = stateInput.value.trim().toUpperCase();
    clearUI();

    if (!state) {
        showError("Please enter a state abbreviation.");
        return;
    }

    fetchWeatherAlerts(state);
});