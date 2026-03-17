
import React, { useState, useRef, useEffect } from 'react';
import { getLabExperiment } from '../services/geminiServices';
import { Play, Loader2, ChevronDown, Trophy, Star, AlertCircle, CheckCircle, TrendingUp, Target, Users, Zap, Edit3, Award, Code2, BarChart3, Briefcase } from 'lucide-react';

const RECRUITMENT_DRIVES = [
    { name: 'Full-Stack Developer - 2025', icon: Code2 },
    { name: 'Data Scientist - ML Focus', icon: BarChart3 },
    { name: 'Backend Engineer - Java/Node.js', icon: Code2 },
    { name: 'DevOps Engineer - AWS/Kubernetes', icon: Briefcase },
    { name: 'Frontend Developer - React/Vue', icon: Code2 },
    { name: 'Custom Job Profile', icon: Edit3 }
];

interface ATSData {
    totalCandidates: number;
    duplicateResumesDetected: boolean;
    duplicateWarning: string;
    topFiveCandidates: Array<{
        candidateId: string;
        name: string;
        atsScore: number;
        matchedKeywords: string[];
        missingKeywords: string[];
        strengths: string[];
        recommendations: string[];
    }>;
    topThreeCandidates: string[];
    keywordAnalysis: {
        mostCommonSkills: string[];
        skillGaps: string[];
        jobDescriptionKeywords: string[];
    };
}

const VirtualLab: React.FC = () => {
    const [topic, setTopic] = useState('Full-Stack Developer - 2025');
    const [atsData, setAtsData] = useState<ATSData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSimulate = async () => {
        if (!topic.trim()) {
            alert('Please select a recruitment drive or job profile.');
            return;
        }
        setLoading(true);
        setAtsData(null);
        try {
            const data = await getLabExperiment(topic);
            if (data && data.topFiveCandidates && data.topFiveCandidates.length > 0) {
                setAtsData(data);
            } else {
                throw new Error('Invalid ATS data');
            }
        } catch(e: any) {
            console.error('ATS ranking error:', e);
            alert('Error loading ATS ranking data. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleTopicSelect = async (selectedTopic: string) => {
        if (selectedTopic.includes('Custom')) {
            setTopic('');
            inputRef.current?.focus();
        } else {
            setTopic(selectedTopic);
            setShowDropdown(false);
            setLoading(true);
            setAtsData(null);
            try {
                const data = await getLabExperiment(selectedTopic);
                if (data && data.topFiveCandidates && data.topFiveCandidates.length > 0) {
                    setAtsData(data);
                }
            } catch(e: any) {
                console.error('Auto-generate error:', e);
            } finally {
                setLoading(false);
            }
        }
    };

    const currentIcon = RECRUITMENT_DRIVES.find(l => l.name === topic)?.icon || Code2;
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 85) return 'bg-green-50';
        if (score >= 70) return 'bg-blue-50';
        if (score >= 50) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-900 rounded-lg">
                    <Trophy className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">ATS-Based Candidate Ranking</h2>
                    <p className="text-slate-500">Automatically shortlist and rank resumes based on ATS score and keyword optimization.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
                {/* Toolbar */}
                <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full relative" ref={dropdownRef}>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Select Recruitment Drive</label>
                         <div className="relative">
                            <div className="absolute left-3 top-3 text-slate-500">
                                {React.createElement(currentIcon, { className: "h-5 w-5" })}
                            </div>
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full bg-white text-slate-900 border border-slate-300 pl-10 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium shadow-sm"
                                placeholder="Search or type job profile..."
                            />
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                <ChevronDown className="h-5 w-5" />
                            </button>
                         </div>
                         
                         {showDropdown && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
                                <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-50 border-b border-slate-100">
                                    Recruitment Drives
                                </div>
                                {RECRUITMENT_DRIVES.map((lab) => (
                                    <button
                                        key={lab.name}
                                        onClick={() => handleTopicSelect(lab.name)}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                                    >
                                        {React.createElement(lab.icon, { className: `h-4 w-4 ${lab.name.includes('Custom') ? 'text-indigo-600' : 'opacity-50'}` })}
                                        {lab.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleSimulate}
                        disabled={loading}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-indigo-200 mt-6 md:mt-0"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />} 
                        Rank Candidates
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-50 p-6 md:p-10 overflow-auto">
                    {!atsData && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                                <Trophy className="h-10 w-10 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Rank Candidates</h3>
                            <p className="text-slate-400 max-w-md text-center">Upload resumes for a recruitment drive and get AI-powered ATS ranking with detailed analysis of each candidate.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                            <p className="text-slate-600 font-medium animate-pulse">Analyzing resumes with ATS scoring...</p>
                        </div>
                    )}

                    {atsData && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            {/* Duplicate Warning */}
                            {atsData.duplicateResumesDetected && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-amber-900">Duplicate Resumes Detected</h4>
                                        <p className="text-sm text-amber-800">{atsData.duplicateWarning}</p>
                                    </div>
                                </div>
                            )}

                            {/* Top 3 Summary */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                    <Star className="h-5 w-5" /> Top 3 Recommended Candidates
                                </h3>
                                <div className="space-y-2">
                                    {atsData.topThreeCandidates.map((candidate, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                                            <Award className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium text-slate-700">{idx + 1}. {candidate}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top 5 Candidates Detailed View */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5" /> Top 5 Candidates Analysis
                                </h3>
                                <div className="space-y-4">
                                    {atsData.topFiveCandidates.map((candidate, idx) => (
                                        <div key={candidate.candidateId} className={`rounded-lg border-2 overflow-hidden ${getScoreBgColor(candidate.atsScore)}`}>
                                            {/* Header with Score */}
                                            <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-500">#{idx + 1}</span>
                                                        <h4 className="text-lg font-bold text-slate-800">{candidate.name}</h4>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">ID: {candidate.candidateId}</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-3xl font-bold ${getScoreColor(candidate.atsScore)}`}>{candidate.atsScore}</div>
                                                    <div className="text-xs font-semibold text-slate-500">ATS Score</div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-4">
                                                {/* Matched Keywords */}
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4 text-green-600" /> Matched Keywords
                                                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.matchedKeywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                                                {kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Missing Keywords */}
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4 text-orange-600" /> Missing Keywords
                                                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.missingKeywords.map((kw, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
                                                                {kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Strengths */}
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <TrendingUp className="h-4 w-4 text-blue-600" /> Key Strengths
                                                    </h5>
                                                    <ul className="space-y-1">
                                                        {candidate.strengths.map((strength, i) => (
                                                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                                                {strength}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Recommendations */}
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <Target className="h-4 w-4 text-purple-600" /> Recommendations
                                                    </h5>
                                                    <ul className="space-y-1">
                                                        {candidate.recommendations.map((rec, i) => (
                                                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                                <span className="text-purple-600 font-bold mt-0.5">→</span>
                                                                {rec}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Keyword Analysis */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-yellow-500" /> Most Common Skills
                                    </h4>
                                    <div className="space-y-2">
                                        {atsData.keywordAnalysis.mostCommonSkills.map((skill, i) => (
                                            <span key={i} className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium mr-2 mb-2">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" /> Skill Gaps
                                    </h4>
                                    <div className="space-y-2">
                                        {atsData.keywordAnalysis.skillGaps.map((gap, i) => (
                                            <div key={i} className="text-xs text-slate-700 bg-red-50 p-2 rounded border border-red-100">
                                                {gap}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Code2 className="h-4 w-4 text-indigo-500" /> Job Description Keywords
                                    </h4>
                                    <div className="space-y-2">
                                        {atsData.keywordAnalysis.jobDescriptionKeywords.map((keyword, i) => (
                                            <span key={i} className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium mr-2 mb-2">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VirtualLab;
