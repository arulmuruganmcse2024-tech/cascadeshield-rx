// src/types/clinical.ts
// Comprehensive clinical domain models for CascadeShield Rx

export interface PatientVitals {
  age: number;
  sex: 'M' | 'F';
  weightKg: number;
  serumCreatinineMgDl: number;
  diagnoses: string[];
}

export interface RegimenMed {
  id: string;
  genericName: string; // lowercase canonical name e.g. 'amlodipine'
  displayName: string;
  doseLabel: string;
  dailyDoseMg: number;
  startDay: number;
  reportedSymptom?: string;
  setting?: 'home' | 'outpatient' | 'admission' | 'inpatient' | 'discharge';
  isDeprescribed?: boolean;
  deprescribeReason?: string;
}

export interface FaersReaction {
  term: string;
  count: number;
}

export interface DrugCacheEntry {
  rxcui: string;
  brand: string;
  acb: number; // 0, 1, 2, 3 (Boustani Anticholinergic Cognitive Burden)
  minEffectiveDoseMg: number | null; // delta for Dose-Weighted Drug Burden Index (DBI)
  halfLifeHours: number; // t_{1/2} in hours
  beersTable2: boolean;
  beersReason?: string;
  renalCutoffCrCl: number | null; // e.g. 30, 60 mL/min
  renalRuleText?: string;
  requiresTaper: boolean;
  classes: string[]; // ATC / EPC / NLM RxClass categories
  faersTopReactions: FaersReaction[];
}

export interface CascadeRule {
  id: string;
  name: string;
  indexDrugs: string[];
  markerDrugs: string[];
  signalE: number;
  tauMin: number;
  tauMax: number;
  citation: string;
  clinicalBridge: string;
  plainBridge: string;
  confounderDiagnoses: string[];
  agsAlternativeDrug: string;
  agsAlternativeLabel: string;
  isProtective?: boolean;
}

export interface DetectedCascade {
  ruleId: string;
  ruleName: string;
  fromMed: RegimenMed;
  toMed: RegimenMed;
  dtDays: number;
  confidence: number; // 0-100 scale
  signalE: number;
  hasSymptomMatch: boolean;
  hasComorbidityConfounder: boolean;
  citation: string;
  clinicalBridge: string;
  plainBridge: string;
  agsAlternativeDrug: string;
  agsAlternativeLabel: string;
  isSevered?: boolean;
}

export interface ReconciliationDiff {
  type: 'DUPLICATION' | 'OMISSION' | 'NEW_INPATIENT' | 'CONTINUED';
  drugName: string;
  brandName?: string;
  description: string;
  plainDescription?: string;
  clinicalSeverity: 'HIGH' | 'MODERATE' | 'LOW';
  medication?: RegimenMed;
  actionRequired: string;
}

export interface ProtectiveCoPrescription {
  indexMed: RegimenMed;
  protectMed: RegimenMed;
  type: 'GASTROPROTECTION' | 'ELECTROLYTE_REPLACEMENT';
  description: string;
  plainDescription: string;
  guideline: string;
}

export interface RenalAlert {
  med: RegimenMed;
  cutoffCrCl: number;
  actualCrCl: number;
  ruleText: string;
  severity: 'CONTRAINDICATED' | 'DOSE_REDUCE';
}

export interface ClinicalAnalysisResult {
  crcl: number;
  phi: number;
  cascades: DetectedCascade[];
  acbTotal: number;
  acbBreakdown: Array<{ med: RegimenMed; score: number }>;
  dbiTotal: number;
  dbiBreakdown: Array<{ med: RegimenMed; dbi: number }>;
  beersPims: Array<{ med: RegimenMed; reason: string }>;
  renalAlerts: RenalAlert[];
  reconciliations: ReconciliationDiff[];
  protectives: ProtectiveCoPrescription[];
  ahrqCostAvoided?: number;
  copaySavingsAnnual?: number;
}

export interface TaperStep {
  weeks: string;
  doseMg: number;
  pct: number;
  instruction: string;
}

export interface SimulationButtonConfig {
  id: string;
  label: string;
  actionType: 'ROOT_SUBSTITUTION' | 'SEVER_STATIN' | 'FULL_OPTIMIZATION' | 'EXECUTE_RECONCILIATION';
  rootDrugGeneric?: string;
  substituteGeneric?: string;
  substituteDisplay?: string;
  substituteDose?: string;
  substituteDailyDoseMg?: number;
  description: string;
}

export interface PatientPreset {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  plainSummary: string;
  vitals: PatientVitals;
  regimen: RegimenMed[];
  homeMeds?: RegimenMed[];
  expectedCrCl: number;
  expectedBaselinePhi: number;
  expectedPostPhi: number;
  simulationButtons: SimulationButtonConfig[];
}

export interface UnitTestResult {
  id: number;
  title: string;
  description: string;
  inputSummary: string;
  expectedValue: string;
  actualValue: string;
  passed: boolean;
  durationMs: number;
}
