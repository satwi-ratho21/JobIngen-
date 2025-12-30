# Early Warning System (EWS) — Feature Specification

**Goal:** Proactively identify early signals of mental, emotional, or social distress among students using a privacy-first, explainable AI pipeline and provide timely, non-clinical, voluntary interventions and resources.

---

## Key Capabilities

1. **Behavioral Drift Detection** — Detect anomalous drops or changes in engagement relative to an individual baseline (e.g., page activity, login frequency, assignment submissions).
2. **Sentiment & Emotion Analysis** — Privacy-preserving NLP on discussion forums and mentor interactions to surface stress, anxiety, burnout, or isolation indicators (no raw messages stored without consent).
3. **Academic Pressure Index** — A composite metric derived from course load, deadlines, performance trajectories and recent submission patterns.
4. **AI Risk Classification** — Non-clinical categorization into *low / medium / high* early-risk levels with human-readable explanations for each alert.
5. **Explainable Outputs** — Provide clear, auditable explanations (e.g., SHAP summaries or rule-based reasons) so students and mentors understand why an alert was generated.
6. **Smart Alerting Mechanism** — Notify students first for self-awareness and support; escalate to mentors/counselors only when configurable thresholds and persistence checks (e.g., 3+ days) are exceeded.
7. **Personalized Intervention Recommendations** — Contextual suggestions such as workload re-balancing, mentor check-ins, peer support groups, or well-being resources.
8. **Privacy-by-Design** — Consent-driven participation, anonymization/aggregation of signals, strict role-based access control (RBAC), data minimization, and bias mitigation procedures.

---

## Frontend Integration & UX
- A dashboard card **"Early Warning Notice!"** is placed below the Tech Accelerator card; clicking the card opens the **Student Well-being Index** feature.
- Primary screens:
  - **Overview**: Current risk card, explainable AI output, behavioral drift chart.
  - **Detailed Analysis**: Multi-factor distress components (academic load, submission consistency, forum sentiment, collaborative engagement) and sentiment timeline.
  - **Action Plan**: Personalized recommendations and intervention workflow (planned).
- Consent controls: students can opt-in/out and manage what signals are used; mentors see only anonymized alerts unless escalation thresholds are met.
- Accessibility: keyboard focus, ARIA labels, and color-contrast considerations included.

---

## Implementation Status (frontend)
- Implemented:
  - `component/EarlyWarning.tsx` — Overview, Detailed Analysis tab, charts, privacy box, explainability modal.
  - `component/TechAccelerator.tsx` & `component/Dashboard.tsx` — Dashboard card and navigation.
  - `services/earlyWarningService.ts` — Mocked endpoints used by the UI (`fetchEarlyWarningOverview`, `fetchBehavioralDriftData`, `fetchMultiFactorAnalysis`, `fetchSentimentTimeline`, `runEarlyWarningAnalysis`, `toggleConfig`).
- Backend & ML: **stubbed/mocked** (see Backend & ML section). Do not enable in production without privacy, security, and audit controls.

---

## Backend & ML (Implementation Notes)
- **Drift Detection:** Per-user baselines and change-point/detector algorithms (CUSUM, EWMA, Bayesian change point, or sequence models) with sensitivity controls.
- **Sentiment & Emotion Models:** Use privacy-preserving approaches: on-device or ephemeral feature extraction, tokenization and vectorization, and store only aggregated features when consented.
- **Academic Pressure Index:** Normalize course load, deadlines, and recent performance trends to compute a calibrated score.
- **Risk Model & Explainability:** Consider LightGBM/XGBoost with SHAP explanations or sparse linear/logistic models for interpretability; always produce a human-friendly explanation alongside model output.
- **Audit, Logging & Security:** Record decisions and actions in an auditable log (no raw PII in logs), enforce RBAC and secure transport/storage.

---

## Privacy & Ethics (required before production)
- Participation must be **opt-in** with informed consent and clear UI for students to manage settings.
- Students' identities should be anonymized by default; only aggregated or tokenized signals are used for detection unless explicit escalation is authorized.
- The system is strictly **non-diagnostic** — it supports awareness and early outreach, not clinical assessment.
- Perform bias audits, fairness testing, and a privacy impact assessment before production rollout.
- Define retention policies, data minimization rules, and procedures for manual review and escalation.

---

## Next Steps / Priorities
1. Implement secure backend endpoints and RBAC (mentor, counselor, admin roles) and wire them to the frontend stubs. 🔒
2. Build consent and settings UI, with clear messaging and audit trails. ✅
3. Implement the Action Plan tab (personalized intervention workflows, opt-in mentoring flows). 🧭
4. Add tests (unit/integration) and a privacy/ethics checklist as gating criteria for deployment. ✅
5. Run bias audits and stakeholder review (students, counselors, legal) before enabling any escalation automation. ⚖️

---

*Notes:* The current implementation in the repo is a privacy-first prototype with mocked services meant for UI validation and design. Production deployment requires legal review, security hardening, and institutional approvals.
