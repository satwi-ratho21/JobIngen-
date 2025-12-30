
export type View = 'dashboard' | 'tech-accelerator' | 'early-warning' | 'skill-gap' | 'mentor' | 'projects' | 'interview' | 'trends' | 'timetable' | 'lab' | 'peers' | 'notes' | 'parents' | 'scholar';

export interface User {
  name: string;
  email: string;
  college: string;
  year: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SkillAnalysis {
  matchScore: number;
  missingSkills: {
    skill: string;
    courseLink: string;
    platform: 'Coursera' | 'NPTEL' | 'Udemy' | 'Other';
  }[];
  recommendations: string[];
  roleFit: string;
}

export interface CompanyFitAnalysis {
  matchScore: number;
  culturalFit: string;
  technicalGaps: string[];
  accelerationPlan: {
    week: string;
    focus: string;
    tasks: string[];
  }[];
}

export interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  roadmap: string[];
}

export interface TrendItem {
  technology: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  growth: string;
  description: string;
}

export interface WorkflowStep {
  phaseName: string;
  duration: string;
  description: string;
  keyConcepts: string[];
  tools: string[];
  practicalTask: string;
}

export interface InternshipOpportunity {
  id: string;
  institute: string;
  professor: string;
  domain: string;
  title: string;
  description: string;
  slots: number;
  deadline: string;
  prerequisites: string[];
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

// Early Warning System types
export type RiskLevel = 'low' | 'medium' | 'high';

export interface StudentRisk {
  id: string; // anonymized id
  riskLevel: RiskLevel;
  score: number; // composite risk score 0-100
  anonymizedSignals: {
    engagementDrop?: boolean;
    missedAssignments?: number;
    sentiment?: string;
    collaborationChange?: boolean;
    pressureIndex?: number;
  };
  explainability: string; // human-friendly explanation for why risk flagged
}

export interface EarlyWarningSummary {
  totalStudentsMonitored: number;
  atRiskCounts: {
    low: number;
    medium: number;
    high: number;
  };
  lastRun: string; // ISO timestamp
}

export interface EarlyWarningConfig {
  enabled: boolean;
  consentGiven: boolean;
  notificationThresholds: {
    studentNotify: number; // score threshold to notify student first
    escalateToMentor: number; // score threshold to notify mentor/counselor
  };
}

// Academic history supplied by students to improve the personalized analysis.
export interface StudentAcademicHistory {
  // Primary numeric representation used for analysis (0-100 percentage). If user enters GPA, convert to percentage before sending.
  previousPercentage?: number;
  // Optional GPA value (e.g., 8.5) for record-keeping
  gpa?: number;
  // Number of active backlogs (failed courses) if any
  activeBacklogs?: number;
  // Free-text context for performance notes (optional, used locally/anonymously)
  performanceNotes?: string;
  // Placeholder for uploaded memo/file reference (not uploaded in this mock)
  uploadedMemoName?: string;

  // Social & messaging identifiers (optional). In production these should be tokenized/anonymized and processed under explicit consent.
  snapchatId?: string;
  instagramId?: string;
  whatsappNumber?: string;
} 
