"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSkillGapService = exports.generateAIResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.API_KEY || '';
if (!apiKey) {
    console.warn('API_KEY is not set. AI features will not work.');
}
const genAI = apiKey ? new generative_ai_1.GoogleGenerativeAI(apiKey) : null;
const modelFlash = 'gemini-1.5-flash'; // Use supported model
const generateAIResponse = async (prompt, model = modelFlash) => {
    if (!genAI) {
        throw new Error('AI service not configured');
    }
    const modelInstance = genAI.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
exports.generateAIResponse = generateAIResponse;
// Mock data for Skill Gap Analysis (fast fallback)
const getMockSkillGap = (targetRole) => {
    const roleLower = targetRole.toLowerCase();
    let missingSkills = [];
    let matchScore = 65;
    let roleFit = `Your resume shows good foundational skills for ${targetRole}, but there are some key areas to strengthen.`;
    if (roleLower.includes('backend') || roleLower.includes('full stack')) {
        missingSkills = [
            { skill: 'Microservices Architecture', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=microservices' },
            { skill: 'Docker & Kubernetes', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=docker%20kubernetes' },
            { skill: 'System Design Patterns', platform: 'NPTEL', courseLink: 'https://nptel.ac.in/courses/search?query=system%20design' },
            { skill: 'RESTful API Design', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=rest%20api' }
        ];
        matchScore = 68;
        roleFit = `Strong backend fundamentals detected. Focus on distributed systems and cloud deployment to excel as a ${targetRole}.`;
    }
    else if (roleLower.includes('frontend')) {
        missingSkills = [
            { skill: 'React Advanced Patterns', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=react%20advanced' },
            { skill: 'TypeScript Mastery', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=typescript' },
            { skill: 'Performance Optimization', platform: 'NPTEL', courseLink: 'https://nptel.ac.in/courses/search?query=web%20performance' },
            { skill: 'State Management (Redux/Zustand)', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=redux' }
        ];
        matchScore = 72;
        roleFit = `Good frontend skills present. Enhance your React ecosystem knowledge and performance optimization techniques.`;
    }
    else if (roleLower.includes('data') || roleLower.includes('machine learning')) {
        missingSkills = [
            { skill: 'Deep Learning Frameworks', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=deep%20learning' },
            { skill: 'Big Data Processing (Spark)', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=apache%20spark' },
            { skill: 'ML Model Deployment', platform: 'NPTEL', courseLink: 'https://nptel.ac.in/courses/search?query=machine%20learning' },
            { skill: 'Statistical Analysis', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=statistics' }
        ];
        matchScore = 60;
        roleFit = `Solid data science foundation. Strengthen ML model deployment and big data processing skills for production readiness.`;
    }
    else {
        missingSkills = [
            { skill: 'Cloud Computing (AWS/GCP)', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=aws' },
            { skill: 'CI/CD Pipelines', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=ci%20cd' },
            { skill: 'Infrastructure as Code', platform: 'NPTEL', courseLink: 'https://nptel.ac.in/courses/search?query=devops' },
            { skill: 'Monitoring & Logging', platform: 'Coursera', courseLink: 'https://www.coursera.org/search?query=monitoring' }
        ];
        matchScore = 65;
        roleFit = `Good technical background. Focus on cloud platforms and automation tools to excel in ${targetRole} role.`;
    }
    return {
        matchScore,
        roleFit,
        recommendations: [
            `Complete 2-3 courses from the missing skills list within the next 2 months.`,
            `Build a portfolio project showcasing ${targetRole} skills using the recommended technologies.`,
            `Participate in open-source projects or contribute to relevant GitHub repositories.`
        ],
        missingSkills
    };
};
const analyzeSkillGapService = async (resumeInput, targetRole) => {
    try {
        if (!genAI || !apiKey || apiKey === 'your_google_gemini_api_key_here') {
            console.warn('API key not configured. Using fast mock data for Skill Gap Analysis.');
            await new Promise(resolve => setTimeout(resolve, 800));
            return getMockSkillGap(targetRole);
        }
        const prompt = `Analyze resume for "${targetRole}" role. Return JSON:
- matchScore (0-100)
- roleFit (1 sentence)
- recommendations (3 bullet points)
- missingSkills: [{skill, platform: "Coursera"|"NPTEL", courseLink: "https://www.coursera.org/search?query=SKILL"}]`;
        const contents = [{ text: prompt }];
        if (resumeInput.mimeType === 'application/pdf') {
            contents.push({
                inlineData: {
                    mimeType: resumeInput.mimeType,
                    data: resumeInput.content
                }
            });
        }
        else {
            contents.push({ text: `Resume:\n${resumeInput.content}` });
        }
        const modelInstance = genAI.getGenerativeModel({ model: modelFlash });
        const result = await modelInstance.generateContent({ contents });
        const response = await result.response;
        const text = response.text();
        try {
            return JSON.parse(text);
        }
        catch (parseError) {
            console.error('Failed to parse AI response as JSON:', text);
            return getMockSkillGap(targetRole);
        }
    }
    catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        return getMockSkillGap(targetRole);
    }
};
exports.analyzeSkillGapService = analyzeSkillGapService;
