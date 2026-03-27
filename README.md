# 🚀 HireLens AI — Executive Resume Intelligence Suite

HireLens AI is a premium, high-authority career platform that transforms generic resumes into job-winning documents. Powered by **NVIDIA NIM (Llama-3.1)** and a sophisticated **Multi-Dimension ATS Scoring Engine**, it provides deep-scan diagnostics, role-specific optimization, and executive-level PDF generation.

---

## ✨ Executive Highlights

- **NVIDIA NIM Powerhouse** — Driven by `meta/llama-3.1-8b-instruct` for superior semantic analysis and context-aware suggestions.
- **High-Authority Design System** — A museum-grade UI/UX with **Plus Jakarta Sans** and **Outfit** typography.
- **Universal Theme Engine** — Seamlessly switch between **Deep Obsidian (Dark)** and **Sophisticated Slate (Light)** modes with 100% legibility.
- **5-Dimension ATS Diagnostics** — Precise scoring across Keywords, Sections, Action Verbs, Measurable Metrics, and Formatting.
- **Multi-Template PDF Export** — Download your optimized resume in **Classic**, **Modern**, or **Minimalist** executive styles.
- **Smart Skill Gap Roadmaps** — Personalized learning paths with curated resources to bridge the gap between your current profile and target job roles.
- **Interview Strategy AI** — Automated generation of role-specific tactical interview prep kits.

---

## 🏗 Project Architecture

```
HIRELENS AI/
├── backend/                # Node.js + Express + NVIDIA NIM
│   ├── services/
│   │   ├── aiSuggestions.js      # NVIDIA NIM (Llama-3.1) Integration
│   │   ├── atsScorer.js          # Multi-dimension scoring logic
│   │   ├── roadmapGenerator.js   # Automated learning path engine
│   │   └── pdfGenerator.js       # Multi-template PDFKit engine
│   └── ...
└── frontend/               # React 18 + Vite + Tailwind + Framer Motion
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx   # JWT Authentication state
    │   │   └── ThemeContext.jsx  # Advanced Light/Dark mode state
    │   ├── pages/
    │   │   ├── HomePage.jsx      # High-impact landing page
    │   │   ├── DashboardPage.jsx # Career Command Center
    │   │   └── AnalysisResultPage.jsx # Deep diagnostic results
    │   └── index.css             # Variable-based Design System
```

---

## ⚙️ Modern Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| **Frontend**    | React 18, Vite, Tailwind CSS, Framer Motion, Chart.js      |
| **Backend**     | Node.js, Express.js, PDFKit, Multer                        |
| **AI / LLM**    | **NVIDIA NIM** (meta/llama-3.1-8b-instruct)               |
| **Database**    | MongoDB Atlas (Mongoose ODM)                               |
| **Auth**        | JWT (JSON Web Tokens), bcryptjs                            |
| **Typography**  | Plus Jakarta Sans (Body), Outfit (Headings)                |
| **UI Polish**   | react-hot-toast, react-icons (Feather), Lucide             |

---

## 🧠 Diagnostic Engines

### 📊 ATS Scoring Model
A 100-point diagnostic scale that mirrors high-end corporate filtering systems:
- **Keyword Match (40 pts)**: Alias-aware skill detection (e.g., *React* ↔ *React.js*).
- **Section Integrity (20 pts)**: Verification of Summary, Core Skills, Experience, and Education.
- **Action Verbs (15 pts)**: Scoring based on 200+ high-impact professional verbs.
- **Measurable Impact (15 pts)**: Detection of quantified achievements (%, $, numbers).
- **Formatting Protocol (10 pts)**: Layout compliance and vital contact information.

### 🤖 NVIDIA NIM Optimization
When **Deep Scan** is initiated, HireLens utilizes NVIDIA's inference microservices to:
1.  **Rewrite Bullets**: Transform passive tasks into high-impact numerical achievements.
2.  **Strategic Summaries**: Craft professional objectives that bridge the candidate's history with the target JD.
3.  **Keyword Injection**: Mathematically optimize skill placement for maximum ATS indexing.

---

## 🚀 Deployment & Installation

### 1. Environment Configuration

Create a `backend/.env` file:
```env
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
NVIDIA_API_KEY=nvapi-...        # Required for Deep Scan functions
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
```

### 2. Backend Boot
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Boot
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Primary API Interface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | `POST` | Create high-authority user profile |
| `/api/resume/upload` | `POST` | Secure PDF upload & parsing |
| `/api/analysis/analyze` | `POST` | Launch deep-scan ATS diagnostic |
| `/api/analysis/:id/optimize` | `POST` | NVIDIA-powered bulk resume rewrite |
| `/api/analysis/:id/download-pdf` | `POST` | Generate executive-template PDF |

---

## 🎨 Design Philosophy — "Authority & Precision"

HireLens follows an **Expert-First** design philosophy:
- **Glassmorphism**: Sophisticated semi-transparent layers for visual depth.
- **Micro-Animations**: Staggered fades and frictionless transitions via Framer Motion.
- **Legibility**: Forced contrast ratios in both Light and Dark themes to ensure 100% accessibility.
- **Status Indicators**: Vibrant gradient rings and radar charts for immediate data interpretation.

---

## 📌 License
MIT — Engineered for professional career acceleration.
