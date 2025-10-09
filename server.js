const { generateWordResume } = require('./generateResume');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug logs for keys
console.log('🧠 OpenAI Key:', process.env.OPENAI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('🧠 Gemini Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');

// -----------------------------
// API: status
// -----------------------------
app.get('/api/status', (req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY
  });
});

// -----------------------------
// API: OpenAI (chat completion)
// Expects JSON: { prompt: "..." }
// Returns JSON: { result: "AI text..." }
// -----------------------------
app.post('/api/openai', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env' });

    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful, professional resume assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || 'OpenAI API error';
      return res.status(response.status).json({ error: errMsg });
    }

    const result =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      (typeof data === 'string' ? data : JSON.stringify(data));

    res.json({ result });

  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Server error while calling OpenAI API' });
  }
});

// -----------------------------
// API: Gemini (Google Generative AI)
// -----------------------------
app.post('/api/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env' });

    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result?.response?.text() || "No response from Gemini";

    res.json({ result: text });
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Server error while calling Gemini API' });
  }
});
// -----------------------------
// API: Generate Word Resume
// -----------------------------

const fs = require('fs');

app.post('/api/generate-resume', async (req, res) => {
  try {
    const userData = req.body;

    // Paths
    const templatePath = path.join(__dirname, 'template.docx');  // <-- your template
    const outputDir = path.join(__dirname, 'output');
    const outputPath = path.join(outputDir, 'resume.docx');

    // Ensure output folder exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate Word resume
    await generateWordResume(userData, templatePath, outputPath);

    // Send file as download
    res.download(outputPath, 'resume.docx', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download resume' });
      }
    });

  } catch (err) {
    console.error('Error generating resume:', err);
    res.status(500).json({ error: 'Server error generating resume' });
  }
});

// -----------------------------
// Serve index.html for all other GET requests (Express 5.x compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('✅ AI Resume Creator & Analyzer is ready!');
});