from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn
from predict import predict

app = FastAPI()

# Allow CORS for localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartupData(BaseModel):
    Category: Optional[str] = "Internet of Things"
    Annual_Revenue_INR: Optional[float] = 0.0
    Funding_Raised_INR: Optional[float] = 0.0
    Team_Size: Optional[float] = 0.0
    Founding_Year: Optional[float] = 2020.0
    Location: Optional[str] = "San Francisco"
    Startup_Valuation_INR: Optional[float] = 0.0
    Revenue_Growth_Over_Time: Optional[float] = 0.0
    Funding_Sources: Optional[str] = ""
    Revenue_by_Product_Service: Optional[float] = 0.0

@app.post("/predict")
async def get_prediction(data: dict):
    # Log incoming request (optional)
    print("Received prediction request with data:", data)
    
    # Validation logic mirroring index.js
    required_fields = [
        'Category', 'Annual Revenue (INR)', 'Funding Raised (INR)', 'Team Size',
        'Location', 'Startup Valuation (INR)', 'Revenue Growth Over Time (Revenue VS Expenses)',
        'Funding Sources', 'Revenue by Product/Service'
    ]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise HTTPException(status_code=400, detail={"error": "Missing required fields", "details": missing_fields})
    
    numerical_fields = [
        'Annual Revenue (INR)', 'Funding Raised (INR)', 'Team Size',
        'Startup Valuation (INR)', 'Revenue Growth Over Time (Revenue VS Expenses)',
        'Revenue by Product/Service'
    ]
    invalid_fields = [field for field in numerical_fields if not isinstance(data.get(field), (int, float))]
    if invalid_fields:
        raise HTTPException(status_code=400, detail={"error": "Invalid numerical fields", "details": invalid_fields})
    
    # Call the prediction function directly
    result = predict(data)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result)
        
    return result

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
