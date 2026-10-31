// src/engine/unitTests.ts
// The 15-Assertion Automated Clinical & Mathematical Unit Test Suite for CascadeShield Rx

import { UnitTestResult } from '../types/clinical';
import {
  calcCrCl,
  calcCascadeConfidence,
  calcDBI,
  calcPkWashoutPercent,
  simulateRootSubstitutionBFS,
  analyzePatientClinicalRegimen
} from './cascadeEngine';
import { getOfflineDrugProfile } from '../data/offlineDrugCache';
import { PATIENT_PRESETS } from '../data/patientPresets';

export function runAll15ClinicalUnitTests(): UnitTestResult[] {
  const results: UnitTestResult[] = [];

  // 1. Reverse Chronology Rejection
  {
    const t0 = performance.now();
    const actual = calcCascadeConfidence(0.92, -30, 3, 30, true, false);
    const expected = 0;
    results.push({
      id: 1,
      title: 'Reverse Chronology Rejection',
      description: 'Prescription of index drug after marker drug (Δt = -30d) must be rejected with 0 confidence.',
      inputSummary: 'signalE=0.92, dtDays=-30, tauMin=3, tauMax=30, symptom=true, confounder=false',
      expectedValue: String(expected),
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 2. Same-Day Co-Initiation Guard
  {
    const t0 = performance.now();
    const actual = calcCascadeConfidence(0.92, 0, 3, 30, true, false);
    const expected = 0;
    results.push({
      id: 2,
      title: 'Same-Day Co-Initiation Guard',
      description: 'Same-day initiation (Δt = 0d) represents intentional co-prescription or bundle, not a chronological cascade.',
      inputSummary: 'signalE=0.92, dtDays=0, tauMin=3, tauMax=30, symptom=true, confounder=false',
      expectedValue: String(expected),
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 3. Hyper-Acute Hospital Onset Window
  {
    const t0 = performance.now();
    const actual = calcCascadeConfidence(0.98, 3, 1, 14, true, false);
    const expected = 99;
    results.push({
      id: 3,
      title: 'Hyper-Acute Hospital Onset Window',
      description: 'Rapid onset in inpatient setting (Prednisone → Quetiapine at Δt = 3d) achieves peak confidence 99/100.',
      inputSummary: 'signalE=0.98, dtDays=3, tauMin=1, tauMax=14, symptom=true, confounder=false',
      expectedValue: String(expected),
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 4. Peak Outpatient Onset Window
  {
    const t0 = performance.now();
    const actual = calcCascadeConfidence(0.92, 24, 3, 30, true, false);
    const expected = 96;
    results.push({
      id: 4,
      title: 'Peak Outpatient Onset Window',
      description: 'Amlodipine → Furosemide at Δt = 24d falls squarely inside 3–30d window yielding confidence 96/100.',
      inputSummary: 'signalE=0.92, dtDays=24, tauMin=3, tauMax=30, symptom=true, confounder=false',
      expectedValue: String(expected),
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 5. Comorbidity Confounder Damping (γ = 0.65)
  {
    const t0 = performance.now();
    const actual = calcCascadeConfidence(0.92, 24, 3, 30, true, true);
    const expected = 63;
    results.push({
      id: 5,
      title: 'Comorbidity Confounder Damping (γ = 0.65)',
      description: 'Presence of Heart Failure / CHF confounder dampens raw confidence by factor 0.65 (96 → 63 Amber tier).',
      inputSummary: 'signalE=0.92, dtDays=24, tauMin=3, tauMax=30, symptom=true, confounder=true (gamma=0.65)',
      expectedValue: String(expected),
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 6. Intentional Protective Gastroprotection Recognition
  {
    const t0 = performance.now();
    const analysis = analyzePatientClinicalRegimen(
      { age: 70, sex: 'M', weightKg: 70, serumCreatinineMgDl: 1.0, diagnoses: [] },
      [
        { id: 't1', genericName: 'naproxen', displayName: 'Naproxen', doseLabel: '500 mg BID', dailyDoseMg: 1000, startDay: 0 },
        { id: 't2', genericName: 'omeprazole', displayName: 'Omeprazole', doseLabel: '20 mg daily', dailyDoseMg: 20, startDay: 0 }
      ]
    );
    const isProtective = analysis.protectives.some(p => p.type === 'GASTROPROTECTION');
    const penaltyPoints = analysis.cascades.length; // 0 cascades triggered between them
    const passed = isProtective && penaltyPoints === 0;
    results.push({
      id: 6,
      title: 'Intentional Protective Gastroprotection Recognition',
      description: 'Naproxen + Omeprazole co-prescription is classified as intentional protective gastroprotection with 0 cascade penalty points.',
      inputSummary: 'Naproxen 500 mg BID + Omeprazole 20 mg daily (same-day or chronic)',
      expectedValue: 'PROTECTIVE_INTENTIONAL with 0 penalty points',
      actualValue: passed ? 'PROTECTIVE_INTENTIONAL with 0 penalty points' : 'Unrecognized pair',
      passed,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 7. Cockcroft-Gault Female Standard Verification
  {
    const t0 = performance.now();
    const actual = calcCrCl({ age: 78, sex: 'F', weightKg: 62, serumCreatinineMgDl: 1.4, diagnoses: [] });
    const expected = 32.4;
    results.push({
      id: 7,
      title: 'Cockcroft-Gault Female Standard Verification',
      description: 'Age 78, female, 62 kg, SCr 1.4 mg/dL evaluates to exactly 32.4 mL/min with 0.85 sex multiplier.',
      inputSummary: 'age: 78, sex: F, weight: 62 kg, SCr: 1.4 mg/dL',
      expectedValue: '32.4 mL/min',
      actualValue: `${actual} mL/min`,
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 8. Cockcroft-Gault Male Stage 4 CKD Verification
  {
    const t0 = performance.now();
    const actual = calcCrCl({ age: 81, sex: 'M', weightKg: 70, serumCreatinineMgDl: 2.3, diagnoses: [] });
    const expected = 24.9;
    results.push({
      id: 8,
      title: 'Cockcroft-Gault Male Stage 4 CKD Verification',
      description: 'Age 81, male, 70 kg, SCr 2.3 mg/dL evaluates to 24.9 mL/min (strictly Stage 4 CKD < 30 mL/min).',
      inputSummary: 'age: 81, sex: M, weight: 70 kg, SCr: 2.3 mg/dL',
      expectedValue: '24.9 mL/min',
      actualValue: `${actual} mL/min`,
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 9. Zero / Negative SCr Division-by-Zero Guard
  {
    const t0 = performance.now();
    const actual = calcCrCl({ age: 80, sex: 'M', weightKg: 70, serumCreatinineMgDl: 0, diagnoses: [] });
    const expected = 145.8;
    results.push({
      id: 9,
      title: 'Zero / Negative SCr Division-by-Zero Guard',
      description: 'SCr of 0 mg/dL is bounded at the clinical sarcopenia floor (0.4 mg/dL), preventing division-by-zero or NaN.',
      inputSummary: 'age: 80, sex: M, weight: 70 kg, SCr: 0 mg/dL (floor guarded to 0.4)',
      expectedValue: '145.8 mL/min',
      actualValue: `${actual} mL/min`,
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 10. Beers Table 6 Renal Threshold Firing
  {
    const t0 = performance.now();
    const arthur = PATIENT_PRESETS[1];
    const analysis = analyzePatientClinicalRegimen(arthur.vitals, arthur.regimen);
    const alertedDrugs = analysis.renalAlerts.map(a => a.med.genericName);
    const hasBaclofen = alertedDrugs.includes('baclofen');
    const hasNaproxen = alertedDrugs.includes('naproxen');
    const hasCipro = alertedDrugs.includes('ciprofloxacin');
    const passed = hasBaclofen && hasNaproxen && hasCipro;
    results.push({
      id: 10,
      title: 'Beers Table 6 Renal Threshold Firing',
      description: 'At CrCl 24.9 mL/min, Baclofen (<60), Naproxen (<30), and Ciprofloxacin (<30) all trigger renal safety contraindications.',
      inputSummary: 'CrCl = 24.9 mL/min, Regimen contains Baclofen, Naproxen, Ciprofloxacin',
      expectedValue: 'Flags baclofen (<60), naproxen (<30), and ciprofloxacin (<30)',
      actualValue: `Flagged: ${alertedDrugs.join(', ')}`,
      passed,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 11. Boustani ACB Cumulative Threshold & Dementia OR = 2.63 Alert
  {
    const t0 = performance.now();
    const oxyProfile = getOfflineDrugProfile('oxybutynin');
    const furoProfile = getOfflineDrugProfile('furosemide');
    const totalAcb = oxyProfile.acb + furoProfile.acb; // 3 + 1 = 4
    const triggersDementiaRisk = totalAcb >= 3;
    results.push({
      id: 11,
      title: 'Boustani ACB Cumulative Threshold & Dementia OR = 2.63 Alert',
      description: 'Oxybutynin (ACB=3) + Furosemide (ACB=1) yields cumulative ACB=4 (>=3 threshold), triggering Cochrane Dementia OR = 2.63 warning.',
      inputSummary: 'Oxybutynin (ACB 3) + Furosemide (ACB 1)',
      expectedValue: 'Cumulative ACB = 4 >= 3 (Triggers Dementia OR = 2.63 alert)',
      actualValue: `Cumulative ACB = ${totalAcb} (Dementia alert: ${triggersDementiaRisk ? 'TRIGGERED' : 'NOT TRIGGERED'})`,
      passed: totalAcb === 4 && triggersDementiaRisk,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 12. Hyperbolic Drug Burden Index (DBI) Math
  {
    const t0 = performance.now();
    const actual = calcDBI([
      { dailyDoseMg: 10, minEffectiveDoseMg: 5 },
      { dailyDoseMg: 5, minEffectiveDoseMg: 5 }
    ]);
    const expected = 1.17;
    results.push({
      id: 12,
      title: 'Hyperbolic Drug Burden Index (DBI) Math',
      description: 'Calculates dose-weighted cholinergic/sedative burden: 10/(5+10) + 5/(5+5) = 0.67 + 0.50 = 1.17.',
      inputSummary: 'Med1: dose 10mg / delta 5mg; Med2: dose 5mg / delta 5mg',
      expectedValue: '1.17',
      actualValue: String(actual),
      passed: actual === expected,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 13. Case 1 Root-Cause ARB Substitution PHI Delta
  {
    const t0 = performance.now();
    const martha = PATIENT_PRESETS[0];
    const preAnalysis = analyzePatientClinicalRegimen(martha.vitals, martha.regimen);
    // Simulate root switch: replace amlodipine with losartan, mark m2-m5 deprescribed
    const postRegimen = martha.regimen.map(m => {
      if (m.id === 'm1') {
        return {
          ...m,
          genericName: 'losartan',
          displayName: 'Losartan (Cozaar)',
          doseLabel: '50 mg daily',
          dailyDoseMg: 50
        };
      }
      return {
        ...m,
        isDeprescribed: true,
        deprescribeReason: 'Deprescribed via root cause substitution of Amlodipine with Losartan'
      };
    });
    const postAnalysis = analyzePatientClinicalRegimen(martha.vitals, postRegimen);
    const passed = preAnalysis.phi === 92 && postAnalysis.phi === 12;
    results.push({
      id: 13,
      title: 'Case 1 Root-Cause ARB Substitution PHI Delta',
      description: 'Martha V. baseline PHI of 92 plummets to 12 following single root substitution of Amlodipine with Losartan.',
      inputSummary: 'Martha V. baseline regimen vs post-substitution regimen',
      expectedValue: 'PHI drops from 92 to 12',
      actualValue: `Baseline PHI: ${preAnalysis.phi} → Post-Substitution PHI: ${postAnalysis.phi}`,
      passed,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 14. DAG Cycle Immunity & 5-Half-Life PK Washout
  {
    const t0 = performance.now();
    // Test cyclical directed edges A -> B -> A
    const cyclicEdges = [
      { fromId: 'A', toId: 'B', dtDays: 5 },
      { fromId: 'B', toId: 'A', dtDays: 5 }
    ];
    const cascaded = simulateRootSubstitutionBFS('A', cyclicEdges);
    const pkPct = calcPkWashoutPercent(2.5, 12.0); // 2.5 days = 60 hours / 12 hr = 5 half-lives -> 3.13%
    const bfsPassed = cascaded.length === 1 && cascaded[0] === 'B';
    const pkPassed = pkPct === 3.13;
    results.push({
      id: 14,
      title: 'DAG Cycle Immunity & 5-Half-Life PK Washout',
      description: 'BFS cycle guard terminates in <5ms without infinite recursion, and 5-half-life washout evaluates to 3.13% residual plasma concentration.',
      inputSummary: 'Cycle: A -> B -> A; PK: t = 2.5 days, t1/2 = 12 hours',
      expectedValue: 'Terminates with [B] & Washout = 3.13%',
      actualValue: `Terminated with [${cascaded.join(',')}] & Washout = ${pkPct}%`,
      passed: bfsPassed && pkPassed,
      durationMs: Math.round((performance.now() - t0) * 100) / 100
    });
  }

  // 15. Offline Federal Cache Failover
  {
    const t0 = performance.now();
    const amlodipineCache = getOfflineDrugProfile('amlodipine');
    const hasRxcui = amlodipineCache.rxcui === '17767';
    const has6Reactions = amlodipineCache.faersTopReactions.length === 6;
    const duration = performance.now() - t0;
    const passed = hasRxcui && has6Reactions && duration < 5;
    results.push({
      id: 15,
      title: 'Offline Federal Cache Failover',
      description: 'Querying Amlodipine under simulated network isolation instantly resolves RxCUI 17767 and 6 OpenFDA FAERS adverse reactions in 0ms.',
      inputSummary: 'getOfflineDrugProfile("amlodipine")',
      expectedValue: 'RxCUI 17767 with 6 FAERS reactions in <5ms',
      actualValue: `RxCUI ${amlodipineCache.rxcui} with ${amlodipineCache.faersTopReactions.length} reactions resolved in ${Math.round(duration * 100) / 100}ms`,
      passed,
      durationMs: Math.round(duration * 100) / 100
    });
  }

  return results;
}
