// ==========================================
// HousePriceAI - Frontend JavaScript
// ==========================================

const API_URL = "http://127.0.0.1:8000/predict";

// Get HTML elements
const form = document.getElementById("predictionForm");

const areaInput = document.getElementById("area");
const bedroomsInput = document.getElementById("bedrooms");
const bathroomsInput = document.getElementById("bathrooms");
const ageInput = document.getElementById("age");

const resultBox = document.getElementById("result");
const predictionText = document.getElementById("prediction");
const errorBox = document.getElementById("error");

// Optional loading element
const loadingBox = document.getElementById("loading");


// ==========================================
// Form Submit
// ==========================================

form.addEventListener("submit", async function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Hide previous messages
    if (resultBox) {
        resultBox.classList.add("hidden");
    }

    if (errorBox) {
        errorBox.classList.add("hidden");
    }

    if (loadingBox) {
        loadingBox.classList.remove("hidden");
    }


    // ==========================================
    // Get input values
    // ==========================================

    const area = Number(areaInput.value);
    const bedrooms = Number(bedroomsInput.value);
    const bathrooms = Number(bathroomsInput.value);
    const age = Number(ageInput.value);


    // ==========================================
    // Validate inputs
    // ==========================================

    if (
        !Number.isFinite(area) ||
        !Number.isFinite(bedrooms) ||
        !Number.isFinite(bathrooms) ||
        !Number.isFinite(age)
    ) {
        showError("Please enter valid values in all fields.");
        hideLoading();
        return;
    }

    if (area <= 0) {
        showError("Area must be greater than 0.");
        hideLoading();
        return;
    }

    if (bedrooms <= 0) {
        showError("Bedrooms must be greater than 0.");
        hideLoading();
        return;
    }

    if (bathrooms <= 0) {
        showError("Bathrooms must be greater than 0.");
        hideLoading();
        return;
    }

    if (age < 0) {
        showError("House age cannot be negative.");
        hideLoading();
        return;
    }


    // ==========================================
    // Prepare API data
    // ==========================================

    const requestData = {
        area: area,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        age: age
    };

    console.log("Sending data to API:");
    console.log(requestData);


    // ==========================================
    // Call FastAPI
    // ==========================================

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify(requestData)
        });


        // ==========================================
        // Check HTTP response
        // ==========================================

        if (!response.ok) {

            let errorMessage = "Prediction request failed.";

            try {
                const errorData = await response.json();

                console.error("API Error:", errorData);

                if (errorData.detail) {
                    errorMessage = errorData.detail;
                }

            } catch (jsonError) {
                console.error("Could not read API error:", jsonError);
            }

            throw new Error(errorMessage);
        }


        // ==========================================
        // Read API response
        // ==========================================

        const resultData = await response.json();

        console.log("API Response:");
        console.log(resultData);


        // ==========================================
        // Get predicted price
        // ==========================================

        /*
         * Expected response:
         *
         * {
         *     "predicted_price": 1234567
         * }
         *
         * If your FastAPI response uses another
         * property name, change it here.
         */

        let predictedPrice = resultData.predicted_price;


        // Handle alternative response names
        if (predictedPrice === undefined) {
            predictedPrice = resultData.prediction;
        }

        if (predictedPrice === undefined) {
            predictedPrice = resultData.price;
        }


        // ==========================================
        // Validate prediction
        // ==========================================

        if (predictedPrice === undefined || predictedPrice === null) {

            console.error(
                "Prediction value not found in API response:",
                resultData
            );

            throw new Error(
                "Prediction received, but the price value was not found."
            );
        }


        // Convert to number
        predictedPrice = Number(predictedPrice);


        if (!Number.isFinite(predictedPrice)) {
            throw new Error("The API returned an invalid prediction.");
        }


        // ==========================================
        // Display prediction
        // ==========================================

        predictionText.textContent =
            "₹ " +
            predictedPrice.toLocaleString("en-IN", {
                maximumFractionDigits: 2
            });


        // Show result
        resultBox.classList.remove("hidden");

        console.log(
            "Predicted House Price:",
            predictedPrice
        );

    }

    // ==========================================
    // Handle errors
    // ==========================================

    catch (error) {

        console.error("Prediction Error:", error);

        showError(
            error.message ||
            "Unable to connect to the prediction API."
        );
    }

    // ==========================================
    // Hide loading
    // ==========================================

    finally {
        hideLoading();
    }
});


// ==========================================
// Show Error
// ==========================================

function showError(message) {

    if (!errorBox) {
        alert(message);
        return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}


// ==========================================
// Hide Loading
// ==========================================

function hideLoading() {

    if (loadingBox) {
        loadingBox.classList.add("hidden");
    }
}


// ==========================================
// Clear error when user starts typing
// ==========================================

[
    areaInput,
    bedroomsInput,
    bathroomsInput,
    ageInput
].forEach(function (input) {

    if (input) {

        input.addEventListener("input", function () {

            if (errorBox) {
                errorBox.classList.add("hidden");
            }

        });

    }

});


// ==========================================
// Check API when page loads
// ==========================================

async function checkAPIStatus() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/docs",
            {
                method: "GET"
            }
        );

        if (response.ok) {
            console.log("FastAPI backend is running.");
        }

    } catch (error) {

        console.warn(
            "FastAPI backend is not reachable.",
            error
        );

    }
}


// Run API status check
checkAPIStatus();