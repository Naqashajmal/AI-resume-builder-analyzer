# AI Resume Creator & Analyzer

## 📋 Overview
A clean, modern, AI-powered web application that helps users create professional resumes and analyze existing ones using OpenAI GPT or Google Gemini AI.

## 🎯 Project Goals
- Create professional resumes using AI
- Analyze resumes for strengths, weaknesses, and improvements
- Support multiple AI providers (OpenAI & Gemini)
- Download resumes as PDF
- Secure API key management
- Simple, beautiful, responsive design

## 🏗️ Project Architecture

### Tech Stack
- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
- **Backend**: Node.js + Express
- **AI Integration**: OpenAI GPT-3.5 & Google Gemini
- **PDF Generation**: html2pdf.js library
- **Deployment**: Replit

### Folder Structure
```
/project-root
  ├── index.html              # Main HTML page
  ├── server.js               # Node.js backend server
  ├── package.json            # Node.js dependencies
  ├── replit.md              # This documentation file
  └── public/
      ├── css/
      │   └── style.css       # All styling
      └── js/
          └── app.js          # Frontend logic
```

## 🔐 Security & API Keys

### Required Environment Variables
This application requires AI API keys to function. Keys are stored securely as **Replit Secrets** (environment variables), never in the browser.

**Required Secrets:**
- `OPENAI_API_KEY` - For OpenAI GPT-3.5 integration
- `GEMINI_API_KEY` - For Google Gemini integration

### How to Add API Keys (Replit Secrets)
1. Click the **🔒 Secrets** tab in the Replit Tools panel
2. Click **+ New Secret**
3. For OpenAI:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (get it from https://platform.openai.com/api-keys)
4. For Gemini:
   - Key: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key (get it from https://makersuite.google.com/app/apikey)
5. Click **Save**
6. Restart the server to apply changes

**Security Note:** API keys are NEVER stored in browser localStorage or transmitted from the frontend. They are managed server-side only.

## ✨ Features

### 1. Resume Creator
- Input personal information (name, contact, education, experience, skills, achievements)
- AI generates professionally formatted resume
- Download as PDF
- Clean, formatted output

### 2. Resume Analyzer
- Paste existing resume text
- AI analyzes and provides:
  - Extracted skills
  - Strengths
  - Weaknesses
  - Improvement suggestions
  - Suggested job titles
- Results displayed in organized sections

### 3. Settings
- Switch between OpenAI and Gemini
- View API configuration status
- Model preference saved locally

### 4. Design Features
- Modern, gradient-based design
- Smooth animations and transitions
- Fully responsive (mobile-friendly)
- Loading states with spinner
- Error handling with user-friendly messages

## 🚀 How to Run

### Development
1. Make sure API keys are configured in Replit Secrets
2. The server runs automatically on port 5000
3. Click the webview to see the app
4. Select your AI model in Settings
5. Start creating or analyzing resumes!

### Testing Locally
```bash
node server.js
```
Then open http://localhost:5000 in your browser.

## 📝 Recent Changes

### October 9, 2025 - Security Fixes
- **CRITICAL**: Moved API key storage from client-side localStorage to server-side environment variables
- Removed API key transmission in frontend requests
- Added `/api/status` endpoint to check which AI providers are configured
- Updated Settings UI with clear instructions for Replit Secrets
- Added API status indicators (✅/❌) showing configuration state

### October 9, 2025 - Initial Implementation
- Created complete frontend with HTML/CSS/JS
- Built Node.js backend with Express
- Integrated OpenAI GPT-3.5 API
- Integrated Google Gemini API
- Added PDF download functionality
- Implemented tabbed interface
- Added responsive design
- Created loading states and error handling

## 🎨 User Preferences
- **Creator**: Naqash Malik
- **Design Style**: Clean, modern, professional with purple gradient theme
- **Technology Preference**: Vanilla JavaScript (no frameworks)
- **Educational Approach**: Code is heavily commented for learning

## 🔄 API Endpoints

### Backend Routes
- `GET /` - Serves main HTML page
- `GET /api/status` - Returns API configuration status
- `POST /api/openai` - Calls OpenAI GPT with prompt
- `POST /api/gemini` - Calls Google Gemini with prompt

### Request Format
```javascript
POST /api/openai or /api/gemini
{
  "prompt": "Your AI prompt here"
}
```

### Response Format
```javascript
{
  "result": "AI response text"
}
```

## 🐛 Troubleshooting

### API Not Working
1. Check that API keys are configured in Replit Secrets
2. Verify the correct AI model is selected in Settings
3. Check the API status indicators (should show ✅)
4. Restart the server after adding new secrets

### UI Not Loading
1. Make sure the server is running (check workflow status)
2. Clear browser cache and refresh
3. Check browser console for errors

### PDF Download Not Working
1. Ensure html2pdf.js library is loaded (check browser console)
2. Try generating the resume first before downloading
3. Check browser's download settings

## 📦 Dependencies

### Backend (Node.js)
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - JSON request parsing

### Frontend (CDN)
- `html2pdf.js` - PDF generation library
- Google Fonts (Inter family)

## 🎯 Future Enhancements
- Rate limiting for API endpoints
- User authentication
- Resume templates
- Multi-language support
- Resume history/saving
- More AI providers

## 📄 License & Credits
Made with ❤️ by Naqash Malik

Built as an educational project demonstrating:
- Clean vanilla JavaScript
- Secure API integration
- Modern UI/UX design
- Full-stack development basics
