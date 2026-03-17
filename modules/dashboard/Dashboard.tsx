
// @ts-nocheck
// Dashboard lives outside the client directory; skip type checking here to avoid
// resolution issues during build.  Imports from client/types require navigating
// up two folders then into client.
import React, { useState, useEffect } from 'react';
import { User, View, StudentAcademicHistory } from '../../client/types';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowRight, 
  Users, 
  Activity, 
  Award, 
  BookOpen,
  AlertCircle,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Shield,
  Zap,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  FileText,
  Briefcase,
  Beaker,
  Upload,
  Sparkles,
  ZapOff
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Moon, Sun } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: View) => void;
  onNavigateWithProfile?: (profile: StudentAcademicHistory) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onNavigateWithProfile, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample data for charts
  const engagementData = [
    { day: 'Mon', engagement: 0, average: 0 },
    { day: 'Tue', engagement: 0, average: 0 },
    { day: 'Wed', engagement: 0, average: 0 },
    { day: 'Thu', engagement: 0, average: 0 },
    { day: 'Fri', engagement: 0, average: 0 }
  ];

  const riskData = [
    { subject: 'Attendance', A: 0, fullMark: 100 },
    { subject: 'Grades', A: 0, fullMark: 100 },
    { subject: 'Engagement', A: 0, fullMark: 100 },
    { subject: 'Assignments', A: 0, fullMark: 100 },
    { subject: 'Lab Work', A: 0, fullMark: 100 }
  ];

  const skillMatrixData = [
    { skill: 'React', proficiency: 88, market: 92 },
    { skill: 'Testing', proficiency: 72, market: 85 },
    { skill: 'TypeScript', proficiency: 85, market: 90 },
    { skill: 'Node.js', proficiency: 78, market: 88 },
    { skill: 'Cloud (AWS)', proficiency: 70, market: 80 },
    { skill: 'System Design', proficiency: 65, market: 75 }
  ];

  const scoreGrowthData = [
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 75 },
    { month: 'Apr', score: 78 },
    { month: 'May', score: 82 }
  ];

  const trendingSkills = [
    { name: 'Next.js 15', trend: '+45%', color: 'bg-blue-500' },
    { name: 'AI Integration', trend: '+120%', color: 'bg-purple-500' },
    { name: 'Rust', trend: '+28%', color: 'bg-orange-500' }
  ];

  const topJobMatches = [
    { title: 'Senior Frontend Engineer', company: 'Vercel', location: 'Remote', salary: '$180k - $220k', match: 94 },
    { title: 'Full Stack Developer', company: 'Stripe', location: 'San Francisco', salary: '$190k+', match: 89 },
    { title: 'Product Engineer', company: 'Linear', location: 'Remote', salary: '$170k - $210k', match: 86 }
  ];

  const resumeSuggestions = [
    { type: 'CONTENT', impact: 'HIGH IMPACT', suggestion: 'Add more quantitative results to your experience at TechCorp' },
    { type: 'KEYWORDS', impact: 'MEDIUM IMPACT', suggestion: 'Missing "Docker" or "Kubernetes" keywords for Senior roles.' },
    { type: 'FORMAT', impact: 'LOW IMPACT', suggestion: 'Resume length is optimal (1.5 pages).' }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} p-6`}>
      {/* Theme Toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
              : 'bg-white shadow-lg hover:shadow-xl text-indigo-600'
          }`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className={`rounded-2xl p-8 transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border border-slate-800' 
            : 'bg-gradient-to-r from-white via-blue-50 to-white shadow-lg border border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-5xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome back, {user.name}!
              </h1>
              <p className={`text-lg transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Monitor your resume and career growth in real-time
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate('projects')} 
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                }`}
              >
                <FileText className="h-5 w-5" />
                Projects
              </button>
              <button 
                onClick={() => onNavigate('interview')} 
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                }`}
              >
                <Briefcase className="h-5 w-5" />
                Interview
              </button>
            </div>
          </div>
        </div>

        {/* Top Metrics - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ATS Score */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group transform ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 hover:border-emerald-500 shadow-xl'
              : 'bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 hover:shadow-2xl shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <TrendingUp className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h3 className={`text-4xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>88</h3>
            <p className={`text-sm transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>ATS Match Score</p>
            <p className={`text-xs mt-2 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Optimized for FAANG</p>
          </div>

          {/* Market Value */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 hover:border-blue-500 shadow-xl'
              : 'bg-gradient-to-br from-white to-blue-50 border border-blue-200 hover:shadow-2xl shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Award className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isDark 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-blue-200 text-blue-700'
              }`}>TOP 1%</span>
            </div>
            <h3 className={`text-4xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>$195k</h3>
            <p className={`text-sm transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Market Value</p>
            <p className={`text-xs mt-2 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Based on skill set</p>
          </div>

          {/* Job Matches */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-orange-500/30 hover:border-orange-500 shadow-xl'
              : 'bg-gradient-to-br from-white to-orange-50 border border-orange-200 hover:shadow-2xl shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <Briefcase className={`h-6 w-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isDark 
                  ? 'bg-orange-500/20 text-orange-300' 
                  : 'bg-orange-200 text-orange-700'
              }`}>↗ NEW</span>
            </div>
            <h3 className={`text-4xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>24</h3>
            <p className={`text-sm transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Job Matches</p>
            <p className={`text-xs mt-2 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Active this week</p>
          </div>

          {/* Trending Skills */}
          <div className={`rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-500/30 hover:border-yellow-500 shadow-xl'
              : 'bg-gradient-to-br from-white to-yellow-50 border border-yellow-200 hover:shadow-2xl shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>TRENDING SKILLS</span>
              <Sparkles className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <div className="space-y-2">
              {trendingSkills.slice(0, 2).map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{skill.name}</span>
                  <span className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{skill.trend}</span>
                </div>
              ))}
              <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{trendingSkills[2].name}</span>
                <span className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{trendingSkills[2].trend}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Matrix */}
        <div className={`rounded-2xl p-8 transition-all duration-300 ${
          isDark
            ? 'bg-slate-900 border border-slate-800 shadow-2xl'
            : 'bg-white border border-slate-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Skill Matrix</h3>
              <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Proficiency vs Market Demand</p>
            </div>
            <Zap className={`h-6 w-6 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillMatrixData}>
              <PolarGrid stroke={isDark ? '#475569' : '#e2e8f0'} />
              <PolarAngleAxis dataKey="skill" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={isDark ? '#475569' : '#e2e8f0'} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <Radar 
                name="Proficiency" 
                dataKey="proficiency" 
                stroke={isDark ? '#3b82f6' : '#0ea5e9'} 
                fill={isDark ? '#3b82f6' : '#0ea5e9'} 
                fillOpacity={isDark ? 0.6 : 0.3} 
              />
              <Radar 
                name="Market Demand" 
                dataKey="market" 
                stroke={isDark ? '#8b5cf6' : '#a78bfa'} 
                fill={isDark ? '#8b5cf6' : '#a78bfa'} 
                fillOpacity={isDark ? 0.2 : 0.1} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Growth */}
        <div className={`rounded-2xl p-8 transition-all duration-300 ${
          isDark
            ? 'bg-slate-900 border border-slate-800 shadow-2xl'
            : 'bg-white border border-slate-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Score Growth</h3>
              <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Resume optimization journey</p>
            </div>
            <TrendingUp className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#e2e8f0'} />
              <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#94a3b8'} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={isDark ? '#3b82f6' : '#0ea5e9'} 
                strokeWidth={3}
                dot={{ fill: isDark ? '#3b82f6' : '#0ea5e9', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Optimizer & Top Job Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Optimizer */}
        <div className={`rounded-2xl p-8 transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 border border-purple-500/30 shadow-2xl'
            : 'bg-gradient-to-br from-white via-purple-50 to-white border border-purple-200 shadow-lg'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Sparkles className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Optimizer</h3>
          </div>
          <div className="space-y-4">
            {resumeSuggestions.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                  : 'bg-slate-50 border-slate-300 hover:border-purple-300'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                    isDark 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>{item.type}</span>
                  <span className={`text-xs font-bold ${
                    item.impact === 'HIGH IMPACT' ? (isDark ? 'text-red-400' : 'text-red-600') :
                    item.impact === 'MEDIUM IMPACT' ? (isDark ? 'text-yellow-400' : 'text-yellow-600') : 
                    (isDark ? 'text-blue-400' : 'text-blue-600')
                  }`}>{item.impact}</span>
                </div>
                <p className={`text-sm transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Job Matches */}
        <div className={`lg:col-span-2 rounded-2xl p-8 transition-all duration-300 ${
          isDark
            ? 'bg-slate-900 border border-slate-800 shadow-2xl'
            : 'bg-white border border-slate-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Job Matches</h3>
            <button className={`text-sm font-bold transition-all hover:gap-2 flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {topJobMatches.map((job, idx) => (
              <div key={idx} className={`p-5 rounded-xl border transition-all hover:scale-102 cursor-pointer ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/70'
                  : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-slate-100'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`text-base font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{job.title}</h4>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{job.company}</span>
                      <MapPin className={`h-3 w-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold transition-colors ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{job.match}%</div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>MATCH</div>
                  </div>
                </div>
                <div className={`text-base font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{job.salary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Resume CTA */}
      <div className={`rounded-2xl p-10 text-center transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-blue-950 via-purple-950 to-blue-950 border border-purple-500/30 shadow-2xl shadow-purple-500/20'
          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl shadow-indigo-500/30'
      }`}>
        <h3 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-white'}`}>📄 Ready to Stand Out?</h3>
        <p className={`text-lg mb-6 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-blue-50'}`}>
          Upload your latest resume to refresh match scores and get AI-powered career insights
        </p>
        <button 
          onClick={() => onNavigate('notes')} 
          className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all hover:scale-105 transform ${
            isDark
              ? 'bg-white text-purple-600 hover:bg-slate-100 shadow-lg'
              : 'bg-white text-indigo-600 hover:bg-slate-100 shadow-lg'
          }`}
        >
          <Upload className="h-5 w-5" />
          Upload Resume
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Projects', hint: 'Showcase work', action: 'projects', colorDark: 'from-blue-600 to-blue-700', colorLight: 'from-blue-500 to-blue-600' },
          { icon: FileText, label: 'Notes', hint: 'Quick notes', action: 'notes', colorDark: 'from-emerald-600 to-emerald-700', colorLight: 'from-emerald-500 to-emerald-600' },
          { icon: Briefcase, label: 'Interview', hint: 'Practice', action: 'interview', colorDark: 'from-orange-600 to-orange-700', colorLight: 'from-orange-500 to-orange-600' },
          { icon: Beaker, label: 'Labs', hint: 'Learn', action: 'lab', colorDark: 'from-purple-600 to-purple-700', colorLight: 'from-purple-500 to-purple-600' }
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => onNavigate(item.action as View)}
            className={`p-6 rounded-xl transition-all hover:scale-105 group ${
              isDark
                ? `bg-gradient-to-br ${item.colorDark} border border-slate-700 shadow-xl hover:shadow-2xl`
                : `bg-gradient-to-br ${item.colorLight} border border-slate-300 shadow-lg hover:shadow-2xl`
            }`}
          >
            <item.icon className="h-8 w-8 text-white mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-white">{item.label}</div>
            <div className="text-xs text-white/80">{item.hint}</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className={`border-t py-8 text-center transition-colors ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-600'
      }`}>
        <p className="font-medium">© 2025 EduBridge Learning Solutions Pvt Ltd. All rights reserved.</p>
      </footer>
      </div>
    </div>
  );
};

export default Dashboard;
