# 🚀 HireLens AI – Intelligent Resume Analyzer & Job Match System

A full-stack AI-powered web application that analyzes resumes against job descriptions, provides ATS compatibility scores with letter grades, generates Gemini AI-powered improvement suggestions, and builds personalized skill-gap roadmaps — all wrapped in a premium dark glass-morphism UI.

---

## ✨ Key Highlights

- **Google Gemini 2.5 Flash** for intelligent, context-aware resume suggestions
- **5-dimension ATS scoring** with letter grades (A–F), priority-tagged feedback, and strengths detection
- **Canonical skill matching** using 100+ skill aliases for accurate job-match analysis
- **Premium dark UI** with glass-morphism cards, gradient accents, and smooth animations
- **Interactive charts** — Doughnut, Radar, and Line charts for visual insights

---

## 🏗 Project Structure

```
AI RESUME ANALYSER/
├── backend/                # Node.js + Express REST API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── analysisController.js   # Resume vs JD analysis
│   │   ├── authController.js       # Register / Login / Me
│   │   └── resumeController.js     # Upload / CRUD / History
│   ├── middleware/
│   │   └── auth.js         # JWT authentication guard
│   ├── models/
│   │   ├── Analysis.js     # Analysis results schema
│   │   ├── Resume.js       # Resume + ATS score schema
│   │   └── User.js         # User account schema
│   ├── routes/
│   │   ├── analysis.js     # /api/analysis routes
│   │   ├── auth.js         # /api/auth routes
│   │   └── resume.js       # /api/resume routes
│   ├── services/
│   │   ├── aiSuggestions.js      # Rule-based + Gemini AI suggestions
│   │   ├── atsScorer.js          # 5-dimension ATS scorer
│   │   ├── jobAnalyzer.js        # JD parsing & skill extraction
│   │   ├── pdfParser.js          # PDF text & skill extraction
│   │   └── roadmapGenerator.js   # Skill-gap learning roadmaps
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Express entry point
│
└── frontend/               # React 18 + Vite + Tailwind CSS
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Charts/
    │   │       ├── RadarMatchChart.jsx   # ATS breakdown radar
    │   │       ├── ScoreRing.jsx         # Animated score ring
    │   │       └── SkillMatchChart.jsx   # Skill doughnut chart
    │   ├── context/
    │   │   └── AuthContext.jsx   # JWT auth state provider
    │   ├── pages/
    │   │   ├── HomePage.jsx            # Landing page
    │   │   ├── LoginPage.jsx           # Sign in
    │   │   ├── RegisterPage.jsx        # Create account
    │   │   ├── DashboardPage.jsx       # Overview dashboard
    │   │   ├── AnalyzePage.jsx         # Upload + analyze flow
    │   │   ├── AnalysisResultPage.jsx  # Tabbed results view
    │   │   └── HistoryPage.jsx         # Resume & analysis history
    │   ├── services/
    │   │   └── api.js        # Axios instance + API methods
    │   ├── App.jsx           # Router setup
    │   ├── main.jsx          # React entry point
    │   └── index.css         # Global styles + dark theme
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## ⚙️ Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, Chart.js, React Router v6    |
| Backend     | Node.js, Express.js                                        |
| Database    | MongoDB Atlas (Mongoose ODM)                               |
| Auth        | JWT (JSON Web Tokens), bcryptjs                            |
| AI / LLM    | Google Gemini 2.5 Flash (`@google/generative-ai`)          |
| File Upload | Multer (memory storage, PDF only)                          |
| PDF Parse   | pdf-parse                                                  |
| UI Extras   | react-hot-toast, react-icons (Feather Icons)               |

---

## 🧠 Core Features

| Feature                       | Description                                                                                      |
|-------------------------------|--------------------------------------------------------------------------------------------------|
| **ATS Score + Grade**         | 5-dimension scoring (keywords, sections, verbs, metrics, formatting) with A–F letter grade       |
| **Priority Feedback**         | Each feedback item tagged with priority (high/medium/low) and category (keywords, structure, etc.)|
| **Strengths Detection**       | Automatically identifies what's already working well in your resume                              |
| **Job Match Analysis**        | Canonical skill matching using 100+ aliases — detects React, ReactJS, React.js as the same skill |
| **AI Suggestions (Gemini)**   | 5 specific, actionable improvements generated by Google Gemini 2.5 Flash                        |
| **Rule-Based Suggestions**    | Detects weak verbs, missing metrics, missing sections, missing skills, and more                  |
| **Skill Gap Roadmap**         | Per-skill learning path with topics, resources, difficulty level, and time estimates              |
| **Skill Visualizations**      | Doughnut chart (matched/missing/extra), Radar chart (ATS breakdown), Line chart (score history)  |
| **Resume Version Tracking**   | Upload multiple resume versions and track ATS score progression over time                        |
| **JWT Authentication**        | Secure register/login with protected routes and automatic token refresh                          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas) works)
- **Google Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-analyser.git
cd "AI RESUME ANALYSER"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirelens_ai
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=AIzaSy...        # Required for AI suggestions
```

Start the backend:

```bash
npm run dev
```

> Backend runs at `http://localhost:5000`

> **Port 5000 already in use?** Run this before starting:
> ```bash
> # Windows (PowerShell)
> Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
>
> # macOS / Linux
> lsof -ti:5000 | xargs kill -9
> ```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Auth | Description         |
|--------|----------------------|------|---------------------|
| POST   | `/api/auth/register` | No   | Create new account  |
| POST   | `/api/auth/login`    | No   | Sign in & get token |
| GET    | `/api/auth/me`       | Yes  | Get current user    |

### Resume

| Method | Endpoint               | Auth | Description                |
|--------|------------------------|------|----------------------------|
| POST   | `/api/resume/upload`   | Yes  | Upload & parse PDF resume  |
| GET    | `/api/resume`          | Yes  | List all user resumes      |
| GET    | `/api/resume/:id`      | Yes  | Get single resume          |
| GET    | `/api/resume/history`  | Yes  | Version history with scores|
| DELETE | `/api/resume/:id`      | Yes  | Delete resume              |

### Analysis

| Method | Endpoint                | Auth | Description                            |
|--------|-------------------------|------|----------------------------------------|
| POST   | `/api/analysis/analyze` | Yes  | Analyze resume against job description |
| GET    | `/api/analysis`         | Yes  | List all analyses                      |
| GET    | `/api/analysis/:id`     | Yes  | Get single analysis (with populated resume) |
| DELETE | `/api/analysis/:id`     | Yes  | Delete analysis                        |

#### POST `/api/analysis/analyze` — Request Body

```json
{
  "resumeId": "mongo_object_id",
  "jobDescription": "Full job description text...",
  "jobTitle": "Senior Software Engineer",
  "useAI": true
}
```

---

## 📊 ATS Scoring Model

```
Score Breakdown (Total: 100 points)
├── Keyword Match         40 pts   — skill coverage against job description
├── Section Completeness  20 pts   — presence of skills, education, experience, projects
├── Action Verbs          15 pts   — strong verb usage in bullet points
├── Measurable Metrics    15 pts   — numbers, percentages, dollar amounts, scale
└── Formatting Rules      10 pts   — resume length, contact info, email presence
```

**Grading Scale:**

| Grade | Score Range | Meaning                        |
|-------|-------------|--------------------------------|
| A     | 85–100      | Excellent — ATS-optimized      |
| B     | 70–84       | Good — minor improvements needed |
| C     | 55–69       | Fair — several areas to improve |
| D     | 40–54       | Needs work — significant gaps  |
| F     | 0–39        | Critical — major overhaul needed|

**Feedback Priority Levels:**

Each ATS feedback item is tagged with:
- `priority`: **high** / **medium** / **low**
- `category`: **keywords** / **structure** / **language** / **impact** / **formatting** / **contact**

---

## 📐 Match Score Formula

```
Match Score = (Matched Required Skills / Total Required Skills) × 100
```

Skills are normalized through a comprehensive alias system:
- `react`, `reactjs`, `react.js` → **React**
- `node`, `nodejs`, `node.js` → **Node.js**
- `js`, `javascript`, `es6` → **JavaScript**
- And 100+ more aliases...

---

## 🤖 AI Suggestion Engine

### Rule-Based (Always Active)

| Check              | Trigger                                   |
|--------------------|-------------------------------------------|
| `weak_verb`        | Detects "worked on", "helped with", etc.  |
| `missing_metrics`  | <30% of bullets have numbers              |
| `missing_section`  | No summary/objective section found        |
| `missing_skills`   | Required skills not found in resume       |
| `too_short`        | Resume under 200 words                    |
| `missing_contact`  | Email address not detected                |
| `missing_links`    | No GitHub/LinkedIn URLs found             |

### Gemini AI (When `useAI: true`)

Sends resume text + job description + missing skills to **Google Gemini 2.5 Flash** and returns 5 specific, actionable improvements covering:
1. Bullet point rewrites (stronger, quantified)
2. Keyword integration
3. Professional summary improvements
4. Structure & section ordering
5. Skills to highlight or add

---

## 🗄 Database Schemas

### User
```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "bcrypt hashed",
  "role": "user | admin"
}
```

### Resume
```json
{
  "userId": "ObjectId (ref: User)",
  "fileName": "resume_v3.pdf",
  "rawText": "extracted plain text...",
  "structuredData": {
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["React", "Node.js", "Python"],
    "education": ["B.Tech in Computer Science"],
    "experience": ["Software Engineer at Acme Corp"],
    "projects": ["E-commerce Platform"]
  },
  "atsScore": {
    "total": 72,
    "grade": "B",
    "breakdown": {
      "keywordMatch": 30,
      "sectionCompleteness": 18,
      "actionVerbs": 10,
      "measurableMetrics": 8,
      "formattingRules": 6
    },
    "feedback": [
      { "text": "Add more measurable achievements", "priority": "high", "category": "impact" }
    ],
    "strengths": ["Strong action verbs used", "Contact info present"]
  },
  "version": 3
}
```

### Analysis
```json
{
  "userId": "ObjectId",
  "resumeId": "ObjectId (ref: Resume)",
  "jobDescription": "Full JD text...",
  "jobTitle": "Senior Software Engineer",
  "matchScore": 75,
  "matchedSkills": ["React", "Node.js"],
  "missingSkills": ["Python", "Docker"],
  "extraSkills": ["MongoDB"],
  "requiredSkills": ["React", "Node.js", "Python", "Docker"],
  "preferredSkills": ["GraphQL", "Redis"],
  "suggestions": {
    "basic": [
      { "type": "weak_verb", "message": "Replace 'worked on' with 'developed'", "original": "worked on", "improved": "developed" }
    ],
    "ai": ["Rewrite your summary to emphasize 3+ years of React experience..."]
  },
  "roadmap": [
    {
      "skill": "Docker",
      "level": "beginner",
      "topics": ["Containers basics", "Dockerfile", "Docker Compose"],
      "resources": ["Docker Official Docs", "Docker for Beginners - FCC"],
      "estimatedTime": "2-3 weeks"
    }
  ]
}
```

---

## 📸 Pages & Routes

| Page              | Route            | Description                                                    |
|-------------------|------------------|----------------------------------------------------------------|
| Home              | `/`              | Animated landing page with features & CTA                      |
| Register          | `/register`      | Create account with glass-morphism form                        |
| Login             | `/login`         | Sign in with JWT token                                         |
| Dashboard         | `/dashboard`     | Overview cards, latest resume with grade, recent analyses       |
| Analyze           | `/analyze`       | 3-step flow: select/upload resume → paste JD → confirm & run   |
| Analysis Result   | `/analysis/:id`  | 5 tabs: Overview, Feedback, Skills, Suggestions, Roadmap       |
| History           | `/history`       | All resumes & analyses, ATS score progression line chart        |

---

## 🔐 Environment Variables

| Variable         | Required | Description                                  |
|------------------|----------|----------------------------------------------|
| `PORT`           | Yes      | Backend server port (default: 5000)          |
| `MONGO_URI`      | Yes      | MongoDB Atlas connection string              |
| `JWT_SECRET`     | Yes      | Secret key for JWT signing                   |
| `JWT_EXPIRES_IN` | Yes      | Token expiry duration (e.g., `7d`)           |
| `CLIENT_URL`     | Yes      | Frontend URL for CORS (e.g., `http://localhost:5173`) |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key for AI suggestions     |

---

## 🎨 UI Design System

- **Theme**: Premium dark mode (`#030712` background)
- **Style**: Glass-morphism cards with `rgba(255,255,255,0.02)` backgrounds and subtle borders
- **Colors**: Blue-500 → Violet-500 gradients for primary actions; Green/Yellow/Red for status
- **Typography**: Inter font family
- **Animations**: Fade-in, slide-up, gradient shimmer on key elements
- **Components**: Custom `.card`, `.btn-primary`, `.input-field` classes
- **Charts**: Chart.js via react-chartjs-2 (Doughnut, Radar, Line)
- **Icons**: Feather Icons via `react-icons/fi`
- **Toasts**: `react-hot-toast` with dark theme

---

## 🛠 Scripts

### Backend

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm start`     | Start server with Node         |
| `npm run dev`   | Start with nodemon (auto-reload) |

### Frontend

| Command            | Description                  |
|--------------------|------------------------------|
| `npm run dev`      | Start Vite dev server        |
| `npm run build`    | Production build             |
| `npm run preview`  | Preview production build     |

---

## 📌 License

MIT — Free for personal and commercial use.
