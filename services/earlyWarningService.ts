import { EarlyWarningSummary, StudentRisk, EarlyWarningConfig, StudentAcademicHistory } from '../types';

// NOTE: This is a frontend stub / mock. Replace with secure backend endpoints and privacy-preserving pipelines in production.

export async function fetchEarlyWarningSummary(): Promise<EarlyWarningSummary> {
  // Mocked summary
  return {
    totalStudentsMonitored: 1240,
    atRiskCounts: { low: 18, medium: 6, high: 2 },
    lastRun: new Date().toISOString()
  };
}

export async function fetchEarlyWarningOverview(history?: StudentAcademicHistory) {
  // Return a mock overview that the UI can render, adjusted by student history if provided
  await new Promise(r => setTimeout(r, 200));

  // Base values
  let score = 61;
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  let detectedEmotion = 'Stress and Burnout';
  let keyIndicator = 'Behavioral Drift (35%)';
  let impactArea = 'Weekend Engagement';

  if (history && typeof history.previousPercentage === 'number') {
    const pct = Math.max(0, Math.min(100, history.previousPercentage));
    // lower percentage -> higher risk and lower baseline
    score = Math.round(50 + (50 - (pct - 50)) * 0.5);
    if (pct < 60) { riskLevel = 'high'; detectedEmotion = 'Stress and Low Confidence'; keyIndicator = `Academic Performance (${pct}%)`; impactArea = 'Course Performance'; }
    else if (pct < 75) { riskLevel = 'medium'; detectedEmotion = 'Stress and Fatigue'; keyIndicator = `Behavioral Drift (${Math.max(20, 75 - pct)}%)`; impactArea = 'Engagement'; }
    else { riskLevel = 'low'; detectedEmotion = 'Stable'; keyIndicator = 'Baseline Performance'; impactArea = 'Overall Engagement'; }

    // backlogs amplify risk
    if (history.activeBacklogs && history.activeBacklogs > 0) {
      score = Math.min(100, score + Math.min(20, history.activeBacklogs * 6));
      if (history.activeBacklogs >= 2) riskLevel = 'high';
    }

    // social presence reduces uncertainty and slightly lowers risk
    const socialCount = ['snapchatId','instagramId','whatsappNumber'].reduce((c, k) => c + (history[k as keyof StudentAcademicHistory] ? 1 : 0), 0);
    if (socialCount > 0) {
      score = Math.max(0, score - socialCount * 3);
      if (score < 50 && riskLevel === 'medium') riskLevel = 'low';
    }
  }

  return { riskLevel, score, detectedEmotion, explainableText: `Summary generated using historical percentage context${history?.previousPercentage ? ` (${history.previousPercentage}%)` : ''}.`, keyIndicator, impactArea };
} 

export async function fetchBehavioralDriftData(history?: StudentAcademicHistory) {
  // Mock daily series for a week (current vs baseline), adjusted by history if provided
  await new Promise(r => setTimeout(r, 200));
  const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // baseline anchored near previous percentage if present otherwise defaults
  const basePct = history && typeof history.previousPercentage === 'number' ? Math.round(history.previousPercentage) : 88;
  // produce baseline smooth series
  const baseline = days.map((_, i) => Math.max(40, Math.round(basePct - (i * 1))));
  // current engagement drops more when percentage is low
  const dropFactor = history && typeof history.previousPercentage === 'number' ? Math.max(0, (75 - history.previousPercentage) / 25) : 0.2;
  // If social identifiers are present, assume better social connectivity which slightly mitigates engagement drop
  const socialCount = history ? ['snapchatId','instagramId','whatsappNumber'].reduce((c, k) => c + (history[k as keyof StudentAcademicHistory] ? 1 : 0), 0) : 0;
  const mitigation = Math.min(0.12, socialCount * 0.04);
  const current = baseline.map(b => Math.max(30, Math.round(b - b * (0.05 + Math.max(0, dropFactor * 0.3 - mitigation)))));
  return days.map((day, i) => ({ day, current: current[i], baseline: baseline[i] }));
} 

export async function fetchMultiFactorAnalysis(history?: StudentAcademicHistory) {
  // Mock multi-factor distress analysis, adjusted by history if provided
  await new Promise(r => setTimeout(r, 200));
  let academicLoadPressure = 60;
  let submissionConsistency = 80;
  let forumSentimentScore = 65;
  let collaborativeEngagement = 70;
  let distressIndex = 4.0;

  if (history && typeof history.previousPercentage === 'number') {
    const pct = history.previousPercentage;
    // lower pct increases load pressure and distress, reduces consistency and sentiment
    academicLoadPressure = Math.min(100, Math.round(60 + (75 - pct) * 0.6));
    submissionConsistency = Math.max(20, Math.round(80 - (75 - pct) * 0.7));
    forumSentimentScore = Math.max(10, Math.round(65 - (75 - pct) * 0.6));
    collaborativeEngagement = Math.max(10, Math.round(70 - (75 - pct) * 0.5));
    distressIndex = Math.min(10, Math.round((5 + (75 - pct) * 0.08) * 10) / 10);
  }

  if (history && history.activeBacklogs && history.activeBacklogs > 0) {
    academicLoadPressure = Math.min(100, academicLoadPressure + history.activeBacklogs * 5);
    distressIndex = Math.min(10, distressIndex + history.activeBacklogs * 0.5);
  }

  // Social presence slightly lowers distress by providing more contextual signals and potential support
  const socialCount = history ? ['snapchatId','instagramId','whatsappNumber'].reduce((c, k) => c + (history[k as keyof StudentAcademicHistory] ? 1 : 0), 0) : 0;
  if (socialCount > 0) {
    academicLoadPressure = Math.max(30, academicLoadPressure - socialCount * 3);
    distressIndex = Math.max(0, Math.round((distressIndex - socialCount * 0.3) * 10) / 10);
  }

  return { academicLoadPressure, submissionConsistency, forumSentimentScore, collaborativeEngagement, distressIndex };
} 

export async function fetchSentimentTimeline(history?: StudentAcademicHistory) {
  // Mock sentiment trend over days (0-100), adjusted by history
  await new Promise(r => setTimeout(r, 200));
  const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let base = 70;
  if (history && typeof history.previousPercentage === 'number') {
    base = Math.max(20, Math.min(90, Math.round(history.previousPercentage * 0.7)));
  }
  const socialCount = history ? ['snapchatId','instagramId','whatsappNumber'].reduce((c, k) => c + (history[k as keyof StudentAcademicHistory] ? 1 : 0), 0) : 0;
  const socialBoost = Math.min(10, socialCount * 3);
  const values = days.map((_, i) => Math.max(10, Math.round(base + socialBoost - i * 6 - (Math.random() * 5))));
  return days.map((day, i) => ({ day, value: values[i] }));
} 

export async function runEarlyWarningAnalysis(history?: StudentAcademicHistory): Promise<StudentRisk[]> {
  // Return mocked anonymized alerts influenced by an optional academic history
  await new Promise(r => setTimeout(r, 700));
  const now = Date.now();

  // If a student history is provided, compute a pressure index and incorporate into signal/explainability
  let pressureIndex = 50;
  if (history) {
    pressureIndex = await computeAcademicPressureIndex(history);
  }

  return [
    {
      id: `a${now.toString(36).slice(-8)}`,
      riskLevel: pressureIndex > 75 ? 'high' : pressureIndex > 50 ? 'medium' : 'low',
      score: Math.max(30, Math.min(95, pressureIndex + 10)),
      anonymizedSignals: { engagementDrop: true, missedAssignments: 3, sentiment: 'negative', collaborationChange: true, pressureIndex },
      explainability: `Sudden drop in engagement and missing assignments; computed pressure index ${pressureIndex} based on previous academic records.`
    },
    {
      id: `b${(now+1).toString(36).slice(-8)}`,
      riskLevel: pressureIndex > 60 ? 'medium' : 'low',
      score: Math.max(25, Math.min(75, pressureIndex - 5)),
      anonymizedSignals: { engagementDrop: true, missedAssignments: 1, sentiment: 'neutral', collaborationChange: false, pressureIndex: Math.max(20, pressureIndex - 10) },
      explainability: `Moderate engagement drift; pressure index context: ${Math.max(20, pressureIndex - 10)}.`
    }
  ];
}

export async function toggleConfig(cfg: EarlyWarningConfig): Promise<EarlyWarningConfig> {
  // Mock persisting config
  await new Promise(r => setTimeout(r, 200));
  return cfg;
}

export async function computeAcademicPressureIndex(data: StudentAcademicHistory): Promise<number> {
  // Simple heuristic-based computation for demo purposes (0-100). Lower previousPercentage increases pressure.
  await new Promise(r => setTimeout(r, 200));
  let score = 40;

  if (typeof data.previousPercentage === 'number') {
    // If percentage is given, invert it so lower % produces higher pressure
    const pct = Math.max(0, Math.min(100, data.previousPercentage));
    // baseline: lower pct increases pressure
    const contribution = Math.round((100 - pct) * 0.5);
    score += contribution;
  }

  if (data.activeBacklogs && data.activeBacklogs > 0) {
    score += Math.min(30, data.activeBacklogs * 8);
  }

  if (data.performanceNotes && data.performanceNotes.length > 30) {
    score += 4;
  }

  // Social presence heuristic: if user provides one or more social handles, we treat it as a signal of social connectivity
  const socialCount = ['snapchatId','instagramId','whatsappNumber'].reduce((c, k) => c + (data[k as keyof StudentAcademicHistory] ? 1 : 0), 0);
  if (socialCount > 0) {
    // slightly reduce pressure (social support or more data reduces uncertainty)
    score = Math.max(0, score - Math.min(8, socialCount * 3));
  }

  // clamp and return
  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
} 

export async function requestMentorCall(payload: { availability?: string; message?: string; anonymized?: boolean }) {
  // Mock submitting a mentor call request
  await new Promise(r => setTimeout(r, 800));
  return {
    status: 'ok',
    requestId: `req_${Date.now().toString(36).slice(-8)}`,
    etaHours: 2
  };
}

export interface PlatformInsight {
  platform: 'snapchat' | 'instagram' | 'whatsapp';
  idLabel: string; // shown identifier (anonymized)
  token?: string; // anonymized social token (frontend demo)
  activityLevel: 'Low' | 'Minimal' | 'Medium' | 'High';
  commTone: string;
  highlight: string; // small metric note
}

function makeTokenFromId(id?: string) {
  if (!id) return undefined;
  const raw = id.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return `tkn_${raw.slice(0,6)}_${Math.random().toString(36).slice(2,5)}`;
}

export async function fetchPlatformAnalysisHub(history?: StudentAcademicHistory): Promise<PlatformInsight[]> {
  await new Promise(r => setTimeout(r, 250));
  if (!history) return [];

  const insights: PlatformInsight[] = [];
  const pct = typeof history.previousPercentage === 'number' ? history.previousPercentage : 80;
  const backlogs = history.activeBacklogs || 0;
  const social = {
    snapchat: history.snapchatId,
    instagram: history.instagramId,
    whatsapp: history.whatsappNumber
  };

  const makeActivity = (id: string | undefined) => {
    if (!id) return { activity: 'Minimal', tone: 'Isolated', note: 'No recent activity detected' };
    if (pct < 60) return { activity: 'Low', tone: 'Frustrated', note: '-65% Frequency' };
    if (pct < 75) return { activity: 'Medium', tone: 'Burnout-Neutral', note: 'Lower interaction rate' };
    return { activity: 'High', tone: 'Engaged', note: 'Active' };
  };

  if (history.snapchatId) {
    const a = makeActivity(history.snapchatId);
    insights.push({ platform: 'snapchat', idLabel: history.snapchatId, token: makeTokenFromId(history.snapchatId), activityLevel: a.activity as any, commTone: a.tone, highlight: a.note });
  }
  if (history.whatsappNumber) {
    const a = makeActivity(history.whatsappNumber);
    // WhatsApp often shows status-only or minimal in this heuristic
    const tone = pct < 65 ? 'Isolated' : 'Minimal';
    insights.push({ platform: 'whatsapp', idLabel: history.whatsappNumber, token: makeTokenFromId(history.whatsappNumber), activityLevel: a.activity as any, commTone: tone, highlight: pct < 65 ? 'Status-only engagement' : 'Direct messages present' });
  }
  if (history.instagramId) {
    const a = makeActivity(history.instagramId);
    insights.push({ platform: 'instagram', idLabel: history.instagramId, token: makeTokenFromId(history.instagramId), activityLevel: a.activity as any, commTone: a.tone, highlight: a.note });
  }

  return insights;
}
