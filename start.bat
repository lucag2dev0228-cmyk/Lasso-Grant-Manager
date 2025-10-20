@echo off
echo Starting Lasso Grant Manager...

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Setting up Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo Please create backend\.env file with your OpenAI API key:
    echo    OPENAI_API_KEY=your_openai_api_key_here
    echo    Copy from backend\env.example
    pause
    exit /b 1
)

REM Start backend in background
echo Starting Flask backend...
cd backend
start /b cmd /c "call venv\Scripts\activate && python app.py"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting React frontend...
cd frontend
start /b cmd /c "npm start"
cd ..

echo.
echo Services started!
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo Press any key to stop all services
pause >nul

REM Cleanup - kill background processes
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
