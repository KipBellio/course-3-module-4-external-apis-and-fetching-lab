const stateInput    = document.getElementById("state-input");
const fetchBtn      = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage  = document.getElementById("error-message");

function fetchWeatherAlerts(state) {
    return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch alerts (status ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        });
}

function displayAlerts(data) {
    alertsDisplay.innerHTML = "";

    const summary = document.createElement("p");
    summary.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(summary);

    const list = document.createElement("ul");

    data.features.forEach(alert => {
        const li = document.createElement("li");
        li.textContent = alert.properties.headline;
        list.appendChild(li);
    });

    alertsDisplay.appendChild(list);
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    errorMessage.classList.add("visible");
}

function clearAlerts() {
    alertsDisplay.innerHTML = "";
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
    errorMessage.classList.remove("visible");
}

function resetUI() {
    clearAlerts();
    clearError();
    stateInput.value = "";
}

function handleFetchAlerts() {
    const state = stateInput.value.trim().toUpperCase();

    resetUI();

    if (!state) {
        displayError("Please enter a state abbreviation.");
        return;
    }
    if (state.length !== 2) {
        displayError("State abbreviation must be exactly 2 letters.");
        return;
    }

    fetchBtn.disabled = true;

    fetchWeatherAlerts(state)
        .then(data => displayAlerts(data))
        .catch(error => {
            console.error("Weather alerts fetch failed:", error);
            displayError(error.message || "Network error — please try again.");
        })
        .finally(() => {
            fetchBtn.disabled = false;
        });
}

fetchBtn.addEventListener("click", handleFetchAlerts);

stateInput.addEventListener("keydown", event => {
    if (event.key === "Enter") handleFetchAlerts();
});