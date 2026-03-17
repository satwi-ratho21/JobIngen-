# EduBridge: Multi-Agent AI Platform for Resume Analysis and Skill Gap Detection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

## 🚀 Overview

**EduBridge** is an AI-powered career acceleration platform designed to help engineering students bridge the gap between their current skills and the requirements of top companies and research institutes.

The platform analyzes a candidate's resume, target company, and desired role to detect skill gaps, predict selection probability, and provide personalized preparation guidance. EduBridge helps students understand why resumes get rejected, what skills they are missing, and how to improve through structured learning resources and interview preparation.

## ✨ Key Features

### 📊 **Dashboard**
- Centralized hub displaying resume insights, preparation progress, and analytics
- ATS match score with FAANG optimization
- Market value assessment based on skill set
- Real-time job matching with companies
- Trending skills analysis
- AI-powered resume optimization suggestions
- Score growth tracking over time
- Interactive charts and visualizations

### 🚀 **Tech Accelerator**
Students can select their dream company and role to receive:
- Selection probability prediction
- Missing skills required for the company
- Personalized preparation roadmap
- Previous interview questions from that company
- Salary benchmarking and market insights

### 🎓 **Scholar (IIT/NIT Internships)**
- AI-based module evaluating resumes
- Recommends internship opportunities from prestigious institutions
- Estimated chances of shortlisting
- Curated learning paths

### 🔍 **Skill Gap Analyzer**
- Analyzes resume and identifies missing technical and soft skills
- Redirects users to relevant learning platforms
- Provides structured improvement roadmap
- Tracks skill development progress

### 💼 **ATS Resume (Recruiter Mode)**
Tool designed for recruiters and company heads:
- Analyze large numbers of resumes efficiently
- Shortlist top candidates automatically
- Detect duplicate resumes
- Rank candidates using AI-powered keyword optimization
- Bulk import and processing capabilities

### 🎬 **Interview Practice & Simulation**
- AI-powered mock interview generator
- Face recognition for interview presence detection
- Real-time feedback on communication skills
- Question bank from top companies

### 📈 **Early Warning System**
- Identifies at-risk candidates based on engagement metrics
- Predictive alerts for performance issues
- Personalized intervention recommendations

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.1 | Modern UI framework |
| Vite | 7.3.0 | Lightning-fast build tool |
| TypeScript | 5.2.2 | Type-safe development |
| Tailwind CSS | 3.4.0 | Utility-first styling |
| Recharts | 3.5.1 | Interactive data visualization |
| Lucide React | 0.555.0 | Beautiful icon library |
| React Markdown | 10.1.0 | Markdown rendering |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Server runtime |
| Express.js | 4.18.2 | Web framework |
| TypeScript | 5.3.3 | Type-safe backend |
| Multer | 2.0.2 | File upload handling |
| CORS | 2.8.5 | Cross-origin support |
| dotenv | 16.3.1 | Environment configuration |
| ts-node-dev | 2.0.0 | Development server |

### **AI & Machine Learning**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Google Generative AI | Latest | Resume analysis, skill detection, interview prep |
| TensorFlow.js | 4.22.0 | Browser-based ML |
| Face-api.js | 0.20.0 | Face detection for interviews |
| Tesseract.js | 5.1.1 | OCR for document processing |
| js-tiktoken | 1.0.11 | LLM token management |

### **Data & APIs**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Axios | 1.7.2 | HTTP client |
| Weaviate | 2.1.0 | Vector database for semantic search |
| PDF.js | 5.4.449 | PDF processing |
| pdf-parse | 1.1.1 | PDF text extraction |
| date-fns | 3.0.0 | Date utilities |

## 📁 Project Structure

```
EduBridge/
├── client/                          # Frontend - React + Vite
│   ├── src/
│   │   ├── component/              # React UI components
│   │   │   ├── AIEnhancedDashboard.tsx
│   │   │   ├── AIReliefGame.tsx
│   │   │   ├── ATSCandidateRanking.tsx
│   │   │   ├── EarlyWarning.tsx
│   │   │   ├── Interview.tsx
│   │   │   ├── Mentor.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── ParentPortal.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   ├── PeerChat.tsx
│   │   │   ├── PeerMatch.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ReadingAnalysis.tsx
│   │   │   ├── Scholar.tsx
│   │   │   ├── SkillGap.tsx
│   │   │   ├── StudyPlan.tsx
│   │   │   ├── TechAccelerator.tsx
│   │   │   ├── Timetable.tsx
│   │   │   ├── Trends.tsx
│   │   │   └── VirtualLab.tsx
│   │   ├── services/               # API and AI services
│   │   │   ├── aiAgentsServices.ts
│   │   │   ├── geminiServices.ts
│   │   │   ├── mlServices.ts
│   │   │   ├── ragServices.ts
│   │   │   └── earlyWarningService.ts
│   │   ├── types/                  # TypeScript definitions
│   │   ├── App.tsx
│   │   ├── main.css
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                          # Backend - Express + Node.js
│   ├── src/
│   │   ├── features/
│   │   │   └── ai/
│   │   │       ├── controller.ts   # API endpoints
│   │   │       ├── routes.ts       # Route definitions
│   │   │       └── service.ts      # Business logic
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── modules/                         # Shared modules
│   ├── dashboard/
│   │   └── Dashboard.tsx           # Main dashboard component
│   └── auth/
│       └── Auth.tsx                # Authentication module
│
├── db/                             # Database
│   ├── migrations/
│   ├── models/
│   └── seeds/
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v8 or higher
- **Git**
- Google Gemini API Key (for AI features)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edubridge.git
cd edubridge
```

#### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

#### 3. Environment Configuration

Create `server/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
NODE_ENV=development
```

Create `client/.env.local` (optional, for local development):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_KEY=your_google_gemini_api_key
```

#### 4. Start Development Server

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:3000
```

The application will be accessible at `http://localhost:3000`

## 🏗️ Build & Deployment

### Build for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
# Generates optimized build in `dist/` folder
```

### Preview Production Build
```bash
npm run preview
# Preview at http://localhost:4173
```

### Deployment Targets

**Backend:**
- Render.com
- Heroku
- AWS EC2 / DigitalOcean
- Railway.app

**Frontend:**
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📦 Scripts

### Frontend (Client)
```bash
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (Server)
```bash
npm run dev          # Start with ts-node-dev
npm run build        # Compile TypeScript
npm start            # Run compiled server
```

## 🔑 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | `sk-...` |
| `VITE_API_BASE_URL` | Backend API URL | ❌ | `http://localhost:5000` |
| `PORT` | Server port | ❌ | `5000` |
| `NODE_ENV` | Environment | ❌ | `development` |

## 💡 Key Features Explained

### Dashboard
Real-time insights with:
- ATS match score with company-specific optimization
- Market value assessment
- Job recommendations
- Trending skills analysis
- Interactive performance charts

### Resume Analysis
AI-powered analysis detects:
- Keyword optimization opportunities
- Format and structure improvements
- Content enhancement suggestions
- ATS compatibility issues

### Skill Gap Detection
- Identifies missing technical skills
- Recommends learning resources
- Tracks improvement progress
- Suggests relevant projects

### Interview Preparation
- AI-generated mock questions
- Real-time feedback
- Performance analytics
- Company-specific preparation

## 🔄 Hot Module Replacement (HMR)

During development, Vite automatically refreshes your browser when you make changes to the source code. No manual refresh needed!

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Backend (change PORT in .env)
# Frontend (Vite will use next available port automatically)
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

**Environment variables not loading:**
```bash
# Restart dev server after adding .env changes
```

## 📚 API Documentation

API endpoints are available at `/api/*` prefix:
- `POST /api/ai/analyze-resume` - Analyze resume
- `POST /api/ai/detect-skills` - Detect skill gaps
- `POST /api/ai/predict-selection` - Predict selection probability
- `GET /api/ai/interview-questions` - Get interview questions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **EduBridge Team** - AI Career Acceleration Platform

## 🙏 Acknowledgments

- Google Generative AI for LLM capabilities
- React and Vite communities
- Open source contributors

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@edubridge.com
- Documentation: [docs.edubridge.com](https://docs.edubridge.com)

---

**Made with ❤️ to help engineering students succeed**
