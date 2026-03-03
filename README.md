# 🚀 HireLens AI – Intelligent Resume Analyzer & Job Match System

A full-stack web application that analyzes resumes against job descriptions using NLP and AI, providing ATS scores, skill match analysis, and personalized improvement roadmaps.

---

## 🏗 Project Structure

```
AI RESUME ANALYSER/
├── backend/          # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # Express routes
│   ├── services/     # Business logic (PDF parse, ATS, AI)
│   ├── .env          # Environment variables
│   └── server.js     # Entry point
└── frontend/         # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth context
    │   ├── pages/        # Page components
    │   └── services/     # API service layer
    └── index.html
```

---

## ⚙️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Chart.js          |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB Atlas (Mongoose)                        |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| File Upload| Multer (memory storage)                         |
| PDF Parse  | pdf-parse                                       |
| AI/LLM     | OpenAI GPT-3.5-turbo (optional)                 |

---

## 🧠 Core Features

| Feature                    | Description                                              |
|----------------------------|----------------------------------------------------------|
| **ATS Score**              | 5-dimension scoring: keywords, sections, verbs, metrics, formatting |
| **Job Match Analysis**     | NLP-based skill extraction and match scoring             |
| **Skill Visualization**    | Doughnut chart for matched/missing skills, radar for ATS |
| **AI Suggestions**         | Rule-based + optional GPT-3.5 powered suggestions        |
| **Skill Gap Roadmap**      | Per-skill learning topics, resources, and time estimates |
| **Version Tracking**       | Track ATS score progression with line chart              |
| **Auth**                   | JWT register/login with protected routes                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenAI API key (optional, for AI suggestions)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirelens_ai
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-...   # Optional
```

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register user      |
| POST   | /api/auth/login      | Login user         |
| GET    | /api/auth/me         | Get current user   |

### Resume
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/resume/upload    | Upload & parse PDF       |
| GET    | /api/resume           | Get all resumes          |
| GET    | /api/resume/:id       | Get single resume        |
| GET    | /api/resume/history   | Get version history      |
| DELETE | /api/resume/:id       | Delete resume            |

### Analysis
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /api/analysis/analyze | Analyze resume vs JD           |
| GET    | /api/analysis         | Get all analyses               |
| GET    | /api/analysis/:id     | Get single analysis            |
| DELETE | /api/analysis/:id     | Delete analysis                |

---

## 📊 ATS Scoring Model

```
Score Breakdown (Total: 100 points)
├── Keyword Match         40 pts  (skill coverage)
├── Section Completeness  20 pts  (skills/edu/exp/projects)
├── Action Verbs          15 pts  (strong verb usage)
├── Measurable Metrics    15 pts  (numbers, %, $, scale)
└── Formatting Rules      10 pts  (length, contact, email)
```

## 📐 Match Score Formula

```
Match Score = (Matched Required Skills / Total Required Skills) × 100
```

---

## 🗄 Database Schema

### User
```json
{ "name": "string", "email": "string (unique)", "password": "hashed", "role": "user|admin" }
```

### Resume
```json
{
  "userId": "ObjectId",
  "rawText": "string",
  "structuredData": { "skills": [], "education": [], "experience": [], "projects": [] },
  "atsScore": { "total": 0, "breakdown": {}, "feedback": [] },
  "version": 1
}
```

### Analysis
```json
{
  "resumeId": "ObjectId",
  "jobDescription": "string",
  "matchScore": 0,
  "matchedSkills": [], "missingSkills": [], "extraSkills": [],
  "suggestions": { "basic": [], "ai": [] },
  "roadmap": []
}
```

---

## 📸 Pages

| Page              | Route            | Description                        |
|-------------------|------------------|------------------------------------|
| Home              | `/`              | Landing page with features         |
| Register          | `/register`      | Create account                     |
| Login             | `/login`         | Sign in                            |
| Dashboard         | `/dashboard`     | Overview, latest resume, analyses  |
| Analyze           | `/analyze`       | Upload resume + paste JD           |
| Analysis Result   | `/analysis/:id`  | Full analysis with tabs            |
| History           | `/history`       | All resumes + analyses + chart     |

---

## 🔐 Environment Variables

```env
# Backend (.env)
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-...           # Optional
```

---

## 🎨 UI Design

- **Theme**: Dark mode (slate-950 background)
- **Colors**: Blue-600 primary, violet accents
- **Typography**: Inter font
- **Components**: Tailwind CSS utility classes with custom components (`.card`, `.btn-primary`, `.input-field`)
- **Charts**: Chart.js via react-chartjs-2 (Doughnut, Radar, Line)

---

## 📌 License

MIT – Free for personal and commercial use.
