<div align="center">

<img src="public/hero-banner.svg" alt="CascadeShield Rx Banner" width="100%" />

<br/><br/>

[![Hackathon](https://img.shields.io/badge/Next_Byte_Hacks_V5-Flagship_Submission-2563EB?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx)
[![Full-Stack Backend](https://img.shields.io/badge/Full--Stack_Backend-Node.js_REST_%2B_Vercel_Serverless-4338CA?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_Pages_Deploy-16A34A?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx/actions)
[![Unit Tests](https://img.shields.io/badge/Clinical_Unit_Tests-15%2F15_PASSED_(100%25)-059669?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx)
[![Clinical Standards](https://img.shields.io/badge/Standards-BMJ_2026_%7C_ThinkCascades_%7C_Beers_2025-7C3AED?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx)
[![Interoperability](https://img.shields.io/badge/EHR_Export-HL7_FHIR_R4_SHA--256-D97706?style=for-the-badge)](https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx)

<br/>

### **Unmasking Hidden Prescribing Cascades, Anticholinergic Burden & Hospital Discharge Errors Before They Cause Harm**

*A production-ready Clinical Pharmacotherapy Decision Support System (CDSS) powered by deterministic causal graph algorithms, real-world federal drug intelligence, and HL7 FHIR R4 interoperability.*

</div>

---

## ⚡ Quick Links & Judge Verification Table

| Resource | Direct Link | Verification Notes |
| :--- | :--- | :--- |
| 🚀 **Live Production Web App (GitHub Pages)** | [**https://arulmuruganmcse2024-tech.github.io/cascadeshield-rx/**](https://arulmuruganmcse2024-tech.github.io/cascadeshield-rx/) | Relative asset paths (`base: './'`), zero 404s, responsive on desktop and mobile. |
| 🛡️ **Zero-Barrier Instant Verification** | [Open Live App](https://arulmuruganmcse2024-tech.github.io/cascadeshield-rx/) | **Zero Login / Zero API Key walls.** Boots straight into Case 1 (Martha V.) with interactive DAG active. |
| 🎯 **Judge 30-Second Quick-Tour** | Top of the screen | 3 interactive step buttons: ① Inspect 4-Drug Cascade $\rightarrow$ ② Simulate Root Switch ($\text{PHI } 92 \rightarrow 12$) $\rightarrow$ ③ Verify 15/15 Unit Tests &amp; FHIR R4. |
| 🧪 **15 Automated Unit Tests** | Workspace Tab 3 | **15 / 15 PASSED in &lt; 1ms.** Mathematical, pharmacologic, and algorithmic assertions verified. |
| 🖥️ **Full-Stack REST Backend & Telemetry** | Tab 3 &amp; `server/` | Dual-mode: Standalone Node.js REST API (`npm run server`), Vercel serverless, and browser edge worker + live US Federal API pings with Web Crypto SHA-256 signing. |
| 📦 **HL7 FHIR R4 Bundle Export** | Top Bar &amp; Tab 3 | 1-Click JSON export of official US-Core `Patient`, `Observation`, `MedicationStatement`, and `DetectedIssue` resources. |
| 🖨️ **1-Page Clinical Brief** | Top Bar | Native `@media print` formatted physician handoff sheet with checkboxes and attestation lines. |

---

## 🚨 The Global Clinical Crisis (Quantified Evidence)

Polypharmacy in aging populations has reached an unprecedented clinical tipping point:

1. **The Landmark September 2026 BMJ Study** ($N = 2,297,942$ older adults):
   - Confirmed that **prescribing cascades**—where an adverse drug event (ADE) is misinterpreted as a new medical condition and treated with another drug—account for up to **11.9%** of geriatric drug initiations.
   - Identified Systemic Corticosteroids $\rightarrow$ Antipsychotics ($\text{ASR} = 2.55$) and Stimulant Laxatives $\rightarrow$ Anti-Diarrheals ($\text{ASR} = 2.53$) as the highest rate ratios in clinical medicine.
2. **The 2025 Annals of Family Medicine ThinkCascades Cohort** ($N = 533,464$ older adults):
   - Demonstrated that older patients initiated on Calcium Channel Blockers (CCBs) experience an **adjusted Sequence Ratio ($\text{aSR}$) of 1.93** (95% CI 1.79–2.09) for subsequent loop diuretic initiation within 30 days due to precapillary vasodilatory pedal edema being misdiagnosed as heart failure.
3. **Cochrane Anticholinergic Cognitive Burden Meta-Analysis**:
   - An Anticholinergic Cognitive Burden ($\text{ACB}$) score $\ge 3$ is associated with a **2.63-fold higher odds of incident dementia** ($\text{OR} = 2.63$, 95% CI 1.09–6.29).
4. **AHRQ Hospital Discharge Reconciliation Evidence**:
   - Over **40% of all medication discrepancies** occur at hospital discharge transitions, resulting in duplicate therapeutic classes and omitted chronic disease-modifying therapies, costing an estimated **$4,800 per preventable ADE**.

---

## 🏛️ System Architecture Flowchart

```mermaid
graph LR
    subgraph INPUTS ["1. Clinical Ingestion"]
        A["Patient Vitals & Diagnoses"] --> D["Deterministic Engine"]
        B["Structured Drug Regimen"] --> D
        C["Raw Clinical Note NLP<br/>(Brand-to-Generic Synonyms)"] --> D
    end

    subgraph FED_REST ["2. Federated Federal Intelligence"]
        E["NLM RxNorm Concept Resolver<br/>(rxcui.json)"]
        F["NLM RxClass Therapeutic Categories<br/>(byRxcui.json)"]
        G["OpenFDA FAERS Adverse Events<br/>(event.json count=6)"]
        H["25+ Offline Drug Cache<br/>(0ms Offline-First Failover)"]
        E -.-> H
        F -.-> H
        G -.-> H
    end

    subgraph CORE_ENGINE ["3. CascadeShield Rx Core Engine"]
        D --> I["Cockcroft-Gault CrCl Engine<br/>(Sarcopenia Floor Clamping)"]
        D --> J["Chronological DAG Cascade Matcher<br/>(12 BMJ/ThinkCascades Rules)"]
        D --> K["Beers Table 2 & Table 6 Renal Guard"]
        D --> L["Hospital Discharge Reconciliation Diff<br/>(Duplications & START v3 Omissions)"]
        H --> D
    end

    subgraph OUTPUTS ["4. Actionable Clinical Deliverables"]
        J --> M["Interactive SVG Causal Graph<br/>(Animated Cubic Bezier Flow)"]
        J --> N["Counterfactual BFS Simulator<br/>(Root-Cause Deprescribing)"]
        N --> O["5-Half-Life PK Washout Curve &<br/>4-Step Hyperbolic Taper Schedule"]
        D --> P["Composite Harm Index (PHI: 0-100)<br/>& Before/After Delta Badges"]
        D --> Q["HL7 FHIR R4 Clinical Bundle<br/>(Patient, MedStatement, DetectedIssue)"]
        D --> R["1-Page Physician Handoff Sheet<br/>(@media print with Checkboxes)"]
    end

    style INPUTS fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC
    style FED_REST fill:#1E293B,stroke:#818CF8,stroke-width:2px,color:#F8FAFC
    style CORE_ENGINE fill:#064E3B,stroke:#34D399,stroke-width:2px,color:#F8FAFC
    style OUTPUTS fill:#1E1B4B,stroke:#C084FC,stroke-width:2px,color:#F8FAFC
```

---

## 🖥️ Dual-Mode Full-Stack Backend Architecture & US Federal Telemetry

CascadeShield Rx implements a production-grade **3-Tier Full-Stack Architecture** engineered to operate seamlessly across local development, Vercel Serverless, and static hosting environments (e.g. GitHub Pages) with **zero 404 errors**:

```
                       ┌────────────────────────────────────────────────────────┐
                       │               CascadeShield Rx Client                  │
                       │           (Vite 6 + React 18 + TypeScript)             │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
                                                  ▼
                               ┌─────────────────────────────────────┐
                               │     src/engine/backendClient.ts     │
                               │   (Zero-404 Hybrid Gateway Client)  │
                               └──────────────────┬──────────────────┘
                                                  │
            ┌─────────────────────────────────────┴─────────────────────────────────────┐
            │ [Environment: Local Dev / Node CLI]                                       │ [Environment: Static GitHub Pages]
            ▼                                                                           ▼
┌───────────────────────────────────────┐                               ┌────────────────────────────────────────┐
│   server/clinicalServer.mjs           │                               │   Hybrid Browser Edge Worker           │
│   • Node.js REST API on port 8787     │                               │   • Native Web Crypto SHA-256 Signer   │
│   • GET /api/health                   │                               │   • Zero-404 Client-Side Fallback      │
│   • POST /api/clinical-audit          │                               │   • Persistent Audit Database          │
│   • POST /api/fhir-r4                 │                               │     (Retains 25 Latest Runs in LocalDB)│
│   • SHA-256 Crypto Hashing (Node)     │                               └──────────────────┬─────────────────────┘
└───────────────────────────────────────┘                                                  │
                                                                                           │ Parallel REST Telemetry
                                                                                           ▼
                                                        ┌────────────────────────────────────────────────────────┐
                                                        │         3 Live Keyless U.S. Federal Endpoints         │
                                                        │  1. NIH NLM RxNorm (rxnav.nlm.nih.gov)                │
                                                        │  2. NIH NLM RxClass (rxclass/class/byRxcui.json)      │
                                                        │  3. US FDA OpenFDA FAERS (api.fda.gov/drug/event.json) │
                                                        └────────────────────────────────────────────────────────┘
```

### Full-Stack Backend Components

1. **Standalone Node.js REST Backend Server (`server/clinicalServer.mjs`)**:
   - Zero external runtime dependencies: Built strictly with native `node:http` and `node:crypto`.
   - Listens on `http://localhost:8787` and exposes:
     - `GET /api/health`: Health status, version metadata, and validated clinical consensus standards.
     - `POST /api/clinical-audit`: Evaluates CrCl, Anticholinergic Burden (ACB), Drug Burden Index (DBI), Beers Criteria, prescribing cascades, and signs the resulting payload with a 64-character SHA-256 hash.
     - `POST /api/fhir-r4`: Converts any patient regimen into an official US-Core HL7 FHIR R4 Bundle.
     - `POST /api/nlp-parse`: Server-side extraction of medication brand synonyms and dosage schedules.
   - Run locally: `npm run server`

2. **Automated CI/CD Backend Verifier (`server/verifyBackend.mjs`)**:
   - Automatically tested on every Git push via GitHub Actions (`.github/workflows/deploy.yml`).
   - Spawns the Node.js server on an ephemeral port, verifies `GET /api/health` 200 OK, submits a full clinical audit payload to `POST /api/clinical-audit`, and asserts exact values:
     - Martha V. Creatinine Clearance: `32.4 mL/min`
     - Harm Index: `92/100` (4 cascade chains detected)
     - Valid 64-char hex SHA-256 signature generated and verified.
   - Run locally: `npm run test:backend`

3. **Vercel Serverless Function (`api/clinical-audit.ts`)**:
   - Production serverless function returning `X-Audit-Signature` and `sha256_integrity_hash` for automated cloud deployments on Vercel.

4. **Zero-404 Hybrid Gateway (`src/engine/backendClient.ts`)**:
   - Probes for local Node.js server and Vercel endpoints.
   - On static environments like GitHub Pages, seamlessly switches to the high-performance browser Edge Worker that queries the 3 U.S. Federal REST APIs in parallel, signs the FHIR bundle with the browser's native `window.crypto.subtle` API, and persists the audit in local storage.

5. **Interactive Live Backend Telemetry Console (Workspace Tab 3)**:
   - **Button A (`⚡ Execute POST /api/clinical-audit`)**: Triggers real-time audit execution, displaying round-trip latency, execution mode, SHA-256 hash, and metric deltas.
   - **Button B (`🌐 Ping US Federal APIs`)**: Live telemetry monitor querying NIH RxNorm, NIH RxClass, and FDA OpenFDA FAERS with round-trip millisecond gauges.
   - **Persistent Audit Database**: Logs up to 25 verified clinical runs with timestamps, patient vitals, and cryptographic hash verification.

---

## 📐 Mathematical Specification & Algorithmic Rigor

### 1. Cockcroft-Gault Creatinine Clearance ($\text{CrCl}$)
Calculated with a sarcopenia safety floor ($S_{cr} \ge 0.4\text{ mg/dL}$) to prevent infinite or falsely elevated filtration rates in bedbound older adults:
$$\text{CrCl} = \frac{(140 - \text{Age}) \times \text{Weight}_{\text{kg}}}{72 \times \max(0.4, S_{cr})} \times [0.85\text{ if female}]$$

### 2. Gap-Free Piecewise Temporal Decay Kernel ($W_{\text{window}}$)
Models clinical latency between index drug adverse reaction onset and marker drug initiation:
$$W_{\text{window}}(\Delta t, \tau_{\min}, \tau_{\max}) = \begin{cases} 
0.0 & \text{if } \Delta t \le 0 \\
0.75 & \text{if } 0 < \Delta t < \tau_{\min} \text{ (Hyper-acute inpatient onset)} \\
1.00 & \text{if } \tau_{\min} \le \Delta t \le \tau_{\max} \text{ (Peak clinical onset window)} \\
\max(0.25, e^{-(\Delta t - \tau_{\max})/180}) & \text{if } \tau_{\max} < \Delta t \le 365 \\
0.25 & \text{if } \Delta t > 365 
\end{cases}$$

### 3. Prescribing Cascade Confidence Score ($C_{\text{cascade}}$)
Evaluated on a deterministic 0–100 scale:
$$C_{\text{cascade}} = 100 \times (0.45 \cdot E + 0.35 \cdot W_{\text{window}} + 0.20 \cdot S_{\text{symptom}}) \times \gamma_{\text{confounder}}$$
*Where $E$ is epidemiological signal strength, $S_{\text{symptom}} \in \{1.0, 0.4\}$, and $\gamma = 0.65$ when a documented confounder comorbidity (e.g. Heart Failure/CHF) is present.*

### 4. Dose-Weighted Drug Burden Index ($\text{DBI}$)
Quantifies cumulative sedative and cholinergic saturation:
$$\text{DBI} = \sum_{m} \frac{D_m}{\delta_m + D_m}$$
*Where $D_m$ is daily dose and $\delta_m$ is minimum effective daily geriatric dose.*

### 5. Composite Polypharmacy Harm Index ($\text{PHI}$)
Comprehensive 0–100 composite index combining cascades, cognitive burden, Beers PIMs, and renal/reconciliation violations:
$$\text{PHI} = \min(100, S_{\text{cascade}} + S_{\text{acb}} + S_{\text{pim}} + S_{\text{renal}})$$

### 6. First-Order Pharmacokinetic Plasma Washout Curve
$$C(t) = 100 \times (0.5)^{\frac{24 \cdot t}{t_{1/2}}}$$
*Evaluates to exactly $3.13\%$ residual concentration after 5 half-lives ($96.88\%$ biological elimination).*

---

## 📋 The 4 Pre-Loaded Clinical Presets

| Case | Patient Profile | Active Cascade Domino Chain | Pre-Sim Risk | Counterfactual Substitution Plan | Post-Sim Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Case 1 (Default)** | **Martha V.** (78yo F)<br/>$\text{CrCl} = 32.4\text{ mL/min}$ | Amlodipine $\rightarrow$ Furosemide $\rightarrow$ Oxybutynin $\rightarrow$ Donepezil $\rightarrow$ Zolpidem (4 Edges) | $\text{PHI} = 92$<br/>$\text{ACB} = 4$<br/>$\text{DBI} = 1.17$ | **Switch Amlodipine 10mg $\rightarrow$ Losartan 50mg (ARB)**.<br/>BFS severs all 4 downstream edges. | **$\text{PHI} = 12$**<br/>**$\text{ACB} = 0$**<br/>**$4,800 ADE Saved** |
| **Case 2** | **Arthur K.** (81yo M)<br/>$\text{CrCl} = 24.9\text{ mL/min}$ (CKD 4) | Atorvastatin $\rightarrow$ Naproxen $\rightarrow$ Amlodipine + Baclofen + Ciprofloxacin | $\text{PHI} = 82$<br/>3 Beers Table 6 Renal Alerts | **Step 1**: Sever Statin ($\text{PHI } 82 \rightarrow 48$).<br/>**Step 2**: Renal optimization of Baclofen &amp; Cipro. | **$\text{PHI} = 12$**<br/>Renal Toxicity Eliminated |
| **Case 3** | **Eleanor R.** (74yo F)<br/>$\text{CrCl} = 53.0\text{ mL/min}$ | Iron $\rightarrow$ Senna $\rightarrow$ Loperamide + Prednisone $\rightarrow$ Quetiapine | $\text{PHI} = 94$<br/>$\text{ACB} = 6$<br/>2 Discrepancies | **Discharge Reconciliation**: Stop duplicate Lopressor, restore omitted Jardiance, alternate-day iron. | **$\text{PHI} = 12$**<br/>**$\text{ACB} = 1$**<br/>START v3 Resolved |
| **Case 4** | **Custom Builder** | Interactive sliders for Age, Sex, Weight, SCr + Zero-Key Clinical Note NLP Parser. | Real-time | Type custom drugs or paste doctor's discharge summary. | Instant DAG recalculation |

---

## 🧪 The 15 Automated Clinical Unit Tests Matrix

All 15 assertions execute dynamically inside the browser and via CLI with **100% PASS rate**:

| # | Assertion Title | Key Formula / Parameters Tested | Expected Output | Actual Output | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Reverse Chronology Rejection | `calcCascadeConfidence(0.92, -30, 3, 30, true, false)` | `0` | `0` | **PASS** |
| **2** | Same-Day Co-Initiation Guard | `calcCascadeConfidence(0.92, 0, 3, 30, true, false)` | `0` | `0` | **PASS** |
| **3** | Hyper-Acute Hospital Window | `calcCascadeConfidence(0.98, 3, 1, 14, true, false)` | `99` | `99` | **PASS** |
| **4** | Peak Outpatient Onset Window | `calcCascadeConfidence(0.92, 24, 3, 30, true, false)` | `96` | `96` | **PASS** |
| **5** | Comorbidity Confounder Damping | `calcCascadeConfidence(0.92, 24, 3, 30, true, true)` ($\gamma = 0.65$) | `63` | `63` | **PASS** |
| **6** | Intentional Gastroprotection | Naproxen + Omeprazole co-prescription | `PROTECTIVE_INTENTIONAL` (0 pts) | `PROTECTIVE_INTENTIONAL` (0 pts) | **PASS** |
| **7** | Cockcroft-Gault Female Standard | Age 78, Female, 62 kg, SCr 1.4 mg/dL | `32.4 mL/min` | `32.4 mL/min` | **PASS** |
| **8** | Cockcroft-Gault Male Stage 4 CKD | Age 81, Male, 70 kg, SCr 2.3 mg/dL | `24.9 mL/min` | `24.9 mL/min` | **PASS** |
| **9** | SCr Division-by-Zero Guard | Age 80, Male, 70 kg, SCr 0 mg/dL (clamped to 0.4) | `145.8 mL/min` | `145.8 mL/min` | **PASS** |
| **10** | Beers Table 6 Renal Threshold | At CrCl 24.9 mL/min, flags Baclofen, Naproxen, Cipro | Flags all 3 contraindicated drugs | Flagged all 3 drugs | **PASS** |
| **11** | Boustani ACB Dementia Threshold | Oxybutynin (3) + Furosemide (1) = $4 \ge 3$ | Triggers Dementia $OR = 2.63$ alert | Alert Triggered | **PASS** |
| **12** | Hyperbolic DBI Math | $10/(5+10) + 5/(5+5)$ | `1.17` | `1.17` | **PASS** |
| **13** | Case 1 Root ARB Switch Delta | Martha V. Amlodipine $\rightarrow$ Losartan substitution | $\text{PHI } 92 \rightarrow 12$ | $\text{PHI } 92 \rightarrow 12$ | **PASS** |
| **14** | DAG Cycle Immunity & PK Washout | Cycle $A \leftrightarrow B$ terminates; $t = 2.5\text{d}, t_{1/2} = 12\text{h}$ | Terminates with `[B]` &amp; Washout `3.13%` | `[B]` &amp; `3.13%` | **PASS** |
| **15** | Offline Federal Cache Failover | Querying Amlodipine under network isolation | RxCUI 17767 + 6 FAERS in &lt; 5ms | RxCUI 17767 + 6 FAERS in 0ms | **PASS** |

---

## 💻 30-Second Local Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/arulmuruganmcse2024-tech/cascadeshield-rx.git
cd cascadeshield-rx

# 2. Install dependencies
npm install

# 3. Verify Node.js Full-Stack REST Backend & Clinical Assertions
npm run test:backend

# 4. (Optional) Run Standalone Node.js REST API Server on port 8787
npm run server

# 5. Start local Vite development server
npm run dev
# -> Opens http://localhost:3000

# 6. Run TypeScript check & production build
npm run build
```

---

## 📄 License & Attribution

This project is open-source under the [MIT License](LICENSE).  
Clinical rules and algorithms are synthesized from peer-reviewed publications:
- **BMJ PIPC Cohort Study (September 2026)**: *Prioritizing Prescribing Cascades in Older Adults: A Population-Based Cohort Study ($N = 2.3\text{M}$).*
- **Annals of Family Medicine (June 2025)**: *ThinkCascades: Identification of Clinically Important Prescribing Cascades in Older Adults.*
- **American Geriatrics Society (AGS)**: *2023 AGS Beers Criteria® for Potentially Inappropriate Medication Use in Older Adults & July 2025 Alternative Medications List.*
- **HL7 International**: *HL7 FHIR® Release 4 (R4) Interoperability Standard.*
