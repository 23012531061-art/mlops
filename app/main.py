from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import HouseFeatures, PredictionResponse


# ==========================================
# Project Paths
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "house_price_model.pkl"


# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI(
    title="House Price Prediction API",
    description="A simple ML inference API built with FastAPI.",
    version="1.0.0",
)


# ==========================================
# CORS Configuration
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Load Machine Learning Model
# ==========================================

try:
    model = joblib.load(MODEL_PATH)

except Exception as exc:
    raise RuntimeError(
        f"Could not load model from {MODEL_PATH}: {exc}"
    ) from exc


# ==========================================
# Root Endpoint
# ==========================================

@app.get("/")
def root():
    return {
        "message": "House Price Prediction API",
        "status": "running",
    }


# ==========================================
# Health Check Endpoint
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# Prediction Endpoint
# ==========================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: HouseFeatures):

    try:

        # --------------------------------------
        # Prepare input features
        # --------------------------------------

        features = np.array(
            [[
                data.area,
                data.bedrooms,
                data.bathrooms,
                data.age
            ]],
            dtype=float,
        )

        # --------------------------------------
        # Make prediction
        # --------------------------------------

        prediction = model.predict(features)[0]

        # --------------------------------------
        # Return prediction
        # --------------------------------------

        return {
            "predicted_price": float(prediction)
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc