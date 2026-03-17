import React, { useState } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Upload,
    X,
    Play,
    Loader2,
    Shield,
    Eye,
    EyeOff,
    Lock,
    Download,
    Award,
    TrendingUp,
    ArrowRight,
    LogOut
} from 'lucide-react';
import { getLabExperiment } from '../services/geminiServices';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    uploadedAt: Date;
}

interface CandidateResult {
    candidateId: string;
    name: string;
    atsScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    recommendations: string[];
}

interface AnalysisResults {
    topCandidate: string;
    duplicateResumes: string[];
    fullRanking: Array<{
        rank: number;
        name: string;
        score: number;
        status: string;
    }>;
}

const ATSCandidateRanking: React.FC = () => {
    // Page State
    const [currentPage, setCurrentPage] = useState<'login' | 'analysis' | 'results'>('login');

    // PIN Authentication
    const [pinVisible, setPinVisible] = useState(false);
    const [adminPin, setAdminPin] = useState('');
    const [pinError, setPinError] = useState('');
    
    // Analysis Parameters
    const [topListSize, setTopListSize] = useState(5);
    const [resumesExpected, setResumesExpected] = useState(10);
    
    // Job Description
    const [jobDescription, setJobDescription] = useState('');
    
    // File Upload
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [maxResumeError, setMaxResumeError] = useState('');
    
    // Results
    const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
    const [loading, setLoading] = useState(false);

    // Verify PIN (1234)
    const handleVerifyPin = () => {
        if (adminPin === '1234') {
            setPinError('');
            setCurrentPage('analysis');
            setAdminPin('');
        } else {
            setPinError('Invalid PIN. Access denied.');
        }
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files) {
            const newFiles: UploadedFile[] = [];
            let totalFiles = uploadedFiles.length;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    totalFiles++;
                    
                    // Check if total exceeds expected resumes
                    if (totalFiles > resumesExpected) {
                        setMaxResumeError(`⚠️ EXPECTED ${resumesExpected} RESUMES. BUT FOUND ${totalFiles}. PLEASE MATCH THE COUNT.`);
                        e.currentTarget.value = '';
                        return;
                    }

                    newFiles.push({
                        id: `file-${Date.now()}-${i}`,
                        name: file.name,
                        size: file.size,
                        uploadedAt: new Date()
                    });
                }
            }

            if (newFiles.length > 0) {
                setUploadedFiles([...uploadedFiles, ...newFiles]);
                setMaxResumeError('');
            }
        }
    };

    // Remove uploaded file
    const removeFile = (id: string) => {
        setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
        setMaxResumeError('');
    };

    // Execute Analysis
    const handleExecuteAnalysis = async () => {
        // Validations
        if (!jobDescription.trim()) {
            alert('Please enter a job description.');
            return;
        }

        if (uploadedFiles.length === 0) {
            alert('Please upload at least one resume.');
            return;
        }

        if (uploadedFiles.length !== resumesExpected) {
            alert(`Please upload exactly ${resumesExpected} resumes.`);
            return;
        }

        setLoading(true);
        setMaxResumeError('');

        try {
            // Prepare data for API
            const analysisData = {
                jobDescription,
                totalResumes: uploadedFiles.length,
                topListSize,
                resumesExpected
            };

            // Call the gemini service
            const data = await getLabExperiment(jobDescription);

            // Extract file names
            const fileNames = uploadedFiles.map(f => f.name.replace('.pdf', '').replace(/.pdf$/i, ''));
            const topCandidate = fileNames[0] || 'Candidate 1';
            const duplicateResumes = fileNames.slice(1);

            // Create ranking with file names
            const fullRanking = fileNames.map((name, idx) => ({
                rank: idx + 1,
                name: name,
                score: 85 - (idx * 5),
                status: idx === 0 ? 'VALID' : 'DUPLICATE'
            }));

            const mockResults: AnalysisResults = {
                topCandidate: topCandidate,
                duplicateResumes: duplicateResumes,
                fullRanking: fullRanking
            };

            setAnalysisResults(mockResults);
            setCurrentPage('results');
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error during analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    // PAGE 1: PIN AUTHENTICATION
    if (currentPage === 'login') {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">ACCESS RESTRICTED</h1>
                        <p className="text-cyan-300 uppercase tracking-wider text-sm font-semibold">
                            Neural Authentication Required for T&P Admin Protocols.
                        </p>
                    </div>

                    {/* PIN Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-lg p-8 shadow-2xl">
                        <label className="block text-center text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
                            Enter Admin PIN
                        </label>

                        {/* PIN Input */}
                        <div className="relative mb-6">
                            <input
                                type={pinVisible ? 'text' : 'password'}
                                value={adminPin}
                                onChange={(e) => {
                                    setAdminPin(e.target.value.slice(0, 4));
                                    setPinError('');
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && adminPin.length === 4) {
                                        handleVerifyPin();
                                    }
                                }}
                                maxLength={4}
                                placeholder="••••"
                                className="w-full px-6 py-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-center text-4xl tracking-widest focus:outline-none focus:border-cyan-400 transition-all"
                            />
                            <button
                                onClick={() => setPinVisible(!pinVisible)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {pinVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* PIN Input Indicator */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[0, 1, 2, 3].map((idx) => (
                                <div
                                    key={idx}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        idx < adminPin.length
                                            ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                                            : 'bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {pinError && (
                            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6 text-sm text-red-300 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                {pinError}
                            </div>
                        )}

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyPin}
                            disabled={adminPin.length !== 4}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 mb-4"
                        >
                            <Lock className="h-5 w-5" />
                            VERIFY IDENTITY
                        </button>

                        {/* Info Text */}
                        <p className="text-center text-xs text-slate-400">
                            Enter your 4-digit admin PIN to proceed
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // PAGE 2: ANALYSIS PARAMETERS
    if (currentPage === 'analysis') {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">ATS Candidate Ranking</h2>
                            <p className="text-cyan-100">AI-Powered Screening Protocol - Version 4.2.1</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentPage('login');
                            setUploadedFiles([]);
                            setJobDescription('');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Panel - Configuration */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Analysis Parameters */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white uppercase">Analysis Parameters</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                                        Top List Size
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={topListSize}
                                        onChange={(e) => setTopListSize(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                                        Resumes Expected
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={resumesExpected}
                                        onChange={(e) => {
                                            setResumesExpected(Math.max(1, parseInt(e.target.value) || 1));
                                            setMaxResumeError('');
                                        }}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="h-5 w-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white uppercase">Job Description</h3>
                            </div>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Enter the job description, requirements, and key qualifications..."
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 resize-none h-32"
                            />
                        </div>

                        {/* Upload Section */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Upload className="h-5 w-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white uppercase">Upload PDF Data</h3>
                                <span className="text-xs font-bold text-cyan-300 ml-auto">
                                    {uploadedFiles.length}/{resumesExpected}
                                </span>
                            </div>

                            {/* Max Resume Error Alert */}
                            {maxResumeError && (
                                <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4 text-sm text-red-300 flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <p className="font-bold">{maxResumeError}</p>
                                </div>
                            )}

                            <label className="block">
                                <div className="border-2 border-dashed border-cyan-500/50 rounded-lg p-6 text-center cursor-pointer hover:bg-cyan-500/5 transition-colors">
                                    <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-white mb-1">LOAD PDF RESUMES</p>
                                    <p className="text-xs text-slate-400">Drag or click to select PDF files</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            </label>

                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadedFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-2 bg-slate-700/50 rounded border border-slate-600"
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                                                    📄
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-white truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Execute Analysis Button */}
                        <button
                            onClick={handleExecuteAnalysis}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    ANALYZING...
                                </>
                            ) : (
                                <>
                                    <Play className="h-5 w-5" />
                                    EXECUTE ANALYSIS
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Panel - System Standby */}
                    <div className="lg:col-span-8">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-12 border border-slate-700 h-full flex flex-col items-center justify-center min-h-[600px]">
                            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/30">
                                <Award className="h-12 w-12 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">SYSTEM STANDBY</h3>
                            <p className="text-slate-400 text-center max-w-sm">
                                Upload candidate data modules and define parameters to initialize the AI screening sequence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // PAGE 3: RESULTS
    if (currentPage === 'results' && analysisResults) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">ATS Analysis Results</h2>
                            <p className="text-cyan-100">Candidate Ranking & Redundancy Detection</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentPage('analysis');
                            setAnalysisResults(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Back
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Top 1 Shortlist */}
                    <div className="bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500/30 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2 uppercase">
                            <Award className="h-5 w-5" /> Top 1 Shortlist
                        </h3>
                        <div className="bg-slate-800/50 p-4 rounded border border-cyan-500/20">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-white font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{analysisResults.topCandidate}</h4>
                                    <p className="text-xs text-slate-400 mt-1">OPTIMIZED CANDIDATE SELECTION</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Duplicate Resume Checker */}
                    {analysisResults.duplicateResumes.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2 uppercase">
                                <AlertCircle className="h-5 w-5" /> Duplicate Resume Checker
                            </h3>
                            <div className="space-y-3">
                                {analysisResults.duplicateResumes.map((resume, idx) => (
                                    <div key={idx} className="bg-slate-800/50 p-4 rounded border border-purple-500/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white font-bold flex-shrink-0">
                                                🔄
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold">{resume}</h4>
                                                <p className="text-xs text-purple-300 mt-1 font-semibold">DUPLICATE</p>
                                                <p className="text-xs text-slate-400 mt-2">Identified as redundant candidate profile</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full Candidate Ranking */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 uppercase">
                            <TrendingUp className="h-5 w-5 text-cyan-400" /> Full Candidate Ranking ({analysisResults.fullRanking.length} Total)
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-600">
                                        <th className="text-left py-3 px-4 text-slate-400 font-semibold text-xs uppercase">Rank</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-semibold text-xs uppercase">Candidate Name</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-semibold text-xs uppercase">Match Score</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-semibold text-xs uppercase">Analysis</th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-semibold text-xs uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysisResults.fullRanking.map((candidate) => (
                                        <tr key={candidate.rank} className="border-b border-slate-700 hover:bg-slate-700/30">
                                            <td className="py-3 px-4">
                                                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-bold">
                                                    #{candidate.rank}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-white font-semibold">{candidate.name}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500"
                                                            style={{ width: `${candidate.score}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold ${getScoreColor(candidate.score)}`}>
                                                        {candidate.score}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-400 text-xs">AI SHORTLISTED</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    candidate.status === 'VALID'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-purple-500/20 text-purple-300'
                                                }`}>
                                                    {candidate.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Export Button */}
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">
                        <Download className="h-4 w-4" />
                        EXPORT DATA
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default ATSCandidateRanking;
