<div align="center">

# 🛡️ CardioShield
### Heart Disease Risk Analyzer & Diagnostics Platform

[![Python Version](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-v1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A premium, high-fidelity clinical diagnostics platform powered by a trained <b>K-Nearest Neighbors (KNN)</b> classifier. Predict patient cardiac risk profiles instantly through a modern responsive dark-mode dashboard.
</p>

[✨ Key Features](#-key-features) • [📂 Architecture](#-project-architecture) • [📊 ML Pipeline](#-machine-learning-pipeline) • [🚀 Quick Start](#-getting-started) • [📡 API Documentation](#-api-endpoints)

</div>

---

> [!IMPORTANT]
> **Clinical Notice:** CardioShield is designed as a machine learning diagnostic support tool. Predictions are based on probabilistic evaluations from trained statistical models. Please consult qualified medical professionals for formal clinical diagnoses.

---

## ✨ Key Features

*   **🎨 Premium Glassmorphism Aesthetics:** Clean, high-contrast dark theme utilizing `backdrop-filter: blur(24px)` with high-contrast color tokens, curated typography, and an animated heart logo with drop-shadow pulse states.
*   **⚡ Real-Time Predictive Gauge:** An SVG-based dynamic radial gauge that smoothly transitions color parameters (Cyan $\rightarrow$ Amber $\rightarrow$ Crimson) reflecting the calculated patient risk index.
*   **🎯 Input Mapping & Scaling Pipeline:** Automatic scaling pipeline utilizing a pre-fit `StandardScaler` to handle multi-modal features without raw categorical exposure.
*   **🛡️ Robust REST API Layer:** Fast, low-overhead endpoint parsing built on FastAPI with automatic serialization error catching through Pydantic data schemas.

---

## 📂 Project Architecture

```filepath
🛡️ CardioShield/
├── main.py                     # 🚀 FastAPI server & prediction routes
├── requirements.txt            # 📦 Application dependencies
├── model_training/             # 🧪 Model Training & EDA
│   ├── heart.ipynb             # Jupyter Notebook containing dataset exploration and training
│   └── files/
│       └── heart.csv           # Raw Kaggle Heart Failure dataset (918 records)
├── models/                     # 💾 Production serialized artifacts
│   ├── KNN_HeartDiease.pkl     # Finalized K-Nearest Neighbors Classifier model
│   ├── Scalar_HeartDiease.pkl  # Serialized StandardScaler pipeline scaling object
│   └── Columns_HeartDiease.pkl # Expected input dataframe column sequences
└── static/                     # 🌐 Frontend web assets
    ├── index.html              # Core client dashboard structure
    ├── favicon.png             # Custom heart shield favicon asset
    ├── css/
    │   └── style.css           # Custom glassmorphism variables, utility classes, and keyframes
    └── js/
        └── script.js           # API request controller, encoder, and reactive gauge transitions
```

---

## 📊 Machine Learning Pipeline

The machine learning core uses clinical diagnostic observations from the **Heart Failure Prediction Dataset** (918 patient observations). 

### 1. Diagnostic Indicators Mapping

| Indicator Label | Variable Type | Expected Range | Description |
| :--- | :---: | :---: | :--- |
| **Age** | Numerical | $1 \rightarrow 120$ yrs | Patient Age |
| **Resting Blood Pressure** | Numerical | $50 \rightarrow 250$ mmHg | Blood pressure on hospital admission |
| **Serum Cholesterol** | Numerical | $50 \rightarrow 600$ mg/dl | Patient serum cholesterol metrics |
| **Fasting Blood Sugar** | Categorical | $0$ ( $\le 120$ ) or $1$ ( $> 120$ ) | Fasting blood glucose comparison threshold |
| **Max Heart Rate** | Numerical | $50 \rightarrow 220$ bpm | Maximum heart rate achieved during stress test |
| **ST Depression (Oldpeak)**| Numerical | $-5.0 \rightarrow 10.0$ | ST depression induced by exercise relative to rest |
| **Categorical Inputs** | One-Hot | Multi-Class | Sex, Chest Pain (TA, ATA, NAP, ASY), ECG, Angina, ST Slope |

### 2. Model Performance Summary
Multiple machine learning classifiers were evaluated in [heart.ipynb](file:///c:/Users/kanko/OneDrive/Desktop/VS%20Code/Test2/model_training/heart.ipynb) using a standard 80/20 train-test split:

```
[Accuracy Evaluation Results]
├── 🟩 K-Nearest Neighbors (Selected) : Accuracy = 84.78%  |  F1-Score = 86.54%
├── 🟦 Logistic Regression             : Accuracy = 84.78%  |  F1-Score = 86.54%
├── 🟨 Support Vector Machine (SVM)   : Accuracy = 84.24%  |  F1-Score = 86.38%
├── 🟧 Gaussian Naive Bayes            : Accuracy = 83.70%  |  F1-Score = 85.44%
└── 🟥 Decision Tree                   : Accuracy = 76.63%  |  F1-Score = 78.61%
```

> [!TIP]
> The **K-Nearest Neighbors (KNN)** model was selected due to its lightweight inference footprint, high non-linear decision boundary consistency on scaled medical data, and excellent recall rates.

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have **Python 3.8+** installed.

### ⚙️ Installation & Setup

1.  **Clone / Open Project Directory**:
    ```bash
    cd "c:/Users/kanko/OneDrive/Desktop/VS Code/Test2"
    ```

2.  **Initialize Virtual Environment**:
    *   **Windows (PowerShell):**
        ```powershell
        python -m venv venv
        .\venv\Scripts\activate
        ```
    *   **macOS / Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Install Required Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run FastAPI Production Web Server**:
    ```bash
    uvicorn main:app --reload
    ```

After starting up, open the responsive UI dashboard at:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 📡 API Endpoints

### 1. Renders Client Web Interface
*   **Method & Route:** `GET /`
*   **Response:** Renders `static/index.html` via FastAPI `FileResponse`.

### 2. Predict Cardiovascular Disease Risk
*   **Method & Route:** `POST /predict`
*   **Payload Schema (`PredictRequest`):**
```json
{
  "Age": 54.0,
  "RestingBP": 130.0,
  "Cholesterol": 220.0,
  "FastingBS": 0.0,
  "MaxHR": 140.0,
  "Oldpeak": 1.0,
  "Sex_M": 1.0,
  "ChestPainType_ATA": 0.0,
  "ChestPainType_NAP": 0.0,
  "RestingECG_Normal": 1.0,
  "RestingECG_ST": 0.0,
  "ExerciseAngina_Y": 0.0,
  "ST_Slope_Flat": 1.0,
  "ST_Slope_Up": 0.0
}
```

*   **API Response Format:**
```json
{
  "prediction": 0,
  "probability": 20.0,
  "message": "No heart disease detected"
}
```

---

## 💻 Programmatic API Usage Example

Here is how you can invoke the predictive engine in Python using the `requests` library:

```python
import requests

url = "http://127.0.0.1:8000/predict"
payload = {
    "Age": 58.0,
    "RestingBP": 136.0,
    "Cholesterol": 248.0,
    "FastingBS": 0.0,
    "MaxHR": 122.0,
    "Oldpeak": 1.8,
    "Sex_M": 1.0,
    "ChestPainType_ATA": 0.0,
    "ChestPainType_NAP": 0.0,
    "RestingECG_Normal": 1.0,
    "RestingECG_ST": 0.0,
    "ExerciseAngina_Y": 1.0,
    "ST_Slope_Flat": 1.0,
    "ST_Slope_Up": 0.0
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Risk Index Probability: {data['probability']}%")
print(f"Diagnostics Assessment: {data['message']}")
```

---

## 🛠️ Built With

*   **FastAPI** - High performance, asynchronous backend web routing.
*   **scikit-learn** - Machine learning modeling, pipelines, and preprocessing scalars.
*   **Pydantic** - Python data parsing and type validation.
*   **Pandas & NumPy** - Analytical mathematical frame conversions.
*   **Vanilla HTML5 / CSS3 / JavaScript** - Smooth, zero-dependency modern client interface.
