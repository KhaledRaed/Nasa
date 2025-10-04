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
    const fileLabel = document.querySelector('label[for="csv-file"]');

    if (fileName && fileLabel) {
        let fileNameDisplay = document.getElementById('file-name-display');
        if (!fileNameDisplay) {
            fileNameDisplay = document.createElement('p');
            fileNameDisplay.id = 'file-name-display';
            fileNameDisplay.style.marginTop = '10px';
            fileNameDisplay.style.color = 'var(--color-accent-blue)';
            fileNameDisplay.style.fontSize = '0.9rem';
            fileLabel.insertAdjacentElement("afterend", fileNameDisplay);
        }
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
    } else if (!fileName) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (fileNameDisplay) {
            fileNameDisplay.remove();
        }
    }
});

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

    for (const [key, value] of formData.entries()) {
        payload[key] = parseFloat(value);
    }

    const result = await sendManualData(payload);
    redirectToOutput(result, payload);
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

    const reader = new FileReader();

    reader.onload = function (event) {
        const csvText = event.target.result;
        const rows = csvText.trim().split("\n").map(r => r.split(","));

        if (rows.length < 2) {
            displayError("CSV must have at least 2 rows (headers + data).");
            return;
        }

        const values = rows[1]; // الصف الثاني

        const features = [
            "koi_period",
            "koi_time0bk",
            "koi_eccen",
            "koi_impact",
            "koi_duration",
            "koi_depth",
            "koi_ror",
            "koi_srho",
            "koi_prad",
            "koi_sma",
            "koi_incl",
            "koi_teq",
            "koi_insol",
            "koi_dor"
        ];

        const payload = {};
        features.forEach((f, i) => {
            payload[f] = parseFloat(values[i]);
        });

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
                redirectToOutput(data, payload);
            })
            .catch(error => {
                console.error('CSV API Error:', error);
                displayError(`Error during CSV upload/analysis: ${error.message}`);
            });
    };

    reader.readAsText(file);
});