# Lasso Grant Manager

A grant management system that helps farmers find and categorize funding opportunities using AI-powered tagging.

## 1. Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python 3.8+** (3.11+ recommended) - [Download here](https://www.python.org/downloads/)
- **OpenAI API key** (optional, for AI-powered tagging)

### Installation Steps

**Windows:**
```cmd
# 1. Clone/download the project
# Navigate to the project directory

# 2. Install Node.js dependencies
npm install

# 3. Set up Python backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 4. Set up environment
copy env.example .env
# Edit .env and add your OpenAI API key (optional)

# 5. Start the application
cd ..
npm start
```

**Mac/Linux:**
```bash
# 1. Clone/download the project
# Navigate to the project directory

# 2. Install Node.js dependencies
npm install

# 3. Set up Python backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Set up environment
cp env.example .env
# Edit .env and add your OpenAI API key (optional)

# 5. Start the application
cd ..
npm start
```

This starts both backend (http://localhost:5000) and frontend (http://localhost:3000).

### Alternative: Manual Start

If the npm scripts don't work, you can start each service manually:

**Terminal 1 (Backend):**
```cmd
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
python app.py
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm start
```

## 2. Features

- **AI Tagging**: Automatically tags grants using OpenAI
- **Content Extraction**: Reads grant websites and PDFs for better tagging
- **Smart Search**: Filter grants by tags or search text
- **Modern UI**: Clean interface built with React and TailwindCSS
- **Fallback System**: Works even without AI (uses keyword matching)

## 3. How It Works

### Architecture
- **Frontend**: React with TypeScript for the user interface
- **Backend**: Flask API that processes grants and handles AI tagging
- **AI System**: Uses OpenAI to intelligently tag grants, with keyword fallback

### Tagging Process
1. **Input**: Grant name, description, and optional URLs
2. **Content Extraction**: Reads additional content from provided URLs
3. **AI Analysis**: OpenAI analyzes the content and selects relevant tags
4. **Fallback**: If AI fails, uses keyword matching
5. **Output**: Grants with 3-7 relevant tags from 80+ predefined options

## 4. Tech Stack

**Frontend**: React, TypeScript, TailwindCSS  
**Backend**: Python, Flask, OpenAI API  
**Content Processing**: BeautifulSoup4, PyPDF2

## 5. How to Use

### Adding Grants
1. Go to "Add Grants" tab
2. Fill in grant details (name, description, optional URLs)
3. Click "Add Grants" - AI will automatically tag them
4. View results in "View Grants" tab

### Viewing Grants
1. Go to "View Grants" tab
2. Use search bar to find grants by name/description
3. Click tags to filter by specific categories
4. Use "Clear Filters" to reset

## 6. Setup Details

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- OpenAI API key (optional)

### Manual Setup (Step by Step)

**Step 1: Install Prerequisites**
- Download and install [Node.js](https://nodejs.org/) (v16+)
- Download and install [Python](https://www.python.org/downloads/) (3.8+)
- During Python installation, make sure to check "Add Python to PATH"

**Step 2: Backend Setup**

**Windows:**
```cmd
# Navigate to project directory
cd "path\to\Lasso take-home"

# Create and activate virtual environment
cd backend
python -m venv venv
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment file
copy env.example .env
# Edit .env file and add: OPENAI_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
# Navigate to project directory
cd /path/to/Lasso\ take-home

# Create and activate virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment file
cp env.example .env
# Edit .env file and add: OPENAI_API_KEY=your_api_key_here
```

**Step 3: Frontend Setup**
```cmd
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

**Step 4: Start the Application**

**Option A: Using npm scripts (recommended)**
```cmd
# From project root directory
npm start
```

**Option B: Manual start (two terminals)**

**Terminal 1 (Backend):**
```cmd
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
python app.py
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm start
```

**Step 5: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 7. Available Tags

The system uses 80+ predefined tags including:
- **Agriculture**: `agriculture`, `dairy`, `livestock`, `crops`
- **Education**: `education`, `training`, `research`
- **Infrastructure**: `equipment`, `technology`, `water`
- **Eligibility**: `farmer`, `beginning-farmer`, `nonprofit`
- **Location**: `rural`, `wi`, `va`, `co`

## 8. Troubleshooting

### Common Issues

**Python not recognized (Windows):**
```cmd
# If you get "python is not recognized" error:
# 1. Make sure Python is installed and added to PATH
# 2. Restart PowerShell/Command Prompt after Python installation
# 3. Try using 'py' instead of 'python':
py -m venv venv
py app.py
```

**PowerShell execution policy (Windows):**
```powershell
# If you get execution policy errors:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Python 3.14 compatibility issues:**
- The project has been updated to use compatible package versions
- If you encounter Pydantic warnings, they can be safely ignored
- The application will work correctly despite the warnings

**Socket errors on Windows:**
- The Flask app is configured to use `127.0.0.1` instead of `0.0.0.0` to avoid Windows socket issues
- If you still get socket errors, try running as administrator

**CORS errors:**
- Make sure Flask backend is running on port 5000
- Check that the frontend is trying to connect to `http://localhost:5000`

**OpenAI errors:**
- Check your API key in `backend/.env`
- Make sure the key is valid and has sufficient credits
- The system works without OpenAI using keyword-based tagging

**Build errors:**
- Run `npm install` in the frontend directory
- Make sure Node.js version is 16 or higher
- Try deleting `node_modules` and running `npm install` again

### Without OpenAI API
The system works perfectly with keyword-based tagging - just start without adding an API key to `.env`.

### Getting Help
If you encounter other issues:
1. Check that all prerequisites are installed correctly
2. Make sure you're in the correct directory when running commands
3. Verify that virtual environment is activated (you should see `(venv)` in your terminal prompt)
4. Check the terminal output for specific error messages
