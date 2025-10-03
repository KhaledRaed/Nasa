const manualForm = document.getElementById('manualIdentifyForm');
const csvForm = document.getElementById('csvIdentifyForm');
const outputDiv = document.getElementById('identificationOutput');
const resultText = document.getElementById('result-text');
const fileInput = document.getElementById('csv-file');

// Set your FastAPI backend URLs
const API_URL = 'http://127.0.0.1:8000/predict';
const CSV_API_URL = 'http://127.0.0.1:8000/predict-csv';

// Add file input change listener to show selected file
fileInput.addEventListener('change', function (e) {
    const fileName = e.target.files[0]?.name;
    // Get the visible label element for the file input
    const fileLabel = document.querySelector('label[for="csv-file"]');
    
    // Check if a file was selected AND if the label was found
    if (fileName && fileLabel) {
        // Find or create a display element for the filename
        let fileNameDisplay = document.getElementById('file-name-display');
        if (!fileNameDisplay) {
            fileNameDisplay = document.createElement('p');
            fileNameDisplay.id = 'file-name-display';
            fileNameDisplay.style.marginTop = '10px';
            fileNameDisplay.style.color = 'var(--color-accent-blue)';
            fileNameDisplay.style.fontSize = '0.9rem';

            // *** NEW FIX IMPLEMENTED HERE: Insert the element immediately after the visible label ***
            fileLabel.insertAdjacentElement("afterend", fileNameDisplay);
        }
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
    } else if (!fileName) {
        // If the user cancels the file selection, clear the display
        const fileNameDisplay = document.getElementById('file-name-display');
        if (fileNameDisplay) {
            fileNameDisplay.remove();
        }
    }
});

// Function to display results
function displayResult(result) {
    if (result.classification === "Error" || result.error) {
        outputDiv.style.borderColor = 'var(--color-accent-red)';
        outputDiv.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.7)';
        resultText.innerHTML = `
            <p class="output-title" style="color: var(--color-accent-red); font-size: 2rem;">
                Error Processing CSV
            </p>
            <p style="color: #ff6b6b; margin-top: 10px;">
                ${result.error || 'Unknown error occurred'}
            </p>
            <p style="margin-top: 15px; font-size: 0.9rem;">
                Please check your CSV format and try again.
            </p>
        `;
        return;
    }

    outputDiv.style.borderColor = 'var(--color-accent-blue)';
    outputDiv.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.7)';
    resultText.innerHTML = `
        <p class="output-title" style="color: var(--color-accent-blue); font-size: 2rem;">
            Classification: <span style="color: var(--color-accent-red);">${result.classification || 'Unknown'}</span>
        </p>
        <p>Confidence Score: ${result.confidence_score || 'N/A'}</p>
        <p style="margin-top: 15px;">
            The AI model has processed the data. 'Candidate' suggests a potential exoplanet, 'Confirmed' means it meets all criteria.
        </p>
    `;
}

// Function to display error
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
        displayResult(data);
    } catch (error) {
        console.error('API Error:', error);
        displayError(`Error during analysis: ${error.message}`);
    }
}

// Manual Form Submission
manualForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(manualForm);
    const payload = {};

    for (const [key, value] of formData.entries()) {
        payload[key] = parseFloat(value);
    }

    sendManualData(payload);
});

// CSV Upload Form
csvForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!fileInput.files || fileInput.files.length === 0) {
        displayError("Please select a CSV file to upload.");
        return;
    }

    const file = fileInput.files[0];
    if (!file.name.endsWith('.csv')) {
        displayError("Please upload a valid CSV file.");
        return;
    }

    const fileData = new FormData();
    fileData.append('file', file);

    resultText.textContent = "Uploading and analyzing CSV file...";
    outputDiv.style.borderColor = '#555';
    outputDiv.style.boxShadow = 'none';

    fetch(CSV_API_URL, {
        method: 'POST',
        body: fileData
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            displayResult(data);

            // Optional: If you want the filename to clear after success, uncomment this block:
            // fileInput.value = '';
            // const fileNameDisplay = document.getElementById('file-name-display');
            // if (fileNameDisplay) fileNameDisplay.remove();
        })
        .catch(error => {
            console.error('CSV API Error:', error);
            displayError(`Error during CSV upload/analysis: ${error.message}`);
        });
});