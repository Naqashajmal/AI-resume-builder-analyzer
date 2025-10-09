// ======================================
// AI Resume Creator & Analyzer - Backend Server
// ======================================
// This Node.js server handles API requests to OpenAI and Gemini
// API keys are stored securely as environment variables (never exposed to frontend)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(bodyParser.json()); // Parses JSON data from requests
app.use(express.static('public')); // Serves static files from 'public' folder

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Check if API keys are configured
app.get('/api/status', (req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY
  });
});

// ======================================
// OpenAI API Endpoint
// ======================================
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    // Validate API key is configured
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment secrets.' 
      });
    }

    // Validate prompt
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    // Check for errors
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'OpenAI API error' 
      });
    }

    // Return the AI response
    res.json({ 
      result: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to call OpenAI API' });
  }
});

// ======================================
// Gemini API Endpoint
// ======================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Validate API key is configured
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment secrets.' 
      });
    }

    // Validate prompt
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();

    // Check for errors
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'Gemini API error' 
      });
    }

    // Return the AI response
    res.json({ 
      result: data.candidates[0].content.parts[0].text 
    });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📝 AI Resume Creator & Analyzer is ready!`);
  console.log(`🔐 Security: API keys are stored server-side as environment variables`);
});
