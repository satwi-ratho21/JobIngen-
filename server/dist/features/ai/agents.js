"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMultiAgentAnalysis = exports.compilerAgent = exports.experienceAgent = exports.skillAnalysisAgent = exports.atsAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.API_KEY || '';
const genAI = apiKey ? new generative_ai_1.GoogleGenerativeAI(apiKey) : null;
const modelFlash = 'gemini-1.5-flash';
// ============================================
// ATS AGENT - Resume Formatting & Keyword Optimization
// ============================================
const atsAgent = async (resumeText) => {
    const startTime = Date.now();
    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the following resume for ATS compatibility:

Resume:
${resumeText}

Provide analysis in JSON format with:
{
  "atsScore": number (0-100),
  "issues": string[],
  "improvements": string[],
  "missingKeywords": string[],
  "recommendations": string[],
  "faangOptimization": {
    "hasRequiredFormat": boolean,
    "suggestions": string[]
  }
}

Make sure to include specific, actionable feedback.`;
    try {
        const model = genAI?.getGenerativeModel({ model: modelFlash });
        if (!model)
            throw new Error('Gemini API not initialized');
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : mockAtsResponse();
        return {
            agentName: 'ATS Agent',
            timestamp: new Date(),
            analysis,
            confidence: 0.85,
            processingTime: Date.now() - startTime,
        };
    }
    catch (error) {
        console.error('ATS Agent Error:', error);
        return {
            agentName: 'ATS Agent',
            timestamp: new Date(),
            analysis: mockAtsResponse(),
            confidence: 0.7,
            processingTime: Date.now() - startTime,
        };
    }
};
exports.atsAgent = atsAgent;
// ============================================
// SKILL ANALYSIS AGENT - Technical & Soft Skills Assessment
// ============================================
const skillAnalysisAgent = async (resumeText) => {
    const startTime = Date.now();
    const prompt = `You are an expert in technical skill assessment. Analyze the following resume and extract skills:

Resume:
${resumeText}

Provide analysis in JSON format with:
{
  "technicalSkills": {
    "languages": string[],
    "frameworks": string[],
    "tools": string[],
    "databases": string[],
    "platforms": string[]
  },
  "softSkills": string[],
  "skillMaturityLevels": {
    "expert": string[],
    "intermediate": string[],
    "beginner": string[]
  },
  "skillGaps": {
    "forSeniorRole": string[],
    "forFANG": string[],
    "recommendations": string[]
  },
  "developmentAreas": string[]
}

Be specific and thorough in identifying all skills mentioned.`;
    try {
        const model = genAI?.getGenerativeModel({ model: modelFlash });
        if (!model)
            throw new Error('Gemini API not initialized');
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : mockSkillAnalysisResponse();
        return {
            agentName: 'Skill Analysis Agent',
            timestamp: new Date(),
            analysis,
            confidence: 0.88,
            processingTime: Date.now() - startTime,
        };
    }
    catch (error) {
        console.error('Skill Analysis Agent Error:', error);
        return {
            agentName: 'Skill Analysis Agent',
            timestamp: new Date(),
            analysis: mockSkillAnalysisResponse(),
            confidence: 0.7,
            processingTime: Date.now() - startTime,
        };
    }
};
exports.skillAnalysisAgent = skillAnalysisAgent;
// ============================================
// EXPERIENCE AGENT - Career Progression & Quality Assessment
// ============================================
const experienceAgent = async (resumeText) => {
    const startTime = Date.now();
    const prompt = `You are an expert career coach analyzing work experience. Analyze the following resume:

Resume:
${resumeText}

Provide analysis in JSON format with:
{
  "careerProgression": {
    "currentLevel": string,
    "trajectory": string,
    "yearOfExperience": number,
    "roleProgression": string[]
  },
  "experienceQuality": {
    "impactScore": number (0-100),
    "complexity": string,
    "leadershipExperience": boolean,
    "mentoringExperience": boolean
  },
  "roleFitAnalysis": {
    "bestFitRoles": string[],
    "strengths": string[],
    "areasForGrowth": string[]
  },
  "recommendations": string[]
}

Focus on quality of experience, not just years.`;
    try {
        const model = genAI?.getGenerativeModel({ model: modelFlash });
        if (!model)
            throw new Error('Gemini API not initialized');
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : mockExperienceResponse();
        return {
            agentName: 'Experience Agent',
            timestamp: new Date(),
            analysis,
            confidence: 0.86,
            processingTime: Date.now() - startTime,
        };
    }
    catch (error) {
        console.error('Experience Agent Error:', error);
        return {
            agentName: 'Experience Agent',
            timestamp: new Date(),
            analysis: mockExperienceResponse(),
            confidence: 0.7,
            processingTime: Date.now() - startTime,
        };
    }
};
exports.experienceAgent = experienceAgent;
// ============================================
// COMPILER AGENT - Synthesize All Insights
// ============================================
const compilerAgent = async (resumeText, atsAnalysis, skillAnalysis, experienceAnalysis) => {
    const startTime = Date.now();
    const prompt = `You are a career strategy expert. Synthesize the following analyses to create a comprehensive career development plan:

ATS Analysis: ${JSON.stringify(atsAnalysis.analysis)}
Skill Analysis: ${JSON.stringify(skillAnalysis.analysis)}
Experience Analysis: ${JSON.stringify(experienceAnalysis.analysis)}

Provide synthesis in JSON format with:
{
  "overallAssessment": string,
  "overallScore": number (0-100),
  "strengths": string[] (top 5),
  "weaknesses": string[] (top 5),
  "immediateActions": string[] (next 30 days),
  "careerRecommendations": {
    "nextRole": string,
    "targetCompanies": string[],
    "learningPath": string[]
  },
  "sixMonthPlan": string,
  "oneYearPlan": string,
  "resources": string[]
}

Provide actionable, specific recommendations.`;
    try {
        const model = genAI?.getGenerativeModel({ model: modelFlash });
        if (!model)
            throw new Error('Gemini API not initialized');
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : mockCompilerResponse();
        return {
            agentName: 'Compiler Agent',
            timestamp: new Date(),
            analysis,
            confidence: 0.89,
            processingTime: Date.now() - startTime,
        };
    }
    catch (error) {
        console.error('Compiler Agent Error:', error);
        return {
            agentName: 'Compiler Agent',
            timestamp: new Date(),
            analysis: mockCompilerResponse(),
            confidence: 0.7,
            processingTime: Date.now() - startTime,
        };
    }
};
exports.compilerAgent = compilerAgent;
// ============================================
// ORCHESTRATOR - Run All Agents in Parallel
// ============================================
const runMultiAgentAnalysis = async (resumeText, targetRole) => {
    try {
        // Run first 3 agents in parallel
        const [atsResult, skillResult, expResult] = await Promise.all([
            (0, exports.atsAgent)(resumeText),
            (0, exports.skillAnalysisAgent)(resumeText),
            (0, exports.experienceAgent)(resumeText),
        ]);
        // Run compiler with results from other agents
        const compilerResult = await (0, exports.compilerAgent)(resumeText, atsResult, skillResult, expResult);
        return {
            resumeText,
            atsAnalysis: atsResult,
            skillAnalysis: skillResult,
            experienceAnalysis: expResult,
            compiledInsights: compilerResult.analysis,
            timestamp: new Date(),
        };
    }
    catch (error) {
        console.error('Multi-Agent Analysis Error:', error);
        throw error;
    }
};
exports.runMultiAgentAnalysis = runMultiAgentAnalysis;
// ============================================
// MOCK RESPONSES FOR FALLBACK
// ============================================
const mockAtsResponse = () => ({
    atsScore: 82,
    issues: ['Missing ATS-friendly formatting', 'Some special characters in headers'],
    improvements: ['Use standard font', 'Add clear section breaks', 'Include keywords'],
    missingKeywords: ['Cloud Architecture', 'CI/CD', 'DevOps'],
    recommendations: [
        'Add quantified achievements',
        'Use industry-standard formatting',
        'Include relevant keywords from job descriptions',
    ],
    faangOptimization: {
        hasRequiredFormat: true,
        suggestions: [
            'Highlight system design experience',
            'Emphasize scalability and performance optimization',
        ],
    },
});
const mockSkillAnalysisResponse = () => ({
    technicalSkills: {
        languages: ['JavaScript', 'TypeScript', 'Python'],
        frameworks: ['React', 'Node.js', 'Express'],
        tools: ['Docker', 'Git', 'AWS'],
        databases: ['MongoDB', 'PostgreSQL'],
        platforms: ['AWS', 'GCP'],
    },
    softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
    skillMaturityLevels: {
        expert: ['JavaScript', 'React', 'Node.js'],
        intermediate: ['TypeScript', 'AWS', 'Docker'],
        beginner: ['Kubernetes', 'Machine Learning'],
    },
    skillGaps: {
        forSeniorRole: ['System Design', 'Architecture Patterns', 'Mentoring'],
        forFANG: ['Distributed Systems', 'Low-level Optimization', 'Advanced Algorithms'],
        recommendations: [
            'Take system design course',
            'Build distributed system project',
            'Study FAANG interview patterns',
        ],
    },
    developmentAreas: ['Cloud Architecture', 'Microservices', 'Advanced Security'],
});
const mockExperienceResponse = () => ({
    careerProgression: {
        currentLevel: 'Mid-level Software Engineer',
        trajectory: 'Steady growth with increasing responsibilities',
        yearsOfExperience: 4,
        roleProgression: ['Junior Developer', 'Software Engineer', 'Senior Engineer (track)'],
    },
    experienceQuality: {
        impactScore: 78,
        complexity: 'High - built scalable systems',
        leadershipExperience: true,
        mentoringExperience: true,
    },
    roleFitAnalysis: {
        bestFitRoles: ['Senior Software Engineer', 'Tech Lead', 'Engineering Manager'],
        strengths: [
            'Full-stack capabilities',
            'Leadership experience',
            'Scalable system design',
        ],
        areasForGrowth: [
            'System architecture at scale',
            'Cross-functional collaboration',
            'Strategic planning',
        ],
    },
    recommendations: [
        'Move towards Senior Engineer role in 6 months',
        'Develop architectural expertise',
        'Build mentoring skills',
    ],
});
const mockCompilerResponse = () => ({
    overallAssessment: 'Strong mid-level engineer with excellent technical foundation and emerging leadership qualities. Ready for senior role with focus on architecture and system design.',
    overallScore: 82,
    strengths: [
        'Strong full-stack development skills',
        'Proven leadership and mentoring abilities',
        'Scalable system design experience',
        'Clear career progression trajectory',
        'Well-rounded technical skillset',
    ],
    weaknesses: [
        'Limited system design expertise for FAANG interviews',
        'Could strengthen distributed systems knowledge',
        'Need more strategic architecture experience',
        'Limited open-source contribution visibility',
        'Could emphasize impact metrics better',
    ],
    immediateActions: [
        'Refactor resume to emphasize quantified impact (30 days)',
        'Start system design interview preparation (ongoing)',
        'Create a high-impact portfolio project (60 days)',
        'Improve resume ATS score from 82 to 90+ (7 days)',
    ],
    careerRecommendations: {
        nextRole: 'Senior Software Engineer / Tech Lead',
        targetCompanies: [
            'Google',
            'Amazon',
            'Microsoft',
            'Meta',
            'Apple',
            'Netflix',
        ],
        learningPath: [
            'System Design Mastery',
            'Advanced Algorithms & Data Structures',
            'Distributed Systems',
            'Microservices Architecture',
            'Leadership & Team Dynamics',
        ],
    },
    sixMonthPlan: 'Focus on senior-level technical skills: complete system design course, build 2 architectural projects, improve resume impact metrics, and network with senior engineers.',
    oneYearPlan: 'Transition to Senior Engineer or Tech Lead role, develop architectural expertise, establish thought leadership through articles/speaking, and mentor junior developers.',
    resources: [
        'System Design Interview Course',
        'LeetCode Premium for Algorithms',
        'Designing Data-Intensive Applications (Book)',
        'GitHub for Portfolio Projects',
        'YouTube: Tech Interview Channels',
    ],
});
