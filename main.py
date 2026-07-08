import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="Heart Disease Prediction API")

# Load model, scalar, and columns
knn_model = joblib.load('models/KNN_HeartDiease.pkl')
scaler = joblib.load('models/Scalar_HeartDiease.pkl')
columns = joblib.load('models/Columns_HeartDiease.pkl')

# Pydantic model for request validation
class PredictRequest(BaseModel):
    Age: float
    RestingBP: float
    Cholesterol: float
    FastingBS: float
    MaxHR: float
    Oldpeak: float
    Sex_M: float
    ChestPainType_ATA: float
    ChestPainType_NAP: float
    RestingECG_Normal: float
    RestingECG_ST: float
    ExerciseAngina_Y: float
    ST_Slope_Flat: float
    ST_Slope_Up: float

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/predict")
def predict(request: PredictRequest):
    # Convert input data to a DataFrame
    input_data = pd.DataFrame([request.model_dump()])
    
    # Ensure columns are in the exact same order as during training
    input_data = input_data[columns]
    
    # Scale only the numerical features that the scaler was fit on
    num_cols = list(scaler.feature_names_in_)
    input_data[num_cols] = scaler.transform(input_data[num_cols])
    
    # Predict using the KNN model
    prediction = knn_model.predict(input_data)
    proba = knn_model.predict_proba(input_data)
    
    result = int(prediction[0])
    risk_percentage = round(float(proba[0][1]) * 100, 1)
    
    return {
        "prediction": result,
        "probability": risk_percentage,
        "message": "Heart disease detected" if result == 1 else "No heart disease detected"
    }

@app.get("/")
def read_root():
    return FileResponse("static/index.html")
