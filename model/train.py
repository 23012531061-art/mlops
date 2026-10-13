from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LinearRegression


ROOT_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT_DIR / "models"
MODEL_PATH = MODEL_DIR / "house_price_model.pkl"


def create_dataset(n_samples: int = 300):
    """Create deterministic synthetic data for this learning project."""
    rng = np.random.default_rng(42)

    area = rng.integers(500, 4001, n_samples)
    bedrooms = rng.integers(1, 6, n_samples)
    bathrooms = rng.integers(1, 4, n_samples)
    age = rng.integers(0, 31, n_samples)

    noise = rng.normal(0, 20_000, n_samples)

    price = (
        area * 200
        + bedrooms * 25_000
        + bathrooms * 30_000
        - age * 5_000
        + noise
    )

    X = np.column_stack([area, bedrooms, bathrooms, age])
    y = price

    return X, y


def train_model():
    X, y = create_dataset()

    model = LinearRegression()
    model.fit(X, y)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    print(f"Model saved to: {MODEL_PATH}")
    print(f"Training samples: {len(X)}")
    print(f"R2 score on training data: {model.score(X, y):.4f}")


if __name__ == "__main__":
    train_model()
