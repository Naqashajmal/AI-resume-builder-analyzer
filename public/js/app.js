window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    checkAPIStatus();
});

// ======================================
// Settings Management
// ======================================

function toggleSettings() {
    const content = document.getElementById('settingsContent');
    content.classList.toggle('active');
}

function saveSettings() {
    const aiModel = document.getElementById('aiModel').value;

    // Save only model preference to localStorage (no API keys)
    localStorage.setItem('aiModel', aiModel);

    showMessage('Model preference saved successfully!', 'success');
    
    // Close settings panel after 1 second
    setTimeout(() => {
        document.getElementById('settingsContent').classList.remove('active');
    }, 1000);
}

function loadSettings() {
    const aiModel = localStorage.getItem('aiModel') || 'openai';
    if (document.getElementById('aiModel')) {
        document.getElementById('aiModel').value = aiModel;
    }
}

// Check which API keys are configured on the server
async function checkAPIStatus() {
    try {
        const response = await fetch('/api/status');
        const status = await response.json();
        
        const statusDiv = document.getElementById('apiStatus');
        if (!statusDiv) return;
        let html = '<div class="status-indicators">';
        
        html += `<div class="status-item ${status.openai ? 'configured' : 'not-configured'}">
            ${status.openai ? '✅' : '❌'} OpenAI: ${status.openai ? 'Configured' : 'Not Configured'}
        </div>`;
        
        html += `<div class="status-item ${status.gemini ? 'configured' : 'not-configured'}">
            ${status.gemini ? '✅' : '❌'} Gemini: ${status.gemini ? 'Configured' : 'Not Configured'}
        </div>`;
        
        html += '</div>';
        statusDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to check API status:', error);
    }
}

// ======================================
// Tab Switching
// ======================================

function switchTab(tab) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    if (tab === 'create') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('createTab').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('analyzeTab').classList.add('active');
    }
}

// ======================================
// Resume Creator
// ======================================

document.getElementById('resumeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        objective: document.getElementById('objective').value,
        education: document.getElementById('education').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        achievements: document.getElementById('achievements').value
    };

    // No API key validation needed - keys are managed server-side

    // Build AI prompt
    const prompt = `Create a professional, well-formatted resume based on the following information. Format it beautifully with clear sections and professional language:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Objective: ${formData.objective || 'Not provided'}

Education:
${formData.education || 'Not provided'}

Work Experience:
${formData.experience || 'Not provided'}

Skills:
${formData.skills || 'Not provided'}

Achievements:
${formData.achievements || 'Not provided'}

Please format this as a complete, professional resume with proper headings, bullet points where appropriate, and professional language. Make it stand out!`;

    // Call AI API
    await callAI(prompt, (result) => {
        // Display the generated resume
        document.getElementById('resumeContent').textContent = result;
        document.getElementById('resumeOutput').style.display = 'block';
        
        // Scroll to output
        document.getElementById('resumeOutput').scrollIntoView({ behavior: 'smooth' });
    });
});

// ======================================
// Resume Analyzer
// ======================================

async function analyzeResume() {
    const resumeText = document.getElementById('resumeText').value.trim();

    if (!resumeText) {
        showMessage('Please paste your resume text first', 'error');
        return;
    }

    // No API key validation needed - keys are managed server-side

    // Build AI prompt for analysis
    const prompt = `Analyze the following resume and provide detailed feedback in this exact format:

SKILLS EXTRACTED:
[List all technical and soft skills found]

STRENGTHS:
[List 3-5 key strengths]

WEAKNESSES:
[List 3-5 areas for improvement]

SUGGESTIONS:
[Provide 3-5 specific suggestions to improve the resume]

SUGGESTED JOB TITLES:
[List 5-7 job titles this person would be suited for]

Resume to analyze:
${resumeText}`;

    // Call AI API
    await callAI(prompt, (result) => {
        // Parse and display the analysis
        displayAnalysis(result);
        document.getElementById('analysisOutput').style.display = 'block';
        
        // Scroll to output
        document.getElementById('analysisOutput').scrollIntoView({ behavior: 'smooth' });
    });
}

function displayAnalysis(analysisText) {
    const sections = {
        'SKILLS EXTRACTED:': '🎯',
        'STRENGTHS:': '💪',
        'WEAKNESSES:': '⚠️',
        'SUGGESTIONS:': '💡',
        'SUGGESTED JOB TITLES:': '👔'
    };

    let html = '';
    let currentSection = '';
    let currentContent = '';

    // Split by sections
    const lines = analysisText.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Check if this line is a section header
        if (sections[trimmedLine]) {
            // Save previous section if exists
            if (currentSection) {
                html += createAnalysisSection(currentSection, currentContent, sections[currentSection]);
            }
            currentSection = trimmedLine;
            currentContent = '';
        } else if (trimmedLine && currentSection) {
            currentContent += trimmedLine + '\n';
        }
    });

    // Add the last section
    if (currentSection) {
        html += createAnalysisSection(currentSection, currentContent, sections[currentSection]);
    }

    document.getElementById('analysisContent').innerHTML = html || `<p>${analysisText}</p>`;
}

function createAnalysisSection(title, content, icon) {
    const cleanTitle = title.replace(':', '');
    const items = content.trim().split('\n').filter(item => item.trim());
    
    let itemsHtml = '<ul>';
    items.forEach(item => {
        const cleanItem = item.replace(/^[-•*]\s*/, '').trim();
        if (cleanItem) {
            itemsHtml += `<li>${cleanItem}</li>`;
        }
    });
    itemsHtml += '</ul>';

    return `
        <div class="analysis-section">
            <h4>${icon} ${cleanTitle}</h4>
            ${itemsHtml}
        </div>
    `;
}

// ======================================
// AI API Call (Generic)
// ======================================

async function callAI(prompt, callback) {
    // Always use OpenAI model
    const endpoint = '/api/gemini';

    // Show loading spinner
    document.getElementById('loadingSpinner').classList.add('active');

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        // Hide loading spinner
        document.getElementById('loadingSpinner').classList.remove('active');

        if (!response.ok) {
            throw new Error(data.error || 'API call failed');
        }
         const formattedText = formatResumeText(data.result);

        // Execute callback with result
        callback(formattedText);

    } catch (error) {
        // Hide loading spinner
        document.getElementById('loadingSpinner').classList.remove('active');
        
        console.error('AI API Error:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}
function formatResumeText(mdText) {
    return mdText
        .replace(/^### (.*)$/gm, (_, h) => `\n${h.toUpperCase()}\n${'-'.repeat(h.length)}\n`) // Headings → uppercase + underline
        .replace(/^\*\*([^\*]+)\*\*/gm, (_, b) => b.toUpperCase()) // Bold → uppercase
        .replace(/^\* (.*)$/gm, (_, li) => `• ${li}`) // Bullets
        .replace(/^---$/gm, '--------------------') // Horizontal line
        .replace(/^\n+/, ''); // Remove extra leading newlines
}

// ======================================
// PDF Download
// ======================================

function downloadPDF() {
    const element = document.getElementById('resumeContent');
    
    const opt = {
        margin: 1,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save();
    
    showMessage('PDF download started!', 'success');
}

// ======================================
// Utility Functions
// ======================================

function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    const activeTab = document.querySelector('.tab-content.active');
    activeTab.insertBefore(message, activeTab.firstChild);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        message.remove();
    }, 4000);
}