// src/data/clinicalKnowledgeBase.ts
// Peer-reviewed Prescribing Cascade Rules (2026 BMJ & 2025 Annals of Family Medicine ThinkCascades),
// Intentional Protective Co-Prescriptions, and July 2025 AGS Beers Criteria Alternatives.

import { CascadeRule } from '../types/clinical';

export const PRESCRIBING_CASCADE_RULES: CascadeRule[] = [
  {
    id: 'ccb_to_diuretic',
    name: 'Calcium Channel Blocker → Loop Diuretic Cascade',
    indexDrugs: ['amlodipine', 'nifedipine', 'felodipine'],
    markerDrugs: ['furosemide', 'bumetanide', 'torsemide', 'chlorthalidone'],
    signalE: 0.92,
    tauMin: 3,
    tauMax: 30,
    citation: 'aSR = 1.93 (95% CI 1.79–2.09); Incidence 2.6% (Ann Fam Med 2025 & BMJ 2026)',
    clinicalBridge: 'Precapillary vasodilatory pedal edema mistaken for heart failure',
    plainBridge: 'Swollen ankles & feet from blood pressure pill mistaken for fluid overload',
    confounderDiagnoses: ['Heart Failure', 'HFrEF', 'CHF', 'CKD Stage 4'],
    agsAlternativeDrug: 'losartan',
    agsAlternativeLabel: 'Switch Amlodipine 10 mg to Losartan 50 mg daily (ARB: ACB=0, resolves CCB edema with zero ACEi dry-cough cascade risk)'
  },
  {
    id: 'diuretic_to_oab',
    name: 'Loop Diuretic → Bladder Antimuscarinic Cascade',
    indexDrugs: ['furosemide', 'bumetanide', 'torsemide', 'hydrochlorothiazide', 'chlorthalidone'],
    markerDrugs: ['oxybutynin', 'tolterodine', 'solifenacin', 'tamsulosin'],
    signalE: 0.80,
    tauMin: 3,
    tauMax: 45,
    citation: '80.0% ThinkCascades Expert Consensus (Drugs & Aging)',
    clinicalBridge: 'Diuretic-induced polyuria and detrusor urgency mistaken for overactive bladder',
    plainBridge: 'Sudden bladder urgency & leakage caused by water pill',
    confounderDiagnoses: ['BPH'],
    agsAlternativeDrug: 'Deprescribe cascade diuretic & pelvic floor therapy',
    agsAlternativeLabel: 'Deprescribe unnecessary cascade loop diuretic; avoid Oxybutynin (ACB=3)'
  },
  {
    id: 'antichol_to_dementia',
    name: 'Anticholinergic → Acetylcholinesterase Inhibitor Cascade',
    indexDrugs: ['oxybutynin', 'tolterodine', 'amitriptyline', 'diphenhydramine', 'lorazepam', 'zolpidem'],
    markerDrugs: ['donepezil', 'rivastigmine', 'galantamine', 'memantine'],
    signalE: 0.85,
    tauMin: 7,
    tauMax: 90,
    citation: '85.0% ThinkCascades Consensus; ACB Dementia OR = 2.63 (95% CI 1.09–6.29, Cochrane)',
    clinicalBridge: 'Anticholinergic central muscarinic blockade causing memory impairment & confusion',
    plainBridge: 'Brain fog & memory confusion from bladder/sleep pill mistaken for Alzheimer dementia',
    confounderDiagnoses: ['Alzheimer Disease'],
    agsAlternativeDrug: '4-Step Hyperbolic Taper of Anticholinergic',
    agsAlternativeLabel: 'Taper off Oxybutynin over 6 weeks and reassess cognition before diagnosing dementia'
  },
  {
    id: 'steroid_to_antipsychotic',
    name: 'Systemic Corticosteroid → Antipsychotic Delirium Cascade',
    indexDrugs: ['prednisone', 'methylprednisolone', 'dexamethasone'],
    markerDrugs: ['quetiapine', 'haloperidol', 'risperidone', 'olanzapine'],
    signalE: 0.98,
    tauMin: 1,
    tauMax: 14,
    citation: 'ASR = 2.55 (95% CI 2.47–2.64 — #1 Highest ASR in Sept 2026 BMJ Study)',
    clinicalBridge: 'Corticosteroid-induced acute neuropsychiatric agitation/delirium',
    plainBridge: 'Severe restlessness & hospital confusion triggered by steroid burst',
    confounderDiagnoses: ['Schizophrenia', 'Bipolar Disorder'],
    agsAlternativeDrug: 'Steroid step-down + Non-drug delirium protocol',
    agsAlternativeLabel: 'Step down Prednisone post-acute burst + orientation/sleep hygiene; taper off Quetiapine (ACB=3, Beers Table 2)'
  },
  {
    id: 'iron_to_laxative',
    name: 'Oral Iron Supplement → Stimulant Laxative Cascade',
    indexDrugs: ['ferrous sulfate', 'ferrous gluconate'],
    markerDrugs: ['senna', 'bisacodyl', 'polyethylene glycol'],
    signalE: 0.94,
    tauMin: 3,
    tauMax: 45,
    citation: 'Incidence = 11.9% (95% CI 11.7–12.1% — #1 Highest Incidence in Sept 2026 BMJ)',
    clinicalBridge: 'Unabsorbed luminal iron causing colonic dysmotility & constipation',
    plainBridge: 'Severe constipation caused by high-dose daily iron tablets',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Alternate-day low-dose elemental iron',
    agsAlternativeLabel: 'Switch TID Ferrous Sulfate to alternate-day low-dose iron (improves fractional hepcidin absorption & stops constipation)'
  },
  {
    id: 'laxative_to_antidiarrheal',
    name: 'Stimulant Laxative → Anti-Diarrheal Pendulum Cascade',
    indexDrugs: ['senna', 'bisacodyl', 'polyethylene glycol'],
    markerDrugs: ['loperamide', 'diphenoxylate'],
    signalE: 0.96,
    tauMin: 1,
    tauMax: 21,
    citation: 'ASR = 2.53 (95% CI 2.43–2.65 — #2 Highest ASR in Sept 2026 BMJ)',
    clinicalBridge: 'Stimulant laxative over-correction causing secretory diarrhea',
    plainBridge: 'Diarrhea from stimulant laxative treated with anti-diarrheal (pendulum swing)',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Stop Senna & Loperamide pendulum',
    agsAlternativeLabel: 'Discontinue both stimulant laxative and Loperamide once daily iron is switched to alternate-day dosing'
  },
  {
    id: 'statin_to_nsaid',
    name: 'High-Intensity Statin → NSAID Myalgia Cascade',
    indexDrugs: ['atorvastatin', 'rosuvastatin', 'simvastatin'],
    markerDrugs: ['naproxen', 'ibuprofen', 'meloxicam', 'tramadol'],
    signalE: 0.88,
    tauMin: 7,
    tauMax: 60,
    citation: 'Incidence = 10.9% (95% CI 10.7–11.0% — #2 Highest Incidence in Sept 2026 BMJ)',
    clinicalBridge: 'High-intensity lipophilic statin myalgia mistaken for musculoskeletal arthritis',
    plainBridge: 'Muscle & shoulder aches from high-dose statin treated with kidney-toxic painkiller',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'pravastatin',
    agsAlternativeLabel: 'Switch Atorvastatin 80 mg to hydrophilic Pravastatin 40 mg daily (ACB=0) & stop nephrotoxic Naproxen'
  },
  {
    id: 'nsaid_to_antihypertensive',
    name: 'Systemic NSAID → Antihypertensive Fluid Cascade',
    indexDrugs: ['naproxen', 'ibuprofen', 'meloxicam', 'indomethacin'],
    markerDrugs: ['amlodipine', 'lisinopril', 'losartan', 'hydrochlorothiazide'],
    signalE: 0.85,
    tauMin: 3,
    tauMax: 45,
    citation: '85.0% ThinkCascades Expert Consensus (PMC9477172)',
    clinicalBridge: 'NSAID prostaglandin inhibition causing renal sodium retention & hypertension',
    plainBridge: 'Blood pressure spike caused by NSAID painkiller',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Topical diclofenac / Acetaminophen',
    agsAlternativeLabel: 'Discontinue systemic NSAID to normalize blood pressure without adding another antihypertensive'
  },
  {
    id: 'ssri_to_sleep',
    name: 'Activating SSRI → Z-Drug Sedative Cascade',
    indexDrugs: ['sertraline', 'fluoxetine', 'escitalopram', 'venlafaxine'],
    markerDrugs: ['zolpidem', 'eszopiclone', 'zaleplon', 'lorazepam'],
    signalE: 0.82,
    tauMin: 3,
    tauMax: 30,
    citation: 'aSR = 1.54 (95% CI 1.40–1.69); Incidence 2.5% (Ann Fam Med 2025)',
    clinicalBridge: 'Activating serotonergic insomnia treated with Beers Table 2 Z-drug hypnotic',
    plainBridge: 'Trouble falling asleep from antidepressant treated with high-fall-risk sleeping pill',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Morning SSRI dosing + CBT-I',
    agsAlternativeLabel: 'Shift SSRI to morning dosing + Cognitive Behavioral Therapy for Insomnia (2025 AGS Alternatives List)'
  },
  {
    id: 'alpha1_to_vestibular',
    name: 'Alpha-1 Blocker → Antihistamine Vertigo Cascade',
    indexDrugs: ['tamsulosin', 'doxazosin', 'terazosin', 'prazosin'],
    markerDrugs: ['meclizine', 'dimenhydrinate', 'prochlorperazine'],
    signalE: 0.84,
    tauMin: 3,
    tauMax: 30,
    citation: 'aSR = 1.63 (95% CI 1.46–1.81); Incidence 3.0% (Ann Fam Med 2025)',
    clinicalBridge: 'Alpha-1 adrenergic orthostatic hypotension mistaken for labyrinthine vertigo',
    plainBridge: 'Dizziness when standing up treated with sedating motion-sickness pill',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Bedtime Tamsulosin + Orthostatic BP check',
    agsAlternativeLabel: 'Check orthostatic vitals and dose Tamsulosin at bedtime; deprescribe anticholinergic Meclizine (ACB=3)'
  },
  {
    id: 'gabapentinoid_to_diuretic',
    name: 'Gabapentinoid → Loop Diuretic Edema Cascade',
    indexDrugs: ['gabapentin', 'pregabalin'],
    markerDrugs: ['furosemide', 'torsemide', 'bumetanide'],
    signalE: 0.83,
    tauMin: 7,
    tauMax: 90,
    citation: '90-Day Validated Window in Sept 2026 BMJ & Read et al. (JAGS)',
    clinicalBridge: 'Gabapentinoid calcium-channel peripheral edema mistaken for volume overload',
    plainBridge: 'Swollen legs from nerve pain pill treated with water pill',
    confounderDiagnoses: ['Heart Failure', 'CHF'],
    agsAlternativeDrug: 'Gabapentinoid dose reduction + topical lidocaine',
    agsAlternativeLabel: 'Reduce or taper Gabapentin dose rather than initiating a loop diuretic'
  },
  {
    id: 'achei_to_sleep',
    name: 'Cholinesterase Inhibitor → Hypnotic Insomnia Cascade',
    indexDrugs: ['donepezil', 'rivastigmine', 'galantamine'],
    markerDrugs: ['zolpidem', 'temazepam', 'eszopiclone'],
    signalE: 0.88,
    tauMin: 3,
    tauMax: 60,
    citation: 'Incidence = 10.3% (95% CI 9.9–10.7% — #3 Highest Incidence in Sept 2026 BMJ)',
    clinicalBridge: 'Bedtime cholinesterase inhibitor brainstem activation causing vivid dreams & insomnia',
    plainBridge: 'Nighttime vivid dreams & insomnia from memory pill treated with Ambien',
    confounderDiagnoses: [],
    agsAlternativeDrug: 'Move Donepezil to morning (AM) or deprescribe if cascade-induced',
    agsAlternativeLabel: 'Shift Donepezil from bedtime to morning dosing (or deprescribe if started for drug-induced confusion) & taper off Zolpidem'
  },
  {
    id: 'antipsychotic_to_parkinsonian',
    name: 'Dopamine Blocker → Levodopa Parkinsonian Cascade',
    indexDrugs: ['metoclopramide', 'risperidone', 'haloperidol', 'quetiapine'],
    markerDrugs: ['carbidopa-levodopa', 'pramipexole', 'ropinirole'],
    signalE: 0.78,
    tauMin: 5,
    tauMax: 60,
    citation: 'aSR = 1.20 (95% CI 1.00–1.43); 90.0% ThinkCascades Consensus',
    clinicalBridge: 'Dopamine D2 blockade extrapyramidal tremor mistaken for idiopathic Parkinson disease',
    plainBridge: 'Shaky hands from stomach/antipsychotic pill mistaken for Parkinson disease',
    confounderDiagnoses: ['Parkinson Disease'],
    agsAlternativeDrug: 'Taper off Metoclopramide / Antipsychotic',
    agsAlternativeLabel: 'Discontinue Metoclopramide (2023 Beers Table 2 Avoid) rather than adding dopaminergic therapy'
  }
];

export interface ProtectivePairRule {
  id: string;
  type: 'GASTROPROTECTION' | 'ELECTROLYTE_REPLACEMENT';
  indexDrugs: string[];
  protectiveDrugs: string[];
  description: string;
  plainDescription: string;
  guideline: string;
}

export const PROTECTIVE_CO_PRESCRIPTION_RULES: ProtectivePairRule[] = [
  {
    id: 'nsaid_ppi_gastroprotection',
    type: 'GASTROPROTECTION',
    indexDrugs: ['naproxen', 'ibuprofen', 'meloxicam', 'aspirin', 'indomethacin'],
    protectiveDrugs: ['omeprazole', 'pantoprazole', 'famotidine', 'esomeprazole', 'lansoprazole'],
    description: 'Intentional Gastroprotection (PPI co-prescribed to reduce NSAID/Antiplatelet GI bleed risk per 2023 Beers Criteria)',
    plainDescription: 'Stomach acid blocker intentionally prescribed alongside painkiller or aspirin to prevent stomach ulcers and bleeding.',
    guideline: '2023 AGS Beers Criteria Table 2 & ACC/AHA Gastroprotection Guidelines'
  },
  {
    id: 'diuretic_potassium_replacement',
    type: 'ELECTROLYTE_REPLACEMENT',
    indexDrugs: ['furosemide', 'bumetanide', 'hydrochlorothiazide', 'chlorthalidone', 'torsemide'],
    protectiveDrugs: ['potassium chloride'],
    description: 'Intentional Electrolyte Replacement (Potassium supplement co-prescribed to prevent diuretic hypokalemia per ThinkCascades)',
    plainDescription: 'Potassium pill given to replace potassium lost through water pills to protect heart rhythm.',
    guideline: 'ThinkCascades Consensus & KDIGO Guidelines'
  }
];

export const AGS_BEERS_2025_ALTERNATIVES = [
  {
    beersPim: 'Oxybutynin (Ditropan)',
    pharmacologicProblem: 'Potent central and peripheral antimuscarinic (ACB=3); precipitates delirium, rapid cognitive decline, and urinary retention.',
    saferAlternative: 'Non-pharmacologic pelvic floor muscle therapy, behavioral bladder training, or beta-3 adrenergic agonist (Mirabegron) after checking BP.',
    taperPlan: '4-Step hyperbolic reduction over 6 weeks.'
  },
  {
    beersPim: 'Zolpidem (Ambien)',
    pharmacologicProblem: 'Nonbenzodiazepine Z-drug hypnotic; doubles nocturnal fall/fracture risk and triggers complex sleep parasomnias.',
    saferAlternative: 'CBT-I (Cognitive Behavioral Therapy for Insomnia), sleep hygiene optimization, morning sunlight exposure, or low-dose melatonin.',
    taperPlan: '2-week 50% dose reduction followed by discontinuation.'
  },
  {
    beersPim: 'Naproxen / Systemic NSAIDs',
    pharmacologicProblem: 'Inhibits protective renal prostaglandins, induces acute tubular necrosis, worsens hypertension, and triggers major GI bleeds.',
    saferAlternative: 'Topical NSAIDs (Diclofenac gel 1%), oral acetaminophen (max 2g/day in geriatrics), physical therapy, or joint aspiration.',
    taperPlan: 'Can be discontinued immediately without rebound; protect gastric mucosa.'
  },
  {
    beersPim: 'Baclofen (Lioresal)',
    pharmacologicProblem: 'Centrally acting muscle relaxant; renal clearance; precipitates severe encephalopathy, myoclonus, sedation, and coma in CKD.',
    saferAlternative: 'Physical therapy, stretching protocols, heating pads, topical menthol/lidocaine patches.',
    taperPlan: 'Mandatory slow taper (reduce by 5-10 mg weekly) to prevent severe withdrawal seizures and autonomic instability.'
  },
  {
    beersPim: 'Quetiapine (Seroquel)',
    pharmacologicProblem: 'Atypical antipsychotic; black-box warning for cerebrovascular events and 1.6-fold increased mortality in dementia; potent ACB=3 sedation.',
    saferAlternative: 'DICE non-pharmacologic approach: Identify environmental delirium triggers, correct sensory impairments (hearing aids/glasses), reorientation.',
    taperPlan: 'Taper by 25 mg every 1-2 weeks under physician supervision.'
  }
];
