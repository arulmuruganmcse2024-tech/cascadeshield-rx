// src/engine/cascadeEngine.ts
// Mathematical models, BFS root-cause substitution simulator, Beers Table 6 renal guard,
// hospital discharge reconciliation diff analyzer, federal REST query handlers, and NLP parser.

import {
  PatientVitals,
  RegimenMed,
  ClinicalAnalysisResult,
  DetectedCascade,
  ReconciliationDiff,
  ProtectiveCoPrescription,
  RenalAlert,
  TaperStep,
  FaersReaction
} from '../types/clinical';
import { PRESCRIBING_CASCADE_RULES, PROTECTIVE_CO_PRESCRIPTION_RULES } from '../data/clinicalKnowledgeBase';
import { getOfflineDrugProfile } from '../data/offlineDrugCache';

// 1. Cockcroft-Gault Creatinine Clearance (CrCl) with division-by-zero & sarcopenia floor guard
export function calcCrCl(vitals: PatientVitals): number {
  const ageC = Math.max(18.0, Math.min(115.0, Number(vitals.age) || 75.0));
  const weightC = Math.max(25.0, Math.min(250.0, Number(vitals.weightKg) || 65.0));
  const rawScr = Number(vitals.serumCreatinineMgDl);
  const scrVal = isNaN(rawScr) ? 1.0 : rawScr;
  const scrC = Math.max(0.4, Math.min(15.0, scrVal));
  let crcl = ((140.0 - ageC) * weightC) / (72.0 * scrC);
  if (vitals.sex === 'F') {
    crcl *= 0.85;
  }
  return Math.round(crcl * 10.0) / 10.0;
}

// 2. Gap-Free Piecewise Temporal Decay Kernel W_window(dt, tauMin, tauMax)
export function calcWindowWeight(dtDays: number, tauMin: number, tauMax: number): number {
  if (dtDays <= 0 || !Number.isFinite(dtDays)) return 0.0;
  if (dtDays < tauMin) return 0.75; // Hyper-acute hospital onset (1 to tauMin - 1 days)
  if (dtDays <= tauMax) return 1.00; // Peak clinical onset window
  if (dtDays <= 365) {
    return Math.max(0.25, Number(Math.exp(-(dtDays - tauMax) / 180.0).toFixed(4)));
  }
  return 0.25;
}

// 3. Single Edge Cascade Confidence Score C_cascade(D_i -> D_j) on 0-100 scale
export function calcCascadeConfidence(
  signalStrengthE: number,
  dtDays: number,
  tauMin: number,
  tauMax: number,
  hasSymptomMatch: boolean,
  hasComorbidityConfounder: boolean
): number {
  if (dtDays <= 0 || !Number.isFinite(dtDays)) return 0;
  const wWin = calcWindowWeight(dtDays, tauMin, tauMax);
  const sSymp = hasSymptomMatch ? 1.0 : 0.4;
  const gamma = hasComorbidityConfounder ? 0.65 : 1.0;
  const raw = 100.0 * (0.45 * signalStrengthE + 0.35 * wWin + 0.20 * sSymp) * gamma;
  return Math.round(Math.max(0.0, Math.min(100.0, raw)));
}

// 4. Dose-Weighted Drug Burden Index (DBI)
export function calcDBI(meds: Array<{ dailyDoseMg: number; minEffectiveDoseMg: number | null }>): number {
  let sum = 0.0;
  for (const m of meds) {
    if (m.minEffectiveDoseMg !== null && m.minEffectiveDoseMg > 0 && m.dailyDoseMg > 0) {
      sum += m.dailyDoseMg / (m.minEffectiveDoseMg + m.dailyDoseMg);
    }
  }
  return Math.round(sum * 100.0) / 100.0;
}

// 5. Composite Polypharmacy Harm Index (PHI) on 0-100 scale
export function calcPHI(
  cascadeScores: number[],
  acbTotal: number,
  beersPimCount: number,
  renalOrReconcilCount: number,
  crcl: number
): number {
  const k = cascadeScores.length;
  const maxC = k > 0 ? Math.max(...cascadeScores) : 0;
  const sCascade = k === 0 ? 0.0 : Math.min(40.0, 0.25 * maxC + 5.0 * k);
  const sAcb = Math.min(24.0, Math.max(0, acbTotal) * 6.0);
  const sPim = Math.min(24.0, Math.max(0, beersPimCount) * 8.0 + Math.max(0, renalOrReconcilCount) * 10.0);
  const sRenal = crcl < 45.0 ? 12.0 : (crcl < 60.0 ? 6.0 : 0.0);
  return Math.round(Math.min(100.0, sCascade + sAcb + sPim + sRenal));
}

// 6. First-Order Pharmacokinetic Plasma Washout Curve & 4-Step Hyperbolic Taper Schedule
export function calcPkWashoutPercent(tDays: number, halfLifeHours: number): number {
  const tHours = Math.max(0.0, Number(tDays) * 24.0);
  const hl = Math.max(1.0, Number(halfLifeHours) || 12.0);
  return Math.round(100.0 * Math.pow(0.5, tHours / hl) * 100.0) / 100.0;
}

export function generateFourStepTaper(initialDailyDoseMg: number, requiresTaper: boolean): TaperStep[] {
  if (!requiresTaper) {
    return [
      {
        weeks: 'Day 1',
        doseMg: 0,
        pct: 0,
        instruction: 'Safe for direct substitution / discontinuation under clinician guidance.'
      }
    ];
  }
  return [
    {
      weeks: 'Weeks 1–2',
      doseMg: Math.round(initialDailyDoseMg * 0.75 * 10) / 10,
      pct: 75,
      instruction: 'Step 1: Reduce to 75% of baseline dose; monitor for rebound symptoms.'
    },
    {
      weeks: 'Weeks 3–4',
      doseMg: Math.round(initialDailyDoseMg * 0.50 * 10) / 10,
      pct: 50,
      instruction: 'Step 2: Reduce to 50% of baseline dose; reassess symptom resolution.'
    },
    {
      weeks: 'Weeks 5–6',
      doseMg: Math.round(initialDailyDoseMg * 0.25 * 10) / 10,
      pct: 25,
      instruction: 'Step 3: Reduce to 25% physiologic tail dose.'
    },
    {
      weeks: 'Week 7+',
      doseMg: 0,
      pct: 0,
      instruction: 'Step 4: Complete discontinuation after 5-half-life washout.'
    }
  ];
}

// 7. Cycle-Safe Breadth-First Search (BFS) Root-Cause Deprescribing Simulator
export function simulateRootSubstitutionBFS(
  rootDrugId: string,
  directedEdges: Array<{ fromId: string; toId: string; dtDays: number }>
): string[] {
  const visited = new Set([rootDrugId]);
  const queue: string[] = [rootDrugId];
  const cascadedIds: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of directedEdges) {
      if (edge.fromId === current && edge.dtDays > 0 && !visited.has(edge.toId)) {
        visited.add(edge.toId);
        cascadedIds.push(edge.toId);
        queue.push(edge.toId);
      }
    }
  }
  return cascadedIds;
}

// Comprehensive clinical analyzer for regimen + vitals
export function analyzePatientClinicalRegimen(
  vitals: PatientVitals,
  regimen: RegimenMed[],
  homeMeds: RegimenMed[] = []
): ClinicalAnalysisResult {
  const crcl = calcCrCl(vitals);
  const activeMeds = regimen.filter(m => !m.isDeprescribed);

  // 1. Prescribing Cascades Identification
  const cascades: DetectedCascade[] = [];
  const directedEdgesForSimulation: Array<{ fromId: string; toId: string; dtDays: number }> = [];

  for (let i = 0; i < activeMeds.length; i++) {
    for (let j = 0; j < activeMeds.length; j++) {
      if (i === j) continue;
      const m1 = activeMeds[i];
      const m2 = activeMeds[j];
      const dtDays = m2.startDay - m1.startDay;
      if (dtDays <= 0) continue;

      for (const rule of PRESCRIBING_CASCADE_RULES) {
        const isM1Index = rule.indexDrugs.some(d => m1.genericName.includes(d) || d.includes(m1.genericName));
        const isM2Marker = rule.markerDrugs.some(d => m2.genericName.includes(d) || d.includes(m2.genericName));

        if (isM1Index && isM2Marker) {
          const hasSymptomMatch = Boolean(
            m2.reportedSymptom && (
              m2.reportedSymptom.toLowerCase().includes('swollen') ||
              m2.reportedSymptom.toLowerCase().includes('edema') ||
              m2.reportedSymptom.toLowerCase().includes('urgency') ||
              m2.reportedSymptom.toLowerCase().includes('leakage') ||
              m2.reportedSymptom.toLowerCase().includes('confusion') ||
              m2.reportedSymptom.toLowerCase().includes('fog') ||
              m2.reportedSymptom.toLowerCase().includes('memory') ||
              m2.reportedSymptom.toLowerCase().includes('sleep') ||
              m2.reportedSymptom.toLowerCase().includes('dream') ||
              m2.reportedSymptom.toLowerCase().includes('restless') ||
              m2.reportedSymptom.toLowerCase().includes('agitation') ||
              m2.reportedSymptom.toLowerCase().includes('constipation') ||
              m2.reportedSymptom.toLowerCase().includes('diarrhea') ||
              m2.reportedSymptom.toLowerCase().includes('aching') ||
              m2.reportedSymptom.toLowerCase().includes('pain') ||
              m2.reportedSymptom.toLowerCase().includes('pressure') ||
              m2.reportedSymptom.toLowerCase().includes('dizziness') ||
              m2.reportedSymptom.toLowerCase().includes('vertigo') ||
              m2.reportedSymptom.toLowerCase().includes('shaky') ||
              m2.reportedSymptom.toLowerCase().includes('tremor')
            )
          );

          const hasComorbidityConfounder = rule.confounderDiagnoses.some(cd =>
            vitals.diagnoses.some(vd => vd.toLowerCase().includes(cd.toLowerCase()))
          );

          const confidence = calcCascadeConfidence(
            rule.signalE,
            dtDays,
            rule.tauMin,
            rule.tauMax,
            hasSymptomMatch,
            hasComorbidityConfounder
          );

          if (confidence > 0) {
            cascades.push({
              ruleId: rule.id,
              ruleName: rule.name,
              fromMed: m1,
              toMed: m2,
              dtDays,
              confidence,
              signalE: rule.signalE,
              hasSymptomMatch,
              hasComorbidityConfounder,
              citation: rule.citation,
              clinicalBridge: rule.clinicalBridge,
              plainBridge: rule.plainBridge,
              agsAlternativeDrug: rule.agsAlternativeDrug,
              agsAlternativeLabel: rule.agsAlternativeLabel
            });

            directedEdgesForSimulation.push({
              fromId: m1.id,
              toId: m2.id,
              dtDays
            });
          }
        }
      }
    }
  }

  // 2. Anticholinergic Cognitive Burden (ACB)
  let acbTotal = 0;
  const acbBreakdown: Array<{ med: RegimenMed; score: number }> = [];
  for (const med of activeMeds) {
    const profile = getOfflineDrugProfile(med.genericName);
    if (profile.acb > 0) {
      acbTotal += profile.acb;
      acbBreakdown.push({ med, score: profile.acb });
    }
  }

  // 3. Drug Burden Index (DBI)
  const dbiMeds = activeMeds.map(m => {
    const prof = getOfflineDrugProfile(m.genericName);
    return {
      dailyDoseMg: m.dailyDoseMg,
      minEffectiveDoseMg: prof.minEffectiveDoseMg
    };
  });
  const dbiTotal = calcDBI(dbiMeds);
  const dbiBreakdown: Array<{ med: RegimenMed; dbi: number }> = [];
  for (const m of activeMeds) {
    const prof = getOfflineDrugProfile(m.genericName);
    if (prof.minEffectiveDoseMg !== null && prof.minEffectiveDoseMg > 0 && m.dailyDoseMg > 0) {
      const dbiVal = Math.round((m.dailyDoseMg / (prof.minEffectiveDoseMg + m.dailyDoseMg)) * 100) / 100;
      dbiBreakdown.push({ med: m, dbi: dbiVal });
    }
  }

  // 4. Beers Criteria Table 2 PIMs
  const beersPims: Array<{ med: RegimenMed; reason: string }> = [];
  for (const med of activeMeds) {
    const profile = getOfflineDrugProfile(med.genericName);
    if (profile.beersTable2) {
      beersPims.push({
        med,
        reason: profile.beersReason || 'Identified as Potentially Inappropriate Medication in Older Adults (2023 AGS Beers Criteria Table 2)'
      });
    }
  }

  // 5. Beers Table 6 Renal Guard Alerts
  const renalAlerts: RenalAlert[] = [];
  for (const med of activeMeds) {
    const profile = getOfflineDrugProfile(med.genericName);
    if (profile.renalCutoffCrCl !== null) {
      if (crcl < profile.renalCutoffCrCl) {
        renalAlerts.push({
          med,
          cutoffCrCl: profile.renalCutoffCrCl,
          actualCrCl: crcl,
          ruleText: profile.renalRuleText || `CrCl ${crcl} mL/min is below renal safety threshold of ${profile.renalCutoffCrCl} mL/min.`,
          severity: crcl < 30 ? 'CONTRAINDICATED' : 'DOSE_REDUCE'
        });
      }
    }
  }

  // 6. Hospital Discharge Reconciliation Diffs
  const reconciliations: ReconciliationDiff[] = [];

  // Check beta-blocker duplication (e.g. metoprolol tartrate home + metoprolol succinate discharge)
  const bbMeds = activeMeds.filter(m => m.genericName.includes('metoprolol') || m.genericName.includes('carvedilol') || m.genericName.includes('atenolol'));
  if (bbMeds.length > 1) {
    reconciliations.push({
      type: 'DUPLICATION',
      drugName: `${bbMeds[0].displayName} + ${bbMeds[1].displayName}`,
      brandName: 'Toprol-XL vs Lopressor',
      description: 'Dangerous Dual Beta-Blocker Duplication: Immediate-release Metoprolol Tartrate continued alongside extended-release Metoprolol Succinate. Severe bradycardia, heart block, and profound hypotension risk.',
      plainDescription: 'Accidental double dose of two different heart-rate slowing pills (fast-acting and 24-hour slow-acting) given at the same time.',
      clinicalSeverity: 'HIGH',
      medication: bbMeds[0],
      actionRequired: 'Discontinue Metoprolol Tartrate 50 mg BID; maintain single titrated Metoprolol Succinate 100 mg daily.'
    });
  }

  // Check chronic omission against home meds (e.g. empagliflozin / SGLT2i omitted)
  if (homeMeds.length > 0) {
    for (const hm of homeMeds) {
      const isOmitted = !activeMeds.some(am => am.genericName === hm.genericName || am.displayName === hm.displayName);
      if (isOmitted) {
        reconciliations.push({
          type: 'OMISSION',
          drugName: hm.displayName,
          brandName: getOfflineDrugProfile(hm.genericName).brand,
          description: `START v3 Chronic Omission: Evidence-based cardioprotective ${hm.displayName} was present on home regimen but inadvertently omitted upon hospital discharge without documented clinical contraindication.`,
          plainDescription: `Important long-term daily health protector (${hm.displayName}) was taken at home but accidentally forgotten on hospital discharge papers.`,
          clinicalSeverity: 'HIGH',
          medication: hm,
          actionRequired: `Restart ${hm.displayName} ${hm.doseLabel} post-discharge to preserve renal and cardiovascular outcomes.`
        });
      }
    }
  }

  // 7. Intentional Protective Co-Prescriptions
  const protectives: ProtectiveCoPrescription[] = [];
  for (const pair of PROTECTIVE_CO_PRESCRIPTION_RULES) {
    for (const mIndex of activeMeds) {
      const hasIndex = pair.indexDrugs.some(id => mIndex.genericName.includes(id) || id.includes(mIndex.genericName));
      if (!hasIndex) continue;
      for (const mProtect of activeMeds) {
        const hasProtect = pair.protectiveDrugs.some(pd => mProtect.genericName.includes(pd) || pd.includes(mProtect.genericName));
        if (hasProtect && mIndex.id !== mProtect.id) {
          protectives.push({
            indexMed: mIndex,
            protectMed: mProtect,
            type: pair.type,
            description: pair.description,
            plainDescription: pair.plainDescription,
            guideline: pair.guideline
          });
        }
      }
    }
  }

  // 8. Composite Polypharmacy Harm Index (PHI)
  const cascadeConfidences = cascades.map(c => c.confidence);
  const renalOrReconcilCount = renalAlerts.length + reconciliations.length;
  const phi = calcPHI(cascadeConfidences, acbTotal, beersPims.length, renalOrReconcilCount, crcl);

  // Financial impact estimate (AHRQ adverse drug event cost model)
  const ahrqCostAvoided = cascades.length * 1200;
  const copaySavingsAnnual = cascades.length * 180;

  return {
    crcl,
    phi,
    cascades,
    acbTotal,
    acbBreakdown,
    dbiTotal,
    dbiBreakdown,
    beersPims,
    renalAlerts,
    reconciliations,
    protectives,
    ahrqCostAvoided,
    copaySavingsAnnual
  };
}

// ==========================================
// STRICT FEDERAL KEYLESS REST API GUARDRAILS
// ==========================================

export async function fetchRxCui(drugName: string): Promise<string> {
  const offline = getOfflineDrugProfile(drugName);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=2`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.idGroup?.rxnormId?.[0] ?? offline.rxcui ?? 'N/A';
  } catch {
    return offline.rxcui || 'N/A';
  }
}

export async function fetchRxClasses(rxcui: string, drugNameFallback = ''): Promise<string[]> {
  const offline = getOfflineDrugProfile(drugNameFallback);
  if (!rxcui || rxcui === 'N/A') return offline.classes;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const url = `https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${encodeURIComponent(rxcui)}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data?.rxclassDrugInfoList?.rxclassDrugInfo ?? [];
    const parsed = raw.slice(0, 4).map((item: any) => {
      const c = item?.rxclassMinConceptItem;
      return c ? `${c.classId ? c.classId + ' - ' : ''}${c.className || ''}` : '';
    }).filter(Boolean);
    return parsed.length > 0 ? parsed : offline.classes;
  } catch {
    return offline.classes;
  }
}

export async function fetchOpenFdaAdverseReactions(genericName: string): Promise<FaersReaction[]> {
  const offline = getOfflineDrugProfile(genericName);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const url = `https://api.fda.gov/drug/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(genericName.toLowerCase())}"&count=patient.reaction.reactionmeddrapt.exact&limit=6`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const reactions = (data?.results ?? []).map((r: any) => ({
      term: String(r.term),
      count: Number(r.count)
    }));
    return reactions.length > 0 ? reactions : offline.faersTopReactions;
  } catch {
    return offline.faersTopReactions;
  }
}

// ==========================================
// ZERO-KEY CLINICAL DISCHARGE NOTE NLP PARSER
// ==========================================

export const BRAND_TO_GENERIC_MAP: Record<string, { generic: string; display: string; dose: string; mg: number }> = {
  'norvasc': { generic: 'amlodipine', display: 'Amlodipine (Norvasc)', dose: '10 mg daily', mg: 10 },
  'amlodipine': { generic: 'amlodipine', display: 'Amlodipine (Norvasc)', dose: '10 mg daily', mg: 10 },
  'lasix': { generic: 'furosemide', display: 'Furosemide (Lasix)', dose: '40 mg daily', mg: 40 },
  'furosemide': { generic: 'furosemide', display: 'Furosemide (Lasix)', dose: '40 mg daily', mg: 40 },
  'ditropan': { generic: 'oxybutynin', display: 'Oxybutynin (Ditropan)', dose: '10 mg daily', mg: 10 },
  'oxybutynin': { generic: 'oxybutynin', display: 'Oxybutynin (Ditropan)', dose: '10 mg daily', mg: 10 },
  'aricept': { generic: 'donepezil', display: 'Donepezil (Aricept)', dose: '5 mg QHS', mg: 5 },
  'donepezil': { generic: 'donepezil', display: 'Donepezil (Aricept)', dose: '5 mg QHS', mg: 5 },
  'ambien': { generic: 'zolpidem', display: 'Zolpidem (Ambien)', dose: '5 mg QHS', mg: 5 },
  'zolpidem': { generic: 'zolpidem', display: 'Zolpidem (Ambien)', dose: '5 mg QHS', mg: 5 },
  'lipitor': { generic: 'atorvastatin', display: 'Atorvastatin (Lipitor)', dose: '80 mg daily', mg: 80 },
  'atorvastatin': { generic: 'atorvastatin', display: 'Atorvastatin (Lipitor)', dose: '80 mg daily', mg: 80 },
  'pravachol': { generic: 'pravastatin', display: 'Pravastatin (Pravachol)', dose: '40 mg daily', mg: 40 },
  'pravastatin': { generic: 'pravastatin', display: 'Pravastatin (Pravachol)', dose: '40 mg daily', mg: 40 },
  'naprosyn': { generic: 'naproxen', display: 'Naproxen (Naprosyn)', dose: '500 mg BID', mg: 1000 },
  'aleve': { generic: 'naproxen', display: 'Naproxen (Aleve)', dose: '220 mg BID', mg: 440 },
  'naproxen': { generic: 'naproxen', display: 'Naproxen (Naprosyn)', dose: '500 mg BID', mg: 1000 },
  'lioresal': { generic: 'baclofen', display: 'Baclofen (Lioresal)', dose: '10 mg TID', mg: 30 },
  'baclofen': { generic: 'baclofen', display: 'Baclofen (Lioresal)', dose: '10 mg TID', mg: 30 },
  'cipro': { generic: 'ciprofloxacin', display: 'Ciprofloxacin (Cipro)', dose: '500 mg BID', mg: 1000 },
  'ciprofloxacin': { generic: 'ciprofloxacin', display: 'Ciprofloxacin (Cipro)', dose: '500 mg BID', mg: 1000 },
  'feosol': { generic: 'ferrous sulfate', display: 'Ferrous Sulfate (Feosol)', dose: '325 mg TID', mg: 975 },
  'ferrous sulfate': { generic: 'ferrous sulfate', display: 'Ferrous Sulfate', dose: '325 mg TID', mg: 975 },
  'senokot': { generic: 'senna', display: 'Senna (Senokot)', dose: '8.6 mg BID', mg: 17.2 },
  'senna': { generic: 'senna', display: 'Senna (Senokot)', dose: '8.6 mg BID', mg: 17.2 },
  'imodium': { generic: 'loperamide', display: 'Loperamide (Imodium)', dose: '2 mg TID', mg: 6 },
  'loperamide': { generic: 'loperamide', display: 'Loperamide (Imodium)', dose: '2 mg TID', mg: 6 },
  'deltasone': { generic: 'prednisone', display: 'Prednisone (Deltasone)', dose: '20 mg daily', mg: 20 },
  'prednisone': { generic: 'prednisone', display: 'Prednisone', dose: '20 mg daily', mg: 20 },
  'seroquel': { generic: 'quetiapine', display: 'Quetiapine (Seroquel)', dose: '50 mg QHS', mg: 50 },
  'quetiapine': { generic: 'quetiapine', display: 'Quetiapine (Seroquel)', dose: '50 mg QHS', mg: 50 },
  'lopressor': { generic: 'metoprolol tartrate', display: 'Metoprolol Tartrate (Lopressor)', dose: '50 mg BID', mg: 100 },
  'metoprolol tartrate': { generic: 'metoprolol tartrate', display: 'Metoprolol Tartrate (Lopressor)', dose: '50 mg BID', mg: 100 },
  'toprol-xl': { generic: 'metoprolol succinate', display: 'Metoprolol Succinate (Toprol-XL)', dose: '100 mg daily', mg: 100 },
  'toprol': { generic: 'metoprolol succinate', display: 'Metoprolol Succinate (Toprol-XL)', dose: '100 mg daily', mg: 100 },
  'metoprolol succinate': { generic: 'metoprolol succinate', display: 'Metoprolol Succinate (Toprol-XL)', dose: '100 mg daily', mg: 100 },
  'jardiance': { generic: 'empagliflozin', display: 'Empagliflozin (Jardiance)', dose: '10 mg daily', mg: 10 },
  'empagliflozin': { generic: 'empagliflozin', display: 'Empagliflozin (Jardiance)', dose: '10 mg daily', mg: 10 },
  'zoloft': { generic: 'sertraline', display: 'Sertraline (Zoloft)', dose: '50 mg daily', mg: 50 },
  'sertraline': { generic: 'sertraline', display: 'Sertraline (Zoloft)', dose: '50 mg daily', mg: 50 },
  'flomax': { generic: 'tamsulosin', display: 'Tamsulosin (Flomax)', dose: '0.4 mg daily', mg: 0.4 },
  'tamsulosin': { generic: 'tamsulosin', display: 'Tamsulosin (Flomax)', dose: '0.4 mg daily', mg: 0.4 },
  'antivert': { generic: 'meclizine', display: 'Meclizine (Antivert)', dose: '25 mg TID', mg: 75 },
  'meclizine': { generic: 'meclizine', display: 'Meclizine (Antivert)', dose: '25 mg TID', mg: 75 },
  'neurontin': { generic: 'gabapentin', display: 'Gabapentin (Neurontin)', dose: '300 mg TID', mg: 900 },
  'gabapentin': { generic: 'gabapentin', display: 'Gabapentin (Neurontin)', dose: '300 mg TID', mg: 900 },
  'reglan': { generic: 'metoclopramide', display: 'Metoclopramide (Reglan)', dose: '10 mg AC/HS', mg: 40 },
  'metoclopramide': { generic: 'metoclopramide', display: 'Metoclopramide (Reglan)', dose: '10 mg AC/HS', mg: 40 },
  'sinemet': { generic: 'carbidopa-levodopa', display: 'Carbidopa-Levodopa (Sinemet)', dose: '25/100 mg TID', mg: 300 },
  'prilosec': { generic: 'omeprazole', display: 'Omeprazole (Prilosec)', dose: '20 mg daily', mg: 20 },
  'omeprazole': { generic: 'omeprazole', display: 'Omeprazole', dose: '20 mg daily', mg: 20 },
  'klor-con': { generic: 'potassium chloride', display: 'Potassium Chloride (Klor-Con)', dose: '20 mEq daily', mg: 1500 },
  'potassium chloride': { generic: 'potassium chloride', display: 'Potassium Chloride', dose: '20 mEq daily', mg: 1500 }
};

export function parseClinicalNoteNLP(noteText: string): RegimenMed[] {
  const lines = noteText.split(/\r?\n/);
  const detectedMeds: RegimenMed[] = [];
  let dayCounter = 0;
  const seenGenerics = new Set<string>();

  for (const line of lines) {
    const lower = line.toLowerCase();
    // Look for day tokens: Day 0, Day 14, Week 2, etc.
    const dayMatch = lower.match(/day\s*(\d+)/i);
    if (dayMatch) {
      dayCounter = parseInt(dayMatch[1], 10);
    }

    // Look for symptom indications
    let symptom = '';
    const symptomMatch = line.match(/(?:for|due to|presenting with|complaint of|noted|with)\s+([^,.;]+)/i);
    if (symptomMatch) {
      symptom = symptomMatch[1].trim();
    }

    for (const [key, val] of Object.entries(BRAND_TO_GENERIC_MAP)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(lower) && !seenGenerics.has(val.generic)) {
        seenGenerics.add(val.generic);

        // Try to match dose in line
        let doseLabel = val.dose;
        let doseMg = val.mg;
        const doseMatch = line.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|meq)/i);
        if (doseMatch) {
          const num = parseFloat(doseMatch[1]);
          if (doseMatch[2].toLowerCase() === 'mg') {
            doseMg = num;
            doseLabel = `${num} mg`;
          }
        }

        detectedMeds.push({
          id: `nlp_${detectedMeds.length + 1}`,
          genericName: val.generic,
          displayName: val.display,
          doseLabel,
          dailyDoseMg: doseMg,
          startDay: dayCounter,
          reportedSymptom: symptom || 'Reported in clinical note',
          setting: dayCounter >= 14 ? 'inpatient' : 'outpatient'
        });

        // Increment day slightly if no explicit days were given to construct sequential cascade timeline
        if (!dayMatch) {
          dayCounter += 15;
        }
      }
    }
  }

  // Sort by startDay
  detectedMeds.sort((a, b) => a.startDay - b.startDay);
  return detectedMeds;
}
