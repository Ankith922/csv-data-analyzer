from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from analyzer import analyze_csv
from ai_service import generate_insights

load_dotenv()

app = FastAPI(title="DataLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InsightsRequest(BaseModel):
    summary: dict

@app.post("/api/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
        
    try:
        contents = await file.read()
        
        # Max file size 10MB
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
            
        result = analyze_csv(contents)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to read this CSV. Please check that the file contains valid CSV data.")

@app.post("/api/insights")
async def insights_endpoint(request: InsightsRequest):
    try:
        # Pass a subset of data to avoid huge token usage
        summary_subset = {
            "rows": request.summary.get("rows"),
            "columns": request.summary.get("columns"),
            "missing_values": request.summary.get("missing_values"),
            "duplicate_rows": request.summary.get("duplicate_rows"),
            "columns_info": request.summary.get("columns_info"),
            "statistics": request.summary.get("statistics"),
        }
        insights = await generate_insights(summary_subset)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate AI insights.")
