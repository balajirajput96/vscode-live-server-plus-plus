"""
ML Deployment Platform - FastAPI Backend
Complete production-ready ML model deployment API
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pickle
import joblib
import json
import os
import uuid
from datetime import datetime
import pandas as pd
import numpy as np
from pathlib import Path

app = FastAPI(
    title="ML Deployment Platform API",
    description="Production-ready ML model deployment with monitoring and analytics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class PredictionRequest(BaseModel):
    model_id: str
    features: List[float]
    metadata: Optional[Dict[str, Any]] = {}

class BatchPredictionRequest(BaseModel):
    model_id: str
    data: List[List[float]]
    metadata: Optional[Dict[str, Any]] = {}

class ModelInfo(BaseModel):
    name: str
    version: str
    description: Optional[str] = ""
    model_type: Optional[str] = "sklearn"

# Global storage
MODELS_DIR = Path("models")
MODELS_DIR.mkdir(exist_ok=True)

PREDICTIONS_DIR = Path("predictions")
PREDICTIONS_DIR.mkdir(exist_ok=True)

models_registry = {}
prediction_history = []

# Helper functions
def load_model(model_id: str):
    """Load model from disk"""
    model_path = MODELS_DIR / f"{model_id}.pkl"
    if not model_path.exists():
        raise HTTPException(status_code=404, detail="Model not found")
    
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

def save_prediction(prediction_data: dict):
    """Save prediction to history"""
    prediction_history.append(prediction_data)
    
    # Save to disk
    history_file = PREDICTIONS_DIR / "history.json"
    with open(history_file, 'w') as f:
        json.dump(prediction_history[-1000:], f, indent=2)  # Keep last 1000

# API Endpoints

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "ML Deployment Platform API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "models": "/models",
            "predict": "/predict",
            "batch_predict": "/predict/batch",
            "upload": "/models/upload",
            "stats": "/stats"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": len(models_registry),
        "predictions_made": len(prediction_history)
    }

@app.get("/models")
async def list_models():
    """List all deployed models"""
    models_list = []
    
    for model_id, info in models_registry.items():
        model_info = {
            "id": model_id,
            "name": info.get("name", "Unknown"),
            "version": info.get("version", "1.0"),
            "description": info.get("description", ""),
            "uploaded_at": info.get("uploaded_at", ""),
            "predictions": info.get("prediction_count", 0),
            "status": "active"
        }
        models_list.append(model_info)
    
    return {
        "total": len(models_list),
        "models": models_list
    }

@app.get("/models/{model_id}")
async def get_model_info(model_id: str):
    """Get detailed info about a specific model"""
    if model_id not in models_registry:
        raise HTTPException(status_code=404, detail="Model not found")
    
    info = models_registry[model_id]
    return {
        "id": model_id,
        **info,
        "status": "active"
    }

@app.post("/models/upload")
async def upload_model(
    file: UploadFile = File(...),
    name: str = "ML Model",
    version: str = "1.0",
    description: str = "",
    model_type: str = "sklearn"
):
    """Upload and deploy a new ML model"""
    
    # Validate file type
    if not file.filename.endswith(('.pkl', '.joblib', '.pickle')):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only .pkl, .joblib, or .pickle files allowed"
        )
    
    # Generate unique model ID
    model_id = str(uuid.uuid4())
    
    # Save model file
    model_path = MODELS_DIR / f"{model_id}.pkl"
    
    try:
        contents = await file.read()
        with open(model_path, 'wb') as f:
            f.write(contents)
        
        # Test load the model
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Register model
        models_registry[model_id] = {
            "name": name,
            "version": version,
            "description": description,
            "model_type": model_type,
            "uploaded_at": datetime.now().isoformat(),
            "file_name": file.filename,
            "prediction_count": 0
        }
        
        return {
            "success": True,
            "model_id": model_id,
            "message": "Model uploaded and deployed successfully",
            "details": models_registry[model_id]
        }
        
    except Exception as e:
        # Clean up on error
        if model_path.exists():
            model_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error uploading model: {str(e)}")

@app.post("/predict")
async def predict(request: PredictionRequest):
    """Make a single prediction"""
    
    # Load model
    model = load_model(request.model_id)
    
    try:
        # Make prediction
        features = np.array(request.features).reshape(1, -1)
        prediction = model.predict(features)
        
        # Get confidence scores if available
        confidence = None
        if hasattr(model, 'predict_proba'):
            try:
                proba = model.predict_proba(features)
                confidence = {
                    "probabilities": proba[0].tolist(),
                    "max_confidence": float(np.max(proba))
                }
            except:
                pass
        
        # Create response
        response = {
            "model_id": request.model_id,
            "prediction": prediction[0].tolist() if hasattr(prediction[0], 'tolist') else float(prediction[0]),
            "confidence": confidence,
            "timestamp": datetime.now().isoformat(),
            "metadata": request.metadata
        }
        
        # Save to history
        save_prediction(response)
        
        # Update model stats
        if request.model_id in models_registry:
            models_registry[request.model_id]["prediction_count"] = \
                models_registry[request.model_id].get("prediction_count", 0) + 1
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/batch")
async def batch_predict(request: BatchPredictionRequest):
    """Make batch predictions"""
    
    # Load model
    model = load_model(request.model_id)
    
    try:
        # Make predictions
        features = np.array(request.data)
        predictions = model.predict(features)
        
        # Get confidence scores if available
        confidences = None
        if hasattr(model, 'predict_proba'):
            try:
                probas = model.predict_proba(features)
                confidences = [
                    {
                        "probabilities": proba.tolist(),
                        "max_confidence": float(np.max(proba))
                    }
                    for proba in probas
                ]
            except:
                pass
        
        # Create response
        response = {
            "model_id": request.model_id,
            "predictions": predictions.tolist() if hasattr(predictions, 'tolist') else list(predictions),
            "confidences": confidences,
            "count": len(predictions),
            "timestamp": datetime.now().isoformat(),
            "metadata": request.metadata
        }
        
        # Save to history
        save_prediction({
            **response,
            "type": "batch",
            "batch_size": len(request.data)
        })
        
        # Update model stats
        if request.model_id in models_registry:
            models_registry[request.model_id]["prediction_count"] = \
                models_registry[request.model_id].get("prediction_count", 0) + len(request.data)
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@app.delete("/models/{model_id}")
async def delete_model(model_id: str):
    """Delete a deployed model"""
    if model_id not in models_registry:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Remove from registry
    model_info = models_registry.pop(model_id)
    
    # Delete model file
    model_path = MODELS_DIR / f"{model_id}.pkl"
    if model_path.exists():
        model_path.unlink()
    
    return {
        "success": True,
        "message": f"Model {model_info['name']} deleted successfully"
    }

@app.get("/stats")
async def get_statistics():
    """Get platform statistics and analytics"""
    
    # Calculate stats
    total_predictions = len(prediction_history)
    total_models = len(models_registry)
    
    # Recent predictions
    recent_predictions = prediction_history[-10:] if prediction_history else []
    
    # Model usage stats
    model_usage = {}
    for pred in prediction_history:
        model_id = pred.get("model_id", "unknown")
        model_usage[model_id] = model_usage.get(model_id, 0) + 1
    
    return {
        "total_models": total_models,
        "total_predictions": total_predictions,
        "active_models": len([m for m in models_registry.values() if m.get("prediction_count", 0) > 0]),
        "model_usage": model_usage,
        "recent_predictions": recent_predictions,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/history")
async def get_prediction_history(limit: int = 100):
    """Get prediction history"""
    return {
        "total": len(prediction_history),
        "limit": limit,
        "history": prediction_history[-limit:]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
