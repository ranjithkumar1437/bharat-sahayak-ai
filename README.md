# 🇮🇳 Bharat Sahayak AI
### Multilingual AI-Powered Public Welfare Assistance Platform

An AI-powered platform designed to help Indian citizens discover government welfare schemes, understand preliminary eligibility, get document assistance, and receive application guidance in multiple languages.

---

## 🌟 About the Project

Bharat Sahayak AI aims to make government welfare information easier to understand and access.

Many citizens face difficulties finding suitable government schemes, understanding eligibility requirements, preparing documents, and completing application procedures.

Our platform brings these services together in one place using Artificial Intelligence, semantic search, and multilingual assistance.

## 🎯 Problem Statement

- Citizens often struggle to find relevant government welfare schemes.
- Scheme eligibility conditions can be difficult to understand.
- People may not know which documents are required.
- Language barriers make government information difficult to access.
- Application procedures can be confusing for first-time applicants.

## 💡 Our Solution

Bharat Sahayak AI provides a simple digital platform that helps citizens:

- Discover relevant government welfare schemes.
- Check preliminary eligibility based on provided information.
- Upload documents and extract useful information.
- Ask questions through an AI-powered assistant.
- Understand application procedures step by step.

## 🚀 Key Features

### 1. Scheme Discovery
Find relevant government welfare schemes through a searchable scheme knowledge base.

### 2. Preliminary Eligibility Checker
Check potential eligibility using user-provided information and predefined rules.

### 3. Document Assistant
Upload supported documents such as PDF and image files to extract and understand their text.

### 4. Multilingual AI Assistant
Ask questions and receive AI-powered assistance using Google's Gemini API.

### 5. Application Guide
Understand the general steps and documents involved in applying for government schemes.

### 6. User Interface
A simple React-based interface with separate pages for the platform's main services.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build |
| Python | Backend programming |
| FastAPI | Backend API development |
| Google Gemini API | AI-powered assistance |
| Sentence Transformers | Semantic search and matching |
| JSON | Scheme knowledge base |
| Pytesseract | OCR text extraction |
| PyPDF | PDF text extraction |
| Pillow | Image processing |
| Axios | Frontend API communication |
| React Router | Frontend navigation |
| Lucide React | Interface icons |

## 🏗️ Project Architecture

```text
Bharat-Sahayak-AI/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── routers/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
│
├── knowledge_base/
│   └── schemes.json
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python
- Node.js and npm
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/ranjithkumar1437/bharat-sahayak-ai.git
```

### 2. Open the Project

```bash
cd bharat-sahayak-ai
```

### 3. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Configure the required environment variables using the example environment file.

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://localhost:8000`

API Documentation:

`http://localhost:8000/docs`

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 🔗 Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/eligibility/check` | Preliminary eligibility check |
| POST | `/api/assistant/chat` | AI assistant interaction |
| POST | Document upload route | Document processing |

Refer to the backend API documentation at `/docs` for available routes and request formats.

## 🌍 Target Beneficiaries

- Students
- Farmers
- Women
- Senior citizens
- Economically weaker sections
- Rural and underserved communities

## 🔮 Future Enhancements

- Voice-based AI assistance.
- Improved regional language support.
- More government scheme information.
- Enhanced document processing.
- Mobile-friendly experience.
- Integration with verified official government information sources.

## ⚠️ Important Disclaimer

Bharat Sahayak AI is an informational assistance platform. Eligibility results are preliminary and are not official government decisions. Extracted document text does not establish document authenticity. Users should verify scheme details and application requirements with the relevant official government department.

## 👨‍💻 Team CodeNova

**Project:** Bharat Sahayak AI  
**Hackathon:** HackWithAditya 2K26  
**Theme:** AI for Bharat

### Team Members

1. Danda Ranjith Kumar
2. Babburi Gnana Sai Nivedita
3. Balle Neha Sri Ambica
4. Gandha Hari Venkatesh
5. Kunchala Jyothi
6. Golla Vincy Viswakala Vandan

---

### 📌 GitHub Repository

[https://github.com/ranjithkumar1437/bharat-sahayak-ai](https://github.com/ranjithkumar1437/bharat-sahayak-ai)

**Making government welfare information easier to discover, understand, and access through AI. 🇮🇳**
