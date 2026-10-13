from pydantic import BaseModel, Field


class HouseFeatures(BaseModel):
    area: float = Field(..., gt=0, description="House area in square feet")
    bedrooms: int = Field(..., ge=1, le=20)
    bathrooms: int = Field(..., ge=1, le=20)
    age: int = Field(..., ge=0, le=200)


class PredictionResponse(BaseModel):
    predicted_price: float
