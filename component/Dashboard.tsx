
import React, { useState, useEffect } from 'react';
import { User, View, StudentAcademicHistory } from '../types';
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
  Beaker
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';

interface DashboardProps {
  onNavigate: (view: View) => void;
  onNavigateWithProfile?: (profile: StudentAcademicHistory) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onNavigateWithProfile, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const peerComparisonData = [
    { month: 'Jan', score: 0 },
    { month: 'Feb', score: 0 },
    { month: 'Mar', score: 0 },
    { month: 'Apr', score: 0 },
    { month: 'May', score: 0 }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDateOnly = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
        <div className="card-inner">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar + circular readiness */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="#eef2ff" strokeWidth="16" fill="transparent" />
                  <circle cx="80" cy="80" r="70" stroke="#6366f1" strokeWidth="16" fill="transparent" strokeDasharray="439.82" strokeDashoffset={439.82 - (439.82 * 0) / 100} className="transition-all duration-700 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, {user.name}!</h1>
                <p className="text-slate-600 mt-1">
                  Your personalized dashboard for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
                </p>
                <div className="mt-3 text-sm text-slate-500">Overall Readiness: <span className="font-semibold">0%</span></div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{formatTime(currentTime)}</div>
              <div className="text-sm text-slate-600 mt-1">{formatDateOnly(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick summary strip */}
      <div className="flex gap-3 overflow-x-auto py-2 mobile-scrollbar">
        <div className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Attendance</div>
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs text-slate-400">Monthly average</div>
          </div>
          <Users className="h-6 w-6 text-blue-500" />
        </div>

        <div className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Attention</div>
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs text-slate-400">Session focus</div>
          </div>
          <Activity className="h-6 w-6 text-green-500" />
        </div>

        <div className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Placement Score</div>
            <div className="text-2xl font-bold">0%</div>
            <div className="text-xs text-slate-400">Industry-fit</div>
          </div>
          <Award className="h-6 w-6 text-purple-500" />
        </div>

        <div className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Pending Labs</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-slate-400">Due items</div>
          </div>
          <BookOpen className="h-6 w-6 text-orange-500" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button onClick={() => onNavigate('projects')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-rose-400 to-fuchsia-500 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><BookOpen className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Projects</div>
            <div className="text-xs opacity-80">Generate ideas</div>
          </div>
        </button>

        <button onClick={() => onNavigate('notes')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-amber-400 to-orange-500 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><FileText className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Notes</div>
            <div className="text-xs opacity-80">Convert & summarize</div>
          </div>
        </button>

        <button onClick={() => onNavigate('interview')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><Briefcase className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Mock Interview</div>
            <div className="text-xs opacity-80">Practice sessions</div>
          </div>
        </button>

        <button onClick={() => onNavigate('lab')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-sky-400 to-indigo-500 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><Beaker className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Industry Lab</div>
            <div className="text-xs opacity-80">Guides & workflows</div>
          </div>
        </button>

        <button onClick={() => onNavigate('mentor')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><Users className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Mentor</div>
            <div className="text-xs opacity-80">Get guidance</div>
          </div>
        </button>

        <button onClick={() => onNavigate('peers')} className="flex items-center gap-3 p-4 rounded-lg text-white bg-gradient-to-r from-teal-400 to-cyan-500 shadow-md hover:scale-105 transform transition">
          <div className="p-3 bg-white/20 rounded-md"><Users className="h-5 w-5 text-white" /></div>
          <div className="text-left">
            <div className="text-sm font-semibold">Peer Match</div>
            <div className="text-xs opacity-80">Find study partners</div>
          </div>
        </button>
      </div>

      {/* Tech Accelerator Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">Premium Feature</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Tech Accelerator</h3>
          <p className="text-orange-100 mb-4 max-w-2xl">
            Unlock company-specific fit analysis and boost your career.
          </p>
          <button
            onClick={() => onNavigate('tech-accelerator')}
            className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            Upgrade to Premium <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Early Warning Notice Card - Large Hero */}
      <div className="mt-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => { const prefill: StudentAcademicHistory = { previousPercentage: 0, activeBacklogs: 0, performanceNotes: 'Previous semester: 0% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' }; if (onNavigateWithProfile) { onNavigateWithProfile(prefill); } else { onNavigate('early-warning'); } }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const prefill: StudentAcademicHistory = { previousPercentage: 0, activeBacklogs: 0, performanceNotes: 'Previous semester: 0% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' }; if (onNavigateWithProfile) { onNavigateWithProfile(prefill); } else { onNavigate('early-warning'); } } }}
          className="w-full rounded-xl p-8 shadow-lg relative overflow-hidden cursor-pointer bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 text-white transition-transform hover:-translate-y-1"
          aria-label="Open Early Warning Notice"
        >
          <div className="absolute left-6 top-6 bg-white/6 rounded-full p-3 backdrop-blur-sm">
            <Shield className="h-6 w-6 text-white/90" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">Early Warning Notice!</h3>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full font-semibold">AI WELL-BEING MONITOR</span>
              </div>
              <p className="mt-3 text-slate-200 max-w-3xl">Proactively identify silent mental, emotional, and social distress patterns through anonymized behavioral drift detection.</p>

              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => { const prefill: StudentAcademicHistory = { previousPercentage: 0, activeBacklogs: 0, performanceNotes: 'Previous semester: 0% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' }; if (onNavigateWithProfile) { onNavigateWithProfile(prefill); } else { onNavigate('early-warning'); } }} className="bg-white text-violet-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:opacity-95">
                  <Zap className="h-4 w-4" />
                  Launch Analysis
                </button>
                <button onClick={() => { const prefill: StudentAcademicHistory = { previousPercentage: 0, activeBacklogs: 0, performanceNotes: 'Previous semester: 0% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' }; if (onNavigateWithProfile) { onNavigateWithProfile(prefill); } else { onNavigate('early-warning'); } }} className="text-sm text-white/90 bg-white/6 px-3 py-2 rounded-lg">View Details</button>
              </div>
            </div>

            <div className="hidden md:block w-56 h-24 bg-white/4 rounded-lg p-3">
              {/* Decorative/summary area - could contain sparkline or quick status */}
              <div className="text-xs text-white/90 font-medium">Latest Signal</div>
              <div className="mt-2 text-2xl font-bold">0%</div>
              <div className="text-xs text-white/70">Safe Zone — stable engagement</div>
            </div>
          </div>

          {/* Decorative bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
          <div className="card-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600">+0.0%</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">0%</h3>
            <p className="text-sm text-slate-600">Attendance</p>
          </div>
        </div>

        {/* Attention Span Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
          <div className="card-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-rose-600">0.0%</span>
                <TrendingDown className="h-5 w-5 text-rose-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">0%</h3>
            <p className="text-sm text-slate-600">Attention Span</p>
          </div>
        </div>

        {/* Placement Score Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
          <div className="card-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600">+0.0%</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">0%</h3>
            <p className="text-sm text-slate-600">Placement Score</p>
          </div>
        </div>

        {/* Pending Labs Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
          <div className="card-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-600">+0</span>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">0</h3>
            <p className="text-sm text-slate-600">Pending Labs</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classroom Engagement Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 rainbow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Classroom Engagement</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Weekly Report <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="engagement" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="average" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Analysis Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Risk Analysis</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View Details <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <Radar 
                name="Performance" 
                dataKey="A" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section - Integrity Monitor and Peer Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrity Monitor */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Integrity Monitor</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View Report <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Plagiarism Check */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Plagiarism Check</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Passed</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          {/* Tab Switching */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Tab Switching</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-600">2 Warnings</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Peer Comparison</h3>
            <select className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={peerComparisonData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Empowering Banner - At the end */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-8">Empowering India's Future Engineers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">100k+</div>
            <div className="text-sm text-blue-100 uppercase tracking-wide">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">500+</div>
            <div className="text-sm text-blue-100 uppercase tracking-wide">Partner Colleges</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">50+</div>
            <div className="text-sm text-blue-100 uppercase tracking-wide">MNC Hiring Partners</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
          <MapPin className="h-4 w-4" />
          <span>Used widely across Delhi, Mumbai, Bangalore, Hyderabad, Chennai & Vizag</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Tech Accelerator</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Skill Gap</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">MNC Trends</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Virtual Lab</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Project Ideas</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Connect</h4>
              <div className="flex gap-3 mb-4">
                <a href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Linkedin className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
                </a>
                <a href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Instagram className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
                </a>
                <a href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Twitter className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
                </a>
                <a href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Facebook className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
                </a>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-1">Toll Free: 1800-120-456-456</p>
                <p>Mon-Sat (9 AM - 9 PM)</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>© 2025 EduBridge Learning Solutions Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
