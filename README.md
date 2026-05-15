# HireLens AI

HireLens AI is a full-stack resume intelligence platform that analyzes a resume against a target job description and produces actionable outputs such as ATS diagnostics, skill-gap roadmaps, AI suggestions, resume optimization, cover letters, interview preparation, and PDF export.

This repository is structured as a production-style final-year project with separate frontend and backend apps.

## Key Features

- Resume upload and parsing (PDF)
- ATS scoring across 5 dimensions
- Skill matching: matched, missing, and extra skills
- AI-assisted resume suggestions (NVIDIA NIM endpoint)
- Resume auto-optimization for target roles
- Diff view between resume and job description
- Cover letter and interview-prep generation
- Learning roadmap generation for missing skills
- Multi-template optimized resume PDF download
- Analysis export as JSON
- Authenticated user history (resumes and analyses)

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Chart.js + react-chartjs-2
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer (PDF uploads)
- PDFKit (PDF generation)
- express-validator (request validation)
- express-rate-limit (AI endpoint protection)

### AI
- NVIDIA-compatible OpenAI SDK integration
- Default model: `meta/llama-3.1-8b-instruct`

## Project Structure

```text
HireLens-AI/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── README.md
```

## Architecture Overview

1. User authenticates and uploads resume PDF.
2. Backend parses resume text and extracts structured sections.
3. ATS scorer computes weighted score and feedback.
4. User submits job description for matching.
5. Job analyzer extracts required/preferred skills and computes match score.
6. Optional AI features generate optimization suggestions and outputs.
7. Results are stored and available in history and export workflows.

## ATS Scoring Model

Total score: 100

- Keyword Match: 40
- Section Completeness: 20
- Action Verbs: 15
- Measurable Metrics: 15
- Formatting Rules: 10

The scorer also returns:
- Grade
- Breakdown by dimension
- Strengths
- Prioritized feedback

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d

NVIDIA_API_KEY=<your_nvidia_api_key>
NVIDIA_MODEL=meta/llama-3.1-8b-instruct

CLIENT_URL=http://localhost:5173
```

## Local Setup

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 3) Run backend

```bash
cd ../backend
npm run dev
```

### 4) Run frontend

```bash
cd ../frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API calls to backend.

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Resume
- `POST /api/resume/upload`
- `GET /api/resume`
- `GET /api/resume/history`
- `GET /api/resume/:id`
- `DELETE /api/resume/:id`

### Analysis
- `POST /api/analysis/analyze`
- `GET /api/analysis`
- `GET /api/analysis/:id`
- `GET /api/analysis/:id/diff`
- `POST /api/analysis/:id/optimize`
- `POST /api/analysis/:id/download-pdf`
- `GET /api/analysis/:id/export`
- `POST /api/analysis/:id/cover-letter`
- `POST /api/analysis/:id/interview-prep`
- `PATCH /api/analysis/:id/roadmap/:skillId`
- `DELETE /api/analysis/:id`

## Security and Reliability

- JWT-protected private APIs
- Input validation for critical request payloads
- File upload restriction to PDF with size cap
- AI endpoint rate limiting
- Centralized error handling for upload and server errors

## Performance Enhancements

- In-memory cache for repeated AI generation requests
- Pagination support for analysis and resume listings

## UI and UX Documentation

Detailed UI/UX documentation is available in:

- `UI_UX_DETAILS.md`

## Evaluation Suggestions (for Final-Year Report)

Track and report:
- Average ATS improvement before vs after optimization
- Average API latency for analysis and AI generation endpoints
- Completion rate of full flow (upload -> analyze -> optimize -> export)

## Troubleshooting

### Backend port already in use (EADDRINUSE)

If port 5001 is already occupied, stop the existing process or change `PORT` in `.env`.

### Frontend shows 400 on analyze request

Check response JSON message and ensure:
- `resumeId` is valid
- job description is sufficiently long
- token is valid and not expired

### AI outputs unavailable

Verify:
- `NVIDIA_API_KEY` is present
- model name is valid
- rate limits are not exceeded

## Future Scope

- Persistent cache layer (Redis)
- Password reset and email verification
- Advanced report export (PDF/Docx for full analysis)
- Role-based analytics dashboard
- Automated test suite (API + UI)

## License

MIT License
