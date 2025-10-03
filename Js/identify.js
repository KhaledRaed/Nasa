const manualForm = document.getElementById('manualIdentifyForm');
const csvForm = document.getElementById('csvIdentifyForm');
const outputDiv = document.getElementById('identificationOutput');
const resultText = document.getElementById('result-text');

// 1. Base URL for your API endpoint
const API_URL = 'YOUR_BACKEND_API_ENDPOINT_HERE';

// Function to display the result
function displayResult(result) {
    outputDiv.style.borderColor = 'var(--color-accent-red)'; // Highlight on new result
    outputDiv.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.7)';
    resultText.innerHTML = `
        <p class="output-title" style="color: var(--color-accent-red); font-size: 2rem;">
            Classification: <span style="color: var(--color-accent-blue);">${result.classification || 'Unknown'}</span>
        </p>
        <p>Confidence Score: ${result.confidence_score || 'N/A'}</p>
        <p style="margin-top: 15px;">The AI model has processed the data. A classification of 'Candidate' suggests a potential exoplanet, while 'Confirmed' means it meets all criteria.</p>
    `;
}

// Function to handle the API call
async function sendDataToAPI(payload, endpoint = '/identify-manual') {
    // Clear previous results and show loading state
    resultText.textContent = "Analyzing data... Stand by for classification.";
    outputDiv.style.borderColor = '#555';
    outputDiv.style.boxShadow = 'none';

    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);

    } catch (error) {
        console.error('API Error:', error);
        resultText.textContent = `Error during analysis: ${error.message}. Please check your input and try again.`;
        outputDiv.style.borderColor = 'var(--color-accent-red)';
        outputDiv.style.boxShadow = '0 0 30px var(--shadow-hover)';
    }
}

// 2. Event Listener for Manual Input Form
manualForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop page reload

    // Create payload from form data
    const formData = new FormData(manualForm);
    const payload = {};
    for (const [key, value] of formData.entries()) {
        // Convert input values to float numbers for the model
        payload[key] = parseFloat(value);
    }

    // Send manual data to API
    sendDataToAPI(payload, '/identify-manual');
});

// 3. Event Listener for CSV Upload Form
csvForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop page reload

    const fileInput = document.getElementById('csv-file');
    if (fileInput.files.length === 0) {
        resultText.textContent = "Please select a CSV file to upload.";
        return;
    }

    // Note: CSV processing is complex and usually requires a backend.
    // This frontend logic is simplified for demonstration.
    // In a real application, you would typically upload the file to an API endpoint 
    // that handles file parsing and extraction.

    // Example of a file-based API call (uses FormData to send the actual file)
    const fileData = new FormData();
    fileData.append('csv_file', fileInput.files[0]);

    // Show loading state
    resultText.textContent = "Uploading and analyzing CSV file...";

    fetch(API_URL + '/identify-csv', {
        method: 'POST',
        body: fileData, // Send file data directly
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(error => {
            console.error('CSV API Error:', error);
            resultText.textContent = `Error during CSV upload/analysis: ${error.message}.`;
        });
});