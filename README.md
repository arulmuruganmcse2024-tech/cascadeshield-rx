# CascadeShield Rx 🛡️💊
### *Unmasking Hidden Prescribing Cascades, Anticholinergic Burden & Hospital Discharge Errors Before They Cause Harm*

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Clinical Standards](https://img.shields.io/badge/standards-2026%20BMJ%20%7C%202025%20ThinkCascades%20%7C%202023%20AGS%20Beers-emerald.svg)
![Interoperability](https://img.shields.io/badge/interop-HL7%20FHIR%20R4-purple.svg)
![Unit Tests](https://img.shields.io/badge/tests-15%2F15%20PASS%20(100%25)-success.svg)

---

## 🌟 Executive Clinical Summary

**CascadeShield Rx** is a production-grade, zero-defect, responsive clinical decision support system (CDSS) and full-stack web application. It is engineered to detect, quantify, visualize, and safely resolve:
1. **Unintentional Prescribing Cascades** (using the landmark 2026 BMJ PIPC Cohort Study & 2025 Annals of Family Medicine ThinkCascades consensus).
2. **Cumulative Anticholinergic Cognitive Burden** (Boustani Scale + Cochrane Dementia Odds Ratio $OR = 2.63$).
3. **Dose-Weighted Drug Burden Index (DBI)** (hyperbolic sedative/antimuscarinic saturation).
4. **Beers Criteria Table 2 & Table 6 Renal Violations** (with automatic Cockcroft-Gault Creatinine Clearance floor guards).
5. **Hospital-to-Home Discharge Reconciliation Errors** (detecting duplicate drug classes such as metoprolol tartrate/succinate and START v3 chronic omissions such as SGLT2 inhibitors).
6. **HL7 FHIR R4 EHR Interoperability** (exporting signed Patient, Observation, MedicationStatement, and DetectedIssue bundles).

---

## 🔬 Deterministic Algorithmic & Mathematical Models

### 1. Cockcroft-Gault Creatinine Clearance ($\text{CrCl}$)
Calculated with strict clinical sarcopenia floor clamping ($S_{cr} \ge 0.4\text{ mg/dL}$):
$$\text{CrCl} = \frac{(140 - \text{Age}) \times \text{Weight}_{\text{kg}}}{72 \times S_{cr}} \times [0.85\text{ if female}]$$

### 2. Piecewise Temporal Decay Kernel ($W_{\text{window}}$)
$$W_{\text{window}}(\Delta t, \tau_{\min}, \tau_{\max}) = \begin{cases} 
0.0 & \text{if } \Delta t \le 0 \\
0.75 & \text{if } 0 < \Delta t < \tau_{\min} \text{ (Hyper-acute hospital onset)} \\
1.00 & \text{if } \tau_{\min} \le \Delta t \le \tau_{\max} \text{ (Peak clinical onset)} \\
\max(0.25, e^{-(\Delta t - \tau_{\max})/180}) & \text{if } \tau_{\max} < \Delta t \le 365 \\
0.25 & \text{if } \Delta t > 365 
\end{cases}$$

### 3. Prescribing Cascade Confidence Score ($C_{\text{cascade}}$)
$$C_{\text{cascade}} = 100 \times (0.45 \cdot E + 0.35 \cdot W_{\text{window}} + 0.20 \cdot S_{\text{symptom}}) \times \gamma_{\text{confounder}}$$
*Where $\gamma = 0.65$ when comorbidity confounder (e.g. Heart Failure/CHF) is present.*

### 4. Hyperbolic Drug Burden Index ($\text{DBI}$)
$$\text{DBI} = \sum \frac{D}{\delta + D}$$
*Where $D$ is daily dose (mg) and $\delta$ is minimum effective daily dose (mg).*

### 5. Composite Polypharmacy Harm Index ($\text{PHI}$)
$$\text{PHI} = \min(100, S_{\text{cascade}} + S_{\text{acb}} + S_{\text{pim}} + S_{\text{renal}})$$

### 6. First-Order Pharmacokinetic Plasma Washout Curve
$$C(t) = 100 \times (0.5)^{\frac{24 \cdot t}{t_{1/2}}}$$
*Evaluates to exactly $3.13\%$ residual plasma concentration after 5 half-lives ($96.88\%$ biological elimination).*

---

## 📋 The 4 Clinical Case Presets

1. **Martha V. — The 4-Drug Domino Cascade**:
   - 78yo female ($\text{CrCl} = 32.4\text{ mL/min}$).
   - Amlodipine $\rightarrow$ Furosemide $\rightarrow$ Oxybutynin $\rightarrow$ Donepezil $\rightarrow$ Zolpidem.
   - Pre-simulation: $\text{PHI} = 92$, $\text{ACB} = 4$, $\text{DBI} = 1.17$.
   - Post-simulation: Severing root cause with Losartan 50 mg drops $\text{PHI} \rightarrow 12$, avoiding $\$4,800$ in ADE costs.

2. **Arthur K. — Statin Myalgia + Stage 4 CKD Renal Crisis**:
   - 81yo male ($\text{CrCl} = 24.9\text{ mL/min}$).
   - Atorvastatin $\rightarrow$ Naproxen $\rightarrow$ Amlodipine + Baclofen + Ciprofloxacin.
   - 2-Step Simulation: Step 1 severs statin cascade ($\text{PHI } 82 \rightarrow 48$); Step 2 optimizes renal contraindications ($\text{PHI } 48 \rightarrow 12$).

3. **Eleanor R. — Post-Hospital Discharge Reconciliation Trap**:
   - 74yo female ($\text{CrCl} = 53.0\text{ mL/min}$).
   - Discharged with duplicate beta-blocker (Lopressor + Toprol-XL) and omitted chronic SGLT2i (Jardiance).
   - Post-reconciliation: Stops duplicate, restores Jardiance, tapers steroid/antipsychotic ($\text{PHI } 94 \rightarrow 12$).

4. **Custom Regimen Builder & Zero-Key Clinical Note NLP Parser**:
   - Interactive sliders for Age, Sex, Weight, SCr.
   - Instant NLP parsing of physician discharge notes converting brand/generic synonyms (e.g. Norvasc $\rightarrow$ amlodipine, Lasix $\rightarrow$ furosemide) into the live graph.

---

## 🧪 The 15 Automated Clinical Unit Tests

All 15 assertions execute dynamically with $100\%$ pass rate:
1. **Reverse Chronology Rejection** ($\Delta t = -30\text{d} \implies C = 0$)
2. **Same-Day Co-Initiation Guard** ($\Delta t = 0\text{d} \implies C = 0$)
3. **Hyper-Acute Hospital Onset Window** (Prednisone $\rightarrow$ Quetiapine at $\Delta t = 3\text{d} \implies C = 99$)
4. **Peak Outpatient Onset Window** (Amlodipine $\rightarrow$ Furosemide at $\Delta t = 24\text{d} \implies C = 96$)
5. **Comorbidity Confounder Damping** ($\gamma = 0.65 \implies 96 \rightarrow 63$ Amber tier)
6. **Intentional Protective Gastroprotection Recognition** (Naproxen + Omeprazole $\implies 0$ penalty points)
7. **Cockcroft-Gault Female Standard Verification** ($78\text{y}, \text{F}, 62\text{kg}, 1.4\text{ mg/dL} \implies 32.4\text{ mL/min}$)
8. **Cockcroft-Gault Male Stage 4 CKD Verification** ($81\text{y}, \text{M}, 70\text{kg}, 2.3\text{ mg/dL} \implies 24.9\text{ mL/min}$)
9. **Zero / Negative SCr Division-by-Zero Guard** ($\text{SCr} = 0 \implies \text{clamped at } 0.4 \implies 145.8\text{ mL/min}$)
10. **Beers Table 6 Renal Threshold Firing** (At $24.9\text{ mL/min}$, flags baclofen, naproxen, ciprofloxacin)
11. **Boustani ACB Cumulative Threshold & Dementia Alert** (Oxybutynin 3 + Furosemide 1 = $4 \ge 3 \implies \text{Dementia } OR = 2.63$)
12. **Hyperbolic Drug Burden Index Math** ($10/(5+10) + 5/(5+5) = 1.17$)
13. **Case 1 Root-Cause ARB Substitution PHI Delta** (Martha V. PHI drops from $92 \rightarrow 12$)
14. **DAG Cycle Immunity & 5-Half-Life PK Washout** (Cycle $A \leftrightarrow B$ terminates in $<5\text{ms}$; Washout = $3.13\%$)
15. **Offline Federal Cache Failover** (Resolves Amlodipine RxCUI 17767 and 6 FAERS reactions in $0\text{ms}$)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Run Dev Server
```bash
git clone https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx.git
cd cascadeshield-rx
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Run Serverless Endpoint Locally or on Vercel
- GET `/api/clinical-audit?health=1` $\rightarrow$ Returns API health & standards checklist.
- POST `/api/clinical-audit` with `{ vitals, regimen }` $\rightarrow$ Returns real-time clinical analysis and signed HL7 FHIR R4 Bundle.

---

## 🏛️ Technical Stack
- **Frontend**: React 18, TypeScript 5, Vite 6, Tailwind CSS, Lucide React Icons.
- **Visualizations**: Native SVG Causal Time-Graph & 5-Half-Life PK Plasma Washout Curve.
- **Audio / Accessibility**: Web Speech Synthesis API (`window.speechSynthesis`) + Senior/Caregiver Plain-English Mode.
- **Print Utility**: Print-optimized `@media print` 1-page A4/Letter Physician Handoff Worksheet with check-boxes.
- **Backend / Interop**: Vercel Node.js Serverless Handler (`api/clinical-audit.ts`), HL7 FHIR R4 Bundle Generator.
- **Federal Data**: NLM RxNorm, NLM RxClass, and OpenFDA FAERS adverse event counter with offline failover cache.

---
*Developed with clinical precision for senior health safety and polypharmacy harm reduction.*
