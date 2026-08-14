@echo off
echo Running knowledge ingestion script...
cd /d "%~dp0"
backend\.venv\Scripts\python.exe scripts\ingest_knowledge.py

echo.
echo Starting FastAPI backend...
cd backend
.venv\Scripts\uvicorn.exe app.main:app --reload
