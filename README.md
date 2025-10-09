
# AI Resume Builder & Analyzer

**AI Resume Builder & Analyzer** is a full-stack web application that allows users to generate professional resumes using AI and analyze existing resumes for improvements. It integrates the **Gemini AI API** to create polished, context-aware resumes based on user input, and provides formatting options and feedback for skills, strengths, and weaknesses. Users can also download resumes as PDF for immediate use.

https://ai-resume-builder-analyzer.vercel.app/

---

## **Features**

### **Resume Builder**

* Enter your personal details, work experience, education, skills, achievements, and career objectives.
* AI generates a **well-structured, professional resume** using Gemini AI.
* Output is clean and readable with proper headings, bullet points, and emphasis formatting.
* Download your resume as **PDF** directly from the browser.

### **Resume Analyzer**

* Paste your existing resume text and get **insightful analysis**.
* AI extracts key skills, strengths, weaknesses, and provides improvement suggestions.
* Suggests potential job roles based on the resume content.

### **User-Friendly Interface**

* Interactive, easy-to-use form inputs.
* Tab-based interface for creating and analyzing resumes.
* Loading spinner and error messages for smooth user experience.

### **Technology Stack**

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Generative AI (Gemini API)
* **PDF Generation:** html2pdf.js
* **Deployment:** Vercel (Frontend & Backend)

---

## **How It Works**

1. User fills out the resume form with all relevant information.
2. The prompt is sent to **Gemini AI** via the backend API.
3. AI returns a formatted resume in plain text, converted to clean headings and bullet points.
4. User can view the result on the page and **download as PDF**.
5. Resume Analyzer allows users to paste existing resumes for AI-generated feedback.

---

## **Installation (For Local Development)**

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/AI-resume-builder-analyzer.git
cd AI-resume-builder-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key (optional)
PORT=5000
```

4. Start the server:

```bash
node server.js
```

5. Open your browser at `http://localhost:5000`.

---

## **Usage**

* Go to the **Resume Builder tab**, fill in your details, and click **Generate Resume**.
* Download your resume as PDF using the **Download PDF button**.
* Use the **Resume Analyzer tab** to paste an existing resume and receive feedback.

---

## **Screenshots**

*(Optional: Add screenshots of your app here to show Resume Builder, Analyzer, and PDF output.)*

---

## **Contributing**

* Fork the repository.
* Create a new branch (`git checkout -b feature/YourFeature`).
* Make your changes and commit (`git commit -m 'Add some feature'`).
* Push to the branch (`git push origin feature/YourFeature`).
* Open a Pull Request.

