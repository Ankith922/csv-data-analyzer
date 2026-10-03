# DataLens - CSV Data Analyzer

A simple, modern web application to upload a CSV file and quickly understand the dataset through statistics, charts, and simple AI-generated insights.

## Features
- CSV Upload (drag & drop)
- Dataset summary & column metadata
- Missing values analysis
- Interactive charts (Bar, Line, Pie, Histogram)
- AI-generated insights (Optional)

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: FastAPI, Pandas, OpenAI

## Setup Instructions

### 1. Backend
Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up environment variables:
Create a `.env` file from `.env.example` and add your OpenAI API key (optional):
```bash
OPENAI_API_KEY=your_openai_api_key
```

Run the FastAPI server:
```bash
uvicorn main:app --reload
```

### 2. Frontend
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.
