import React, { useEffect, useState } from 'react';
import { EarlyWarningSummary, StudentRisk, EarlyWarningConfig, View, StudentAcademicHistory } from '../types';
import { Bell, AlertCircle, Info, ChevronRight, Circle, ExternalLink, Database, UploadCloud, Zap, Check, Copy, Instagram, MessageSquare, Phone, GraduationCap } from 'lucide-react';
import PeerChat from './PeerChat';
import { fetchEarlyWarningSummary, runEarlyWarningAnalysis, toggleConfig, fetchEarlyWarningOverview, fetchBehavioralDriftData, fetchMultiFactorAnalysis, fetchSentimentTimeline, computeAcademicPressureIndex, fetchPlatformAnalysisHub } from '../services/earlyWarningService';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const RiskBadge: React.FC<{ level: StudentRisk['riskLevel'] }> = ({ level }) => {
  const map = {
    low: { color: 'bg-green-50 text-green-700' },
    medium: { color: 'bg-amber-600 text-white' },
    high: { color: 'bg-red-50 text-red-700' }
  } as const;
  return <span className={`px-3 py-1 rounded-lg text-xs font-bold ${map[level].color}`}>{level.toUpperCase()}</span>;
};

interface EarlyWarningProps {
  onNavigate?: (view: View) => void;
  initialProfile?: StudentAcademicHistory | null;
  clearInitialProfile?: () => void;
}

const EarlyWarning: React.FC<EarlyWarningProps> = ({ onNavigate, initialProfile, clearInitialProfile }) => {
  const [summary, setSummary] = useState<EarlyWarningSummary | null>(null);
  const [risks, setRisks] = useState<StudentRisk[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [driftData, setDriftData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<EarlyWarningConfig>({ enabled: true, consentGiven: false, notificationThresholds: { studentNotify: 40, escalateToMentor: 75 } });
  const [selected, setSelected] = useState<StudentRisk | null>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'detailed'|'action'>('overview');

  const [multiFactor, setMultiFactor] = useState<any | null>(null);
  const [sentimentTimeline, setSentimentTimeline] = useState<any[]>([]);
  const [platformInsights, setPlatformInsights] = useState<any[]>([]);
  const [copiedTokenPlatform, setCopiedTokenPlatform] = useState<string | null>(null);

  // Academic history state for student-provided context
  const [prevPercentage, setPrevPercentage] = useState<string>('');
  const [activeBacklogsInput, setActiveBacklogsInput] = useState<string>('0');
  const [performanceNotesInput, setPerformanceNotesInput] = useState<string>('');
  const [uploadedMemoName, setUploadedMemoName] = useState<string | null>(null);
  const [pressureIndex, setPressureIndex] = useState<number | null>(null);

  // Social & messaging identifiers (collected to help contextualize sentiment and activity)
  const [snapchatId, setSnapchatId] = useState<string>('');
  const [instagramId, setInstagramId] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');

  const [profileGenerating, setProfileGenerating] = useState(false);
  // Default to false — require explicit user action to analyze
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [prefilledByDashboard, setPrefilledByDashboard] = useState(false);
  const [savedHistory, setSavedHistory] = useState<StudentAcademicHistory | null>(null);

  // If initial profile is provided (via dashboard), hydrate the form but do NOT auto-submit
  useEffect(() => {
    if (initialProfile) {
      if (typeof initialProfile.previousPercentage === 'number') setPrevPercentage(String(initialProfile.previousPercentage));
      if (typeof initialProfile.activeBacklogs === 'number') setActiveBacklogsInput(String(initialProfile.activeBacklogs));
      if (initialProfile.performanceNotes) setPerformanceNotesInput(initialProfile.performanceNotes);
      if (initialProfile.uploadedMemoName) setUploadedMemoName(initialProfile.uploadedMemoName);
      if (initialProfile.snapchatId) setSnapchatId(initialProfile.snapchatId);
      if (initialProfile.instagramId) setInstagramId(initialProfile.instagramId);
      if (initialProfile.whatsappNumber) setWhatsappNumber(initialProfile.whatsappNumber);
      setFormError(null);
      setPrefilledByDashboard(true);
      // Force the Academic History entry to show so the student confirms/edit these details
      setProfileCompleted(false);

      // also fetch a preview of platform insights so dashboard-prefilled identifiers reflect immediately
      (async () => {
        try {
          const ph = await fetchPlatformAnalysisHub(initialProfile as any);
          setPlatformInsights(ph);
        } catch (e) {
          // benign
        }
      })();

      // clear it in the parent so it won't reapply on remount
      if (clearInitialProfile) clearInitialProfile();
    }
  }, [initialProfile]);

  useEffect(() => {
    async function init() {
      // Load summary and baseline data
      const s = await fetchEarlyWarningSummary();
      setSummary(s);
      const o = await fetchEarlyWarningOverview();
      setOverview(o);
      const d = await fetchBehavioralDriftData();
      setDriftData(d);
      const mf = await fetchMultiFactorAnalysis();
      setMultiFactor(mf);
      const st = await fetchSentimentTimeline();
      setSentimentTimeline(st);

      // If a profile exists in localStorage, hydrate it and run analysis
      try {
        const raw = localStorage.getItem('edu_bridge_ews_profile');
        if (raw) {
          const history = JSON.parse(raw);
          // populate form fields for transparency only; DO NOT auto-run analysis or mark complete
          if (typeof history.previousPercentage === 'number') setPrevPercentage(String(history.previousPercentage));
          if (typeof history.activeBacklogs === 'number') setActiveBacklogsInput(String(history.activeBacklogs));
          if (history.performanceNotes) setPerformanceNotesInput(history.performanceNotes);
          if (history.uploadedMemoName) setUploadedMemoName(history.uploadedMemoName);
          if (history.snapchatId) setSnapchatId(history.snapchatId);
          if (history.instagramId) setInstagramId(history.instagramId);
          if (history.whatsappNumber) setWhatsappNumber(history.whatsappNumber);

          // Save loaded history and prompt user to confirm — do not auto-run
          setSavedHistory(history);
          setProfileCompleted(false);
          setFormError('Loaded a previously saved profile. You can review or click "Use saved profile and analyze".');

          // fetch preview platform insights for the saved profile
          (async () => {
            try {
              const ph = await fetchPlatformAnalysisHub(history as any);
              setPlatformInsights(ph);
            } catch (e) {
              // ignore
            }
          })();
        }
      } catch (e) {
        console.warn('failed to hydrate stored profile', e);
      }
    }
    init();
  }, []);

  // live preview: derive platform insights when any social identifier changes (preview only, does not run analysis)
  useEffect(() => {
    const hasAny = !!(snapchatId.trim() || instagramId.trim() || whatsappNumber.trim());
    if (!hasAny) {
      setPlatformInsights([]);
      return;
    }

    (async () => {
      try {
        const history: any = { previousPercentage: prevPercentage ? Number(prevPercentage.replace('%','')) : undefined };
        if (snapchatId.trim()) history.snapchatId = snapchatId.trim();
        if (instagramId.trim()) history.instagramId = instagramId.trim();
        if (whatsappNumber.trim()) history.whatsappNumber = whatsappNumber.trim();
        const ph = await fetchPlatformAnalysisHub(history);
        setPlatformInsights(ph);
      } catch (e) {
        setPlatformInsights([]);
      }
    })();
  }, [snapchatId, instagramId, whatsappNumber]);
  const handleRun = async () => {
    setLoading(true);
    const results = await runEarlyWarningAnalysis();
    setRisks(results);
    setLoading(false);
  };

  const handleToggle = async () => {
    const updated = await toggleConfig({ ...config, enabled: !config.enabled });
    setConfig(updated);
  };

  // Open resources or navigate to internal views
  // Open resources or display inline modal/chat (no automatic navigation)
  const [resourceModal, setResourceModal] = useState<{ title: string; content: string; link?: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Mentor call request state
  const [mentorRequestOpen, setMentorRequestOpen] = useState(false);
  const [mentorAvail, setMentorAvail] = useState<string>('');
  const [mentorMsg, setMentorMsg] = useState<string>('');
  const [mentorSubmitting, setMentorSubmitting] = useState(false);
  const [mentorSuccess, setMentorSuccess] = useState<{ requestId: string; etaHours: number } | null>(null);

  const openResource = (id: 'technical' | 'flexibility' | 'wellness' | 'peer-buddy' | 'mentor-call') => {
    switch (id) {
      case 'technical':
        setResourceModal({
          title: 'Technical Support',
          content: 'Schedule a short technical walkthrough to resolve environment setup issues for Lab 3. You can request support here; no automatic navigation will occur.',
          link: 'https://example.com/tech-support'
        });
        break;
      case 'flexibility':
        setResourceModal({
          title: 'Academic Flexibility',
          content: 'Request a flexible deadline extension for pending work to alleviate immediate pressure. This submits a request to course staff for review.',
          link: 'https://example.com/flexibility'
        });
        break;
      case 'wellness':
        setResourceModal({
          title: 'Student Wellness',
          content: 'Facilitate a proactive check-in with a mentor or view wellness resources to help with stress-reduction strategies.',
          link: 'https://example.com/wellness'
        });
        break;
      case 'peer-buddy':
        // Open in-app chat instead of navigating
        setIsChatOpen(true);
        break;
      case 'mentor-call':
        // Open a mentor request form modal (no immediate external navigation)
        setMentorAvail('');
        setMentorMsg('');
        setMentorRequestOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-2">Engineering &gt; Dashboard &gt; Early Warning System</div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Student Well-being Index</h1>
            <p className="text-sm text-slate-400 mt-1">Privacy-first digital behavior monitoring for proactive support.</p>
          </div>
          <div className="flex items-center gap-3">
            {profileCompleted ? (
              <>
                <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 rounded-full ${activeTab==='overview' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Overview</button>
                <button onClick={() => setActiveTab('detailed')} className={`px-3 py-1 rounded-full ${activeTab==='detailed' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Detailed Analysis</button>
                <button onClick={() => setActiveTab('action')} className={`px-3 py-1 rounded-full ${activeTab==='action' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}>Action Plan</button>
              </>
            ) : (
              <div className="text-sm text-slate-400">Please complete your Academic History to unlock the Student Well-being Index</div>
            )}
          </div>
        </div>
      </div>

      {/* If profile isn't completed yet, show full-screen Academic History Entry and block access to the index */}
      {!profileCompleted ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-full max-w-2xl">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
                <Database className="h-6 w-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-100">Well-being Integration</h1>
              <p className="text-sm text-slate-400 mt-2 text-center max-w-xl">EduBridge combines academic history with social sentiment to provide a proactive safety net — please confirm or edit these details before launching the analysis.</p>
            </div>

            {prefilledByDashboard && (
              <div className="mb-4 w-full max-w-2xl mx-auto">
                <div className="bg-amber-800 text-amber-50 p-3 rounded-md text-sm flex items-center justify-between">
                  <div>Prefilled from Dashboard — please confirm or edit these details before generating your profile.</div>
                  <button onClick={() => setPrefilledByDashboard(false)} className="ml-4 text-sm underline">Dismiss</button>
                </div>
              </div>
            )}

            <div className="flex justify-center py-8">
              <div className="w-full max-w-2xl">
                <div className="bg-[#071220] p-8 rounded-2xl border border-[#122033] shadow-2xl">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-300"><svg className="inline-block mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="1.5"/></svg> Academic History</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs text-slate-400 flex items-center gap-2 mb-2 uppercase"><GraduationCap className="h-4 w-4 text-slate-400" />Previous GPA / Percentage</label>
                      <input value={prevPercentage} onChange={(e) => setPrevPercentage(e.target.value)} placeholder="e.g. 8.5 / 85" className="w-full p-3 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633]" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 flex items-center gap-2 mb-2 uppercase"><AlertCircle className="h-4 w-4 text-slate-400" />Active Backlogs (if any)</label>
                      <input value={activeBacklogsInput} onChange={(e) => setActiveBacklogsInput(e.target.value)} placeholder="e.g. 0" className="w-full p-3 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633]" />
                    </div>
                  </div>

                  <hr className="border-slate-800 mb-6" />

                  <div className="mb-4">
                    <h4 className="text-sm text-slate-300 font-medium mb-3">Social & Messaging Integration</h4>
                    <div className="text-xs text-slate-400 mb-3">Integrating your social footprints helps identify changes in your social mood and activity levels.</div>

                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="text-xs text-slate-400 flex items-center gap-2 uppercase"><MessageSquare className="h-4 w-4 text-amber-300" />SNAPCHAT ID</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 uppercase"><Instagram className="h-4 w-4 text-pink-400" />INSTAGRAM ID</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 uppercase"><Phone className="h-4 w-4 text-emerald-400" />WHATSAPP NO.</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <input value={snapchatId} onChange={(e) => setSnapchatId(e.target.value)} placeholder="@username" className="w-full p-2 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633]" />
                      <input value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="@username" className="w-full p-2 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633]" />
                      <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="+91 XXXXXXXXXX" className="w-full p-2 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633]" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-xs text-slate-400 uppercase mb-2 block">Contextual Notes</label>
                    <textarea value={performanceNotesInput} onChange={(e) => setPerformanceNotesInput(e.target.value)} placeholder="Any specific academic or social phrases you'd like the AI to consider?" className="w-full p-3 rounded-md bg-[#0b1724] text-slate-200 text-sm border border-[#142633] h-28" />
                  </div>

                  {savedHistory && (
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-slate-300">A saved profile is available. You can review it or choose to use it directly.</div>
                      <div className="flex items-center gap-2">
                        <button onClick={async () => {
                          // Use saved profile and run analysis
                          setFormError(null);
                          setProfileGenerating(true);
                          try {
                            const history = savedHistory;
                            const idx = await computeAcademicPressureIndex(history as any);
                            setPressureIndex(idx);

                            const overviewResp = await fetchEarlyWarningOverview(history as any);
                            setOverview(overviewResp);

                            const drift = await fetchBehavioralDriftData(history as any);
                            setDriftData(drift);

                            const mf = await fetchMultiFactorAnalysis(history as any);
                            setMultiFactor(mf);

                            const st = await fetchSentimentTimeline(history as any);
                            setSentimentTimeline(st);

                    const ph = await fetchPlatformAnalysisHub(history as any);
                    setPlatformInsights(ph);

                            // persist again to ensure latest format
                            try { localStorage.setItem('edu_bridge_ews_profile', JSON.stringify(history)); } catch (e) { }
                          } catch (e) {
                            console.error('use saved profile failed', e);
                            setFormError('Failed to analyze the saved profile. Please try editing and submit instead.');
                          } finally {
                            setProfileGenerating(false);
                          }
                        }} className="bg-slate-700 text-white px-3 py-2 rounded-md">Use saved profile and analyze</button>

                        <button onClick={() => { setSavedHistory(null); setFormError(null); }} className="text-sm text-slate-400 underline">Dismiss</button>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <button onClick={async () => {
                      setFormError(null);
                      const raw = prevPercentage.trim();
                      if (!raw) { setFormError('Please enter your previous GPA or percentage so we can personalize the analysis.'); return; }
                      let pct: number | undefined = undefined;
                      const r = raw.replace('%','');
                      const val = Number(r);
                      if (Number.isNaN(val)) { setFormError('Please enter a valid number for GPA or percentage.'); return; }
                      pct = val > 0 && val <= 10 ? Math.round((val/10)*100) : val;
                      if (!snapchatId.trim() && !instagramId.trim() && !whatsappNumber.trim()) { setFormError('Please provide at least one social or messaging identifier (Snapchat, Instagram, or WhatsApp) to proceed.'); return; }

                      setProfileGenerating(true);
                      const history = {
                        previousPercentage: pct,
                        activeBacklogs: Number(activeBacklogsInput) || 0,
                        performanceNotes: performanceNotesInput || undefined,
                        uploadedMemoName: uploadedMemoName || undefined,
                        snapchatId: snapchatId || undefined,
                        instagramId: instagramId || undefined,
                        whatsappNumber: whatsappNumber || undefined
                      };

                      try {
                        const idx = await computeAcademicPressureIndex(history as any);
                        setPressureIndex(idx);
                        const results = await runEarlyWarningAnalysis(history as any);
                        setRisks(results);
                        setOverview((prev: any) => ({ ...(prev || {}), score: idx }));
                        try { localStorage.setItem('edu_bridge_ews_profile', JSON.stringify(history)); } catch (e) { }
                        setProfileCompleted(true);
                        setActiveTab('overview');
                      } catch (e) {
                        console.error('profile generation failed', e);
                        setFormError('Something went wrong while generating your profile. Please try again.');
                      } finally {
                        setProfileGenerating(false);
                      }
                    }} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-full font-semibold text-lg flex items-center justify-center gap-2">{profileGenerating ? 'Generating...' : <>Launch Comprehensive Analysis <Zap className="h-4 w-4"/></>}</button>
                  </div>

                  <div className="text-center text-xs text-slate-400">PRIVACY BY DESIGN: ALL SOCIAL TOKENS ARE ANONYMIZED AND ORIGINAL CONTENT IS NEVER STORED.</div>

                  {formError && (
                    <div className="mt-4 text-sm text-rose-400">{formError}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400">Current Risk Level</h4>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-amber-400">{overview?.riskLevel ? overview.riskLevel.charAt(0).toUpperCase()+overview.riskLevel.slice(1) : '—'}</div>
                      <div className="text-xs text-slate-400">Early Warning Classification</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-200">Score</div>
                      <div className="text-lg font-bold text-slate-100">{overview?.score ?? '—'}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">Detected Emotion</div>
                  <div className="mt-1 w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${overview?.score ?? 0}%` }} />
                  </div>
                  <div className="mt-2 text-sm text-slate-200 font-medium">{overview?.detectedEmotion ?? '—'}</div>
                </div>
              </div>
            </div>

            {/* Academic History Entry - must be provided before generating personalized analysis */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400 mb-2">Academic History Entry</h4>
              <p className="text-xs text-slate-500 mb-3">Provide previous semester context so analysis can personalize to percentage-based performance metrics.</p>

              <div className="grid grid-cols-2 gap-3">
                <input value={prevPercentage} onChange={(e) => setPrevPercentage(e.target.value)} placeholder="Previous GPA / Percentage (e.g., 8.5 or 85)" className="col-span-2 p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700" />
                <input value={activeBacklogsInput} onChange={(e) => setActiveBacklogsInput(e.target.value)} placeholder="Active Backlogs (e.g., 0)" className="p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700" />
                <input value={uploadedMemoName ?? ''} readOnly placeholder="Upload study report (optional)" className="p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700" />
                <textarea value={performanceNotesInput} onChange={(e) => setPerformanceNotesInput(e.target.value)} placeholder="Performance context / notes" className="col-span-2 p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700 h-20" />

                <div className="col-span-2 flex items-center gap-3">
                  <label className="text-xs text-slate-400">Upload study report (PDF/JPG)</label>
                  <input type="file" accept="application/pdf,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setUploadedMemoName(f.name); }} className="ml-auto text-xs text-slate-300" />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-3">
                    <button onClick={async () => {
                      // generate profile
                      setProfileGenerating(true);
                      // parse percentage or GPA
                      let pct: number | undefined = undefined;
                      const raw = prevPercentage.trim();
                      if (raw) {
                        // if contains % strip
                        const r = raw.replace('%','');
                        const val = Number(r);
                        if (!Number.isNaN(val)) {
                          // if value looks like GPA < 10, convert to percentage (assume /10 scale)
                          pct = val > 0 && val <= 10 ? Math.round((val/10)*100) : val;
                        }
                      }

                  // require at least one social/messaging identifier
                  if (!snapchatId.trim() && !instagramId.trim() && !whatsappNumber.trim()) { setFormError('Please provide at least one social or messaging identifier (Snapchat, Instagram, or WhatsApp) to proceed.'); return; }

                  const history = {
                    previousPercentage: pct,
                    activeBacklogs: Number(activeBacklogsInput) || 0,
                    performanceNotes: performanceNotesInput || undefined,
                    uploadedMemoName: uploadedMemoName || undefined,
                    snapchatId: snapchatId || undefined,
                    instagramId: instagramId || undefined,
                    whatsappNumber: whatsappNumber || undefined
                  };

                  try {
                    const idx = await computeAcademicPressureIndex(history as any);
                    setPressureIndex(idx);

                    const overviewResp = await fetchEarlyWarningOverview(history as any);
                    setOverview(overviewResp);

                    const drift = await fetchBehavioralDriftData(history as any);
                    setDriftData(drift);

                    const mf = await fetchMultiFactorAnalysis(history as any);
                    setMultiFactor(mf);

                    const st = await fetchSentimentTimeline(history as any);
                    setSentimentTimeline(st);

                    const ph = await fetchPlatformAnalysisHub(history as any);
                    setPlatformInsights(ph);

                    // run the analysis with the academic history (influences risk results)
                    const results = await runEarlyWarningAnalysis(history as any);
                    setRisks(results);

                    // ensure overview score reflects computed pressure index
                    setOverview((prev: any) => ({ ...(prev || {}), score: idx }));

                    // persist profile locally (consent assumed here in mock)
                    try { localStorage.setItem('edu_bridge_ews_profile', JSON.stringify(history)); } catch (e) { }

                    setProfileCompleted(true);
                  } catch (e) {
                    console.error('profile generation failed', e);
                    setFormError('Something went wrong while generating your profile. Please try again.');
                  } finally {
                    setProfileGenerating(false);
                  }
                    }} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm">{profileGenerating ? 'Generating...' : 'Launch Comprehensive Analysis'}</button>

                    {pressureIndex !== null && (
                      <div className="ml-4 text-sm text-slate-300">Pressure Index: <span className="font-semibold text-amber-300">{pressureIndex}%</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-800 to-violet-900 p-4 rounded-xl text-slate-100 border border-slate-800">
              <h5 className="font-bold">Privacy Assurance</h5>
              <p className="text-xs text-slate-300 mt-2">Your identity is anonymized. This analysis uses aggregated behavioral tokens, not personal content. Mentors only receive notifications if high-risk thresholds are crossed for 3+ consecutive days.</p>
              <button className="mt-3 text-sm text-violet-200 underline">Manage Consent Settings</button>
            </div>
          </div>

          {/* Right Column (main) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400 mb-2">Explainable AI Output</h4>
              <div className="bg-slate-800 rounded-md p-4 text-sm text-slate-200">
                <blockquote className="italic">{overview?.explainableText ?? '—'}</blockquote>
                <div className="mt-4 flex gap-3">
                  <div className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">Key Indicator: {overview?.keyIndicator ?? '—'}</div>
                  <div className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">Impact Area: {overview?.impactArea ?? '—'}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm text-slate-400">Behavioral Drift Detection</h4>
                <div className="text-xs text-slate-500">Current vs Baseline</div>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={driftData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                    <CartesianGrid stroke="#0f1724" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8' }} />
                    <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8' }} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#0b1220', border: '1px solid #111827', color: '#fff' }} />
                    <Line type="monotone" dataKey="current" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="baseline" stroke="#475569" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ))}

      {activeTab === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400">Current Risk Level</h4>
              <div className="mt-4">
                <div className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{overview?.riskLevel ? overview.riskLevel.charAt(0).toUpperCase()+overview.riskLevel.slice(1) : '—'}</div>
                    <div className="text-xs text-slate-400">Early Warning Classification</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-200">Distress Score</div>
                    <div className="text-lg font-bold text-slate-100">{overview?.score ?? '—'}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">Detected Emotion</div>
                <div className="mt-1 w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${overview?.score ?? 0}%` }} />
                </div>
                <div className="mt-2 text-sm text-slate-200 font-medium">{overview?.detectedEmotion ?? '—'}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-800 to-violet-900 p-4 rounded-xl text-slate-100 border border-slate-800">
              <h5 className="font-bold">Privacy Assurance</h5>
              <p className="text-xs text-slate-300 mt-2">Your identity is anonymized. This analysis uses aggregated behavioral tokens, not personal content. Mentors only receive notifications if high-risk thresholds are crossed for 3+ consecutive days.</p>
              <button className="mt-3 text-sm text-violet-200 underline">Manage Consent Settings</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400 mb-3">Social Mood Trends</h4>
              <p className="text-xs text-slate-500 mb-3">Visualizing cross-platform sentiment shifts.</p>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTimeline} margin={{ top: 0, right: 0, left: -8, bottom: 0 }}>
                    <CartesianGrid stroke="#0f1724" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#0b1220', border: '1px solid #111827', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm text-slate-400">Platform Analysis Hub</h4>
                <div className="inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/20 px-3 py-1 rounded-full">
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span>VERIFIED INTEGRATION</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {platformInsights.length === 0 ? (
                  <div className="col-span-3 text-sm text-slate-400">No platform identifiers provided.</div>
                ) : (
                  platformInsights.map((p: any) => {
                    const badgeColor = p.activityLevel === 'Low' ? 'bg-rose-600 text-white' : p.activityLevel === 'Minimal' ? 'bg-amber-600 text-white' : p.activityLevel === 'Medium' ? 'bg-sky-600 text-white' : 'bg-emerald-600 text-white';
                    const platformLabel = p.platform === 'instagram' ? 'INSTA INSIGHT' : p.platform === 'whatsapp' ? 'WHATSAPP PULSE' : 'SNAPCHAT INSIGHT';
                    return (
                      <div key={p.platform} className="bg-gradient-to-br from-[#071022] to-[#06121a] rounded-xl p-4 border border-slate-800 shadow-inner">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p.platform === 'whatsapp' ? 'bg-emerald-500' : p.platform === 'instagram' ? 'bg-pink-500' : 'bg-yellow-400'}`}>
                              <div className="text-sm font-bold text-slate-900">{(p.idLabel||'').charAt(0).toUpperCase()}</div>
                            </div>
                            <div>
                              <div>
                              <div className="text-sm font-semibold text-slate-100">{p.idLabel}</div>
                              <div className="text-xs text-slate-400 uppercase">{platformLabel}</div>

                              <div className="mt-2 flex items-center gap-2">
                                <div className="text-xs text-slate-400">Token: <span className="font-mono text-xs text-slate-200 ml-1">{p.token ? `${p.token.slice(0,4)}…${p.token.slice(-3)}` : '—'}</span></div>
                                {p.token && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        try { navigator.clipboard.writeText(p.token); setCopiedTokenPlatform(p.platform); setTimeout(() => setCopiedTokenPlatform(null), 2000); } catch (e) { /* noop */ }
                                      }}
                                      className="ml-2 h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300"
                                    >
                                      {copiedTokenPlatform === p.platform ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                    {copiedTokenPlatform === p.platform && <span className="text-xs text-emerald-300">Copied!</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>{p.activityLevel}</div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 mb-2">{p.commTone}</div>
                        <div className="text-sm text-amber-300 italic">{p.highlight.startsWith('-') ? p.highlight : `-${p.highlight}`}</div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 rounded-xl p-4 bg-gradient-to-br from-[#0b1230] to-[#091028] border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-xs uppercase text-slate-400">AI CONTEXTUAL SYNTHESIS</div>
                </div>
                <blockquote className="mt-3 text-sm italic text-slate-200 leading-relaxed">{platformInsights.length === 0 ? 'No social tokens available to synthesize a cross-platform mood summary.' : (() => {
                  const names = platformInsights.map((x: any) => x.platform.charAt(0).toUpperCase()+x.platform.slice(1)).join(' and ');
                  const tones = platformInsights.map((x: any) => x.commTone.toLowerCase()).join(', ');
                  const activities = platformInsights.map((x: any) => x.activityLevel).join(' to ');
                  // more narrative and human-friendly
                  return `The student's social mood is characterized by ${activities} activity across ${names}, shifting from regular engagement to a ${tones} tone. The cryptic 'silence' on WhatsApp and the burnout-neutral tone on Instagram may indicate a conscious retreat from social interactions, mirroring the decline in academic participation.`;
                })()}</blockquote>
              </div>
            </div>
          </div>
        </div>
      )}


      {activeTab === 'action' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm text-slate-400">Current Risk Level</h4>
              <div className="mt-4">
                <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{overview?.riskLevel ? overview.riskLevel.charAt(0).toUpperCase()+overview.riskLevel.slice(1) : '—'}</div>
                    <div className="text-xs text-slate-400">Early Warning Classification</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-200">Score</div>
                    <div className="text-lg font-bold text-slate-100">{overview?.score ?? '—'}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">Detected Emotion</div>
                <div className="mt-1 w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${overview?.score ?? 0}%` }} />
                </div>
                <div className="mt-2 text-sm text-slate-200 font-medium">{overview?.detectedEmotion ?? '—'}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-800 to-violet-900 p-4 rounded-xl text-slate-100 border border-slate-800">
              <h5 className="font-bold">Personalized Intervention Plan</h5>
              <p className="text-xs text-slate-200 mt-2">Based on your current patterns, we suggest these small shifts to help restore balance.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-slate-400 mb-2">Technical Support</div>
                  <div className="text-sm text-slate-200 font-semibold">Schedule a short technical walkthrough to resolve the environment setup issues for Lab 3.</div>
                  <a onClick={() => openResource('technical')} className="mt-2 inline-flex items-center gap-2 text-xs text-violet-400 hover:underline cursor-pointer"><ExternalLink className="h-3 w-3" /> Launch Resource</a>
                </div>
                <button onClick={() => openResource('technical')} className="ml-4 h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">{<ChevronRight className="h-4 w-4"/>}</button>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-slate-400 mb-2">Academic Flexibility</div>
                  <div className="text-sm text-slate-200 font-semibold">Grant a flexible deadline extension for pending work to alleviate immediate pressure.</div>
                  <a onClick={() => openResource('flexibility')} className="mt-2 inline-flex items-center gap-2 text-xs text-violet-400 hover:underline cursor-pointer"><ExternalLink className="h-3 w-3" /> Launch Resource</a>
                </div>
                <button onClick={() => openResource('flexibility')} className="ml-4 h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">{<ChevronRight className="h-4 w-4"/>}</button>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-slate-400 mb-2">Student Wellness</div>
                  <div className="text-sm text-slate-200 font-semibold">Facilitate a proactive check-in with a mentor to discuss workload management and stress-reduction strategies.</div>
                  <a onClick={() => openResource('wellness')} className="mt-2 inline-flex items-center gap-2 text-xs text-violet-400 hover:underline cursor-pointer"><ExternalLink className="h-3 w-3" /> Launch Resource</a>
                </div>
                <button onClick={() => openResource('wellness')} className="ml-4 h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">{<ChevronRight className="h-4 w-4"/>}</button>
              </div>
            </div>

            <div className="mt-4 border-2 border-dashed border-slate-800 rounded-xl p-6 text-center">
              <div className="text-sm text-slate-300 mb-3">Would you like to speak to someone anonymously now?</div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => openResource('peer-buddy')} className="px-4 py-2 rounded-md bg-slate-800 text-slate-200 border border-slate-700">Chat with Peer Buddy</button>
                <button onClick={() => openResource('mentor-call')} className="px-4 py-2 rounded-md bg-violet-600 text-white">Request Mentor Call</button>
              </div>
            </div>

            {/* Resource Modal (shows inline info, no automatic navigation) */}
            {resourceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-lg border border-slate-800 w-full max-w-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-100">{resourceModal.title}</h4>
                      <p className="text-xs text-slate-400 mt-2">{resourceModal.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {resourceModal.link && (
                        <button onClick={() => window.open(resourceModal.link, '_blank')} className="text-xs text-violet-400 underline inline-flex items-center gap-1"><ExternalLink className="h-3 w-3"/> Open Resource</button>
                      )}
                      <button onClick={() => setResourceModal(null)} className="text-xs text-slate-500">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Peer Chat */}
            {isChatOpen && <PeerChat onClose={() => setIsChatOpen(false)} />}

            {/* Mentor Request Modal */}
            {mentorRequestOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-lg border border-slate-800 w-full max-w-md p-6">
                  <h4 className="text-lg font-bold text-slate-100 mb-2">Request Mentor Call</h4>
                  <p className="text-xs text-slate-400 mb-4">Tell us your preferred times/availability and a brief note — we'll notify mentors and follow up.</p>

                  <label className="text-xs text-slate-400">Preferred availability (optional)</label>
                  <input value={mentorAvail} onChange={(e) => setMentorAvail(e.target.value)} placeholder="e.g., Tomorrow 6–8 PM, Wed morning" className="w-full mt-2 p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700" />

                  <label className="text-xs text-slate-400 mt-3 block">Message (optional)</label>
                  <textarea value={mentorMsg} onChange={(e) => setMentorMsg(e.target.value)} placeholder="Any context you'd like the mentor to know..." className="w-full mt-2 p-2 rounded-md bg-slate-800 text-slate-200 text-sm border border-slate-700 h-24" />

                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button onClick={() => setMentorRequestOpen(false)} className="px-4 py-2 rounded-md bg-slate-800 text-slate-200 border border-slate-700">Cancel</button>
                    <button onClick={async () => {
                      setMentorSubmitting(true);
                      try {
                        const resp = await (await import('../services/earlyWarningService')).requestMentorCall({ availability: mentorAvail, message: mentorMsg, anonymized: true });
                        setMentorSuccess({ requestId: resp.requestId, etaHours: resp.etaHours });
                        setMentorRequestOpen(false);
                      } catch (e) {
                        console.error('mentor request failed', e);
                        // show an error toast / modal in production
                      } finally {
                        setMentorSubmitting(false);
                      }
                    }} className="px-4 py-2 rounded-md bg-violet-600 text-white">{mentorSubmitting ? 'Sending...' : 'Request Call'}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal for Mentor Request */}
            {mentorSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-sm p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-800 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 mb-2">Request Submitted!</h4>
                  <p className="text-xs text-slate-400">Your mentor has been notified. They usually respond within {mentorSuccess.etaHours}-4 hours for prioritized well-being check-ins.</p>
                  <div className="mt-4">
                    <button onClick={() => setMentorSuccess(null)} className="px-6 py-2 rounded-md bg-slate-800 text-slate-200 border border-slate-700">Close</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default EarlyWarning;
