const manualForm = document.getElementById('manualIdentifyForm');
const outputDiv = document.getElementById('identificationOutput');
const resultText = document.getElementById('result-text');

// Set your FastAPI backend URL
const API_URL = 'http://127.0.0.1:8000/predict';

// Redirect output to output.html
function redirectToOutput(result, inputData) {
    const outputPayload = {
        result: result,
        input: inputData
    };
    localStorage.setItem("exoplanetResult", JSON.stringify(outputPayload));
    window.location.href = "output.html";
}

// Error display
function displayError(message) {
    resultText.textContent = message;
    outputDiv.style.borderColor = 'var(--color-accent-red)';
    outputDiv.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.5)';
}

// Function to send manual input to API
async function sendManualData(payload) {
    resultText.textContent = "Analyzing data... Stand by for classification.";
    outputDiv.style.borderColor = '#555';
    outputDiv.style.boxShadow = 'none';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        displayError(`Error during analysis: ${error.message}`);
        return { classification: "Error", error: error.message };
    }
}

// Manual Form Submission
manualForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(manualForm);
    const payload = {};

    // Convert form data to a payload of floats
    for (const [key, value] of formData.entries()) {
        payload[key] = parseFloat(value);
    }

    const result = await sendManualData(payload);
    // Use the manual form data as input data for the output page
    redirectToOutput(result, payload);
});