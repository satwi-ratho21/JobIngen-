# EduBridge: Multi-Agent AI Platform for Resume Analysis and Skill Gap Detection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

EduBridge: Multi-Agent AI Platform for Resume Analysis and Skill Gap Detection
<img width="954" height="651" alt="image" src="https://github.com/user-attachments/assets/f42f856a-c665-4797-ba30-e3b47134a359" />

EduBridge is an AI-powered career acceleration platform designed to help engineering students bridge the gap between their current skills and the requirements of top companies and research institutes.
The platform analyzes a candidate’s resume, target company, and desired role to detect skill gaps, predict selection probability, and provide personalized preparation guidance.
EduBridge helps students understand why resumes get rejected, what skills they are missing, and how to improve through structured learning resources and interview preparation.
<img width="2551" height="1612" alt="image" src="https://github.com/user-attachments/assets/defb0ae7-44c5-4cab-9eeb-36e9e1fc738e" />

Features:

Dashboard: A centralized dashboard that displays resume insights, preparation progress, analytics, and recommended actions for career improvement.
<img width="938" height="827" alt="image" src="https://github.com/user-attachments/assets/00817435-7c8b-4974-b0af-316837b4639f" />

Tech Accelerator: Allows students to select their dream company and role, upload their resume, and receive:
Selection probability prediction
Missing skills required for the company
Personalized preparation roadmap
Previous interview questions from that company
<img width="1877" height="871" alt="image" src="https://github.com/user-attachments/assets/61f4f686-45bd-416a-85bc-6110331c1053" />

Scholar (IIT/NIT Internships):AI-based module that evaluates resumes and recommends internship opportunities from IITs and NITs along with estimated chances of shortlisting.
<img width="862" height="822" alt="image" src="https://github.com/user-attachments/assets/fbb2bf0f-e993-4a36-918c-97d07a91eb83" />

Skill Gap Analyzer: Analyzes the resume and identifies missing technical and soft skills, then redirects users to relevant learning platforms and resources.
<img width="737" height="556" alt="image" src="https://github.com/user-attachments/assets/0aa43bd3-471c-413b-b2ad-c8839d3419c7" />

ATS Resume (Recruiter Mode): A tool designed for recruiters and company heads to:
Analyze large numbers of resumes
Shortlist top candidates
Detect duplicate resumes
Rank candidates using AI-powered keyword optimization
<img width="828" height="640" alt="image" src="https://github.com/user-attachments/assets/80c97e70-7fe3-46d2-9d07-d16e942ff46e" />

Tech Stack – EduBridge

Frontend
React 19 + Vite – Fast and modern UI development
TypeScript – Type safety and scalable code
Tailwind CSS – Responsive and utility-first styling
Recharts – Data visualization for analytics dashboards
Lucide React – Icon library for UI components

Backend
Node.js + Express.js – REST API and server logic
TypeScript – Structured backend development
Multer – Resume file upload handling
CORS & dotenv – Secure API communication and environment configuration

AI & Machine Learning
Google Generative AI (Gemini) – Resume analysis, skill gap detection, and interview preparation
TensorFlow.js – Browser-based machine learning capabilities
Face-api.js – Face detection for interview simulation features
Tesseract.js – OCR for extracting text from documents or images

Data Processing & APIs
Axios – API communication between frontend and backend
Weaviate Vector Database – Semantic search and AI embeddings
PDF.js & pdf-parse – Resume PDF parsing and text extraction
React Markdown – Rendering AI-generated formatted responses

Utilities
date-fns – Date manipulation
js-tiktoken – Token management for LLM requests

Development Tools
ESLint + TypeScript ESLint – Code quality and linting
ts-node-dev – Backend development server

Serve – Static deployment support

Setup Instructions
Prerequisites

Node.js v18 or higher

npm or yarn package manager

Installation
1. Clone the Repository
git clone https://github.com/yourusername/edubridge.git
cd edubridge
2. Install Dependencies
npm install
3. Set Up Environment Variables

Create a .env file in the root directory and add:

VITE_API_KEY=your_google_gemini_api_key
4. Start Development Server
npm run dev

The application will run at:
http://localhost:3000

Build for Production
npm run build

The optimized build will be generated inside the dist folder.

Preview Production Build
npm run preview
Project Structure
EduBridge/
│
├── components/        # React UI components
├── services/          # API and AI services
├── backend/           # Express server and APIs
├── utils/             # Helper utilities
├── src/               # Styles and assets
│
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── types.ts           # TypeScript type definitions
├── package.json       # Project dependencies
└── README.md
Environment Variables
Variable	Description
VITE_API_KEY	Google Gemini API key used for AI features
Development

EduBridge uses Vite for fast development with Hot Module Replacement (HMR). Any changes in the source code will automatically update in the browser during development.

License

MIT License
