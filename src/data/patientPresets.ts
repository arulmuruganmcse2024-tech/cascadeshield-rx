// src/data/patientPresets.ts
// The 4 Pre-Verified Clinical Case Presets for CascadeShield Rx

import { PatientPreset } from '../types/clinical';

export const PATIENT_PRESETS: PatientPreset[] = [
  {
    id: 'martha_v',
    name: 'Martha V.',
    tagline: 'The 4-Drug Domino Cascade (Classic Ambulatory Geriatric Chain)',
    summary: '78yo female presenting with severe cognitive slowing, daytime somnolence, and urinary leakage after an innocent step-up of antihypertensive therapy.',
    plainSummary: '78-year-old grandmother whose swollen feet from a blood pressure pill led to 4 more prescription pills, creating brain fog, bladder trouble, and sleeping issues.',
    vitals: {
      age: 78,
      sex: 'F',
      weightKg: 62,
      serumCreatinineMgDl: 1.4,
      diagnoses: ['Hypertension', 'Osteoarthritis']
    },
    expectedCrCl: 32.4,
    expectedBaselinePhi: 92,
    expectedPostPhi: 12,
    regimen: [
      {
        id: 'm1',
        genericName: 'amlodipine',
        displayName: 'Amlodipine (Norvasc)',
        doseLabel: '10 mg daily',
        dailyDoseMg: 10,
        startDay: 0,
        reportedSymptom: 'Baseline antihypertensive',
        setting: 'outpatient'
      },
      {
        id: 'm2',
        genericName: 'furosemide',
        displayName: 'Furosemide (Lasix)',
        doseLabel: '40 mg daily',
        dailyDoseMg: 40,
        startDay: 24,
        reportedSymptom: 'Swollen ankles & feet',
        setting: 'outpatient'
      },
      {
        id: 'm3',
        genericName: 'oxybutynin',
        displayName: 'Oxybutynin (Ditropan)',
        doseLabel: '10 mg daily',
        dailyDoseMg: 10,
        startDay: 52,
        reportedSymptom: 'Sudden bladder urgency & leakage',
        setting: 'outpatient'
      },
      {
        id: 'm4',
        genericName: 'donepezil',
        displayName: 'Donepezil (Aricept)',
        doseLabel: '5 mg QHS',
        dailyDoseMg: 5,
        startDay: 85,
        reportedSymptom: 'Brain fog & memory confusion',
        setting: 'outpatient'
      },
      {
        id: 'm5',
        genericName: 'zolpidem',
        displayName: 'Zolpidem (Ambien)',
        doseLabel: '5 mg QHS',
        dailyDoseMg: 5,
        startDay: 105,
        reportedSymptom: 'Trouble falling asleep & vivid dreams',
        setting: 'outpatient'
      }
    ],
    homeMeds: [],
    simulationButtons: [
      {
        id: 'btn_martha_substitute',
        label: 'Simulate Root Substitution: Amlodipine 10 mg → Losartan 50 mg',
        actionType: 'ROOT_SUBSTITUTION',
        rootDrugGeneric: 'amlodipine',
        substituteGeneric: 'losartan',
        substituteDisplay: 'Losartan (Cozaar)',
        substituteDose: '50 mg daily',
        substituteDailyDoseMg: 50,
        description: 'Sever the root cause: Switch Amlodipine to Losartan 50 mg daily. Through BFS simulation, downstream Furosemide, Oxybutynin, Donepezil, and Zolpidem are safely deprescribed.'
      }
    ]
  },
  {
    id: 'arthur_k',
    name: 'Arthur K.',
    tagline: 'Statin Myalgia + Stage 4 CKD Renal Crisis',
    summary: '81yo male with advanced CKD (CrCl 24.9 mL/min) prescribed high-intensity atorvastatin, triggering severe myalgia treated with nephrotoxic naproxen, worsening hypertension and back spasms.',
    plainSummary: '81-year-old grandfather with weak kidneys who suffered painful muscle aches from a high-dose cholesterol pill. Taking heavy painkillers damaged his kidneys further.',
    vitals: {
      age: 81,
      sex: 'M',
      weightKg: 70,
      serumCreatinineMgDl: 2.3,
      diagnoses: ['Hyperlipidemia', 'CKD Stage 4', 'BPH']
    },
    expectedCrCl: 24.9,
    expectedBaselinePhi: 82,
    expectedPostPhi: 12,
    regimen: [
      {
        id: 'a1',
        genericName: 'atorvastatin',
        displayName: 'Atorvastatin (Lipitor)',
        doseLabel: '80 mg daily',
        dailyDoseMg: 80,
        startDay: 0,
        reportedSymptom: 'Baseline lipid therapy',
        setting: 'outpatient'
      },
      {
        id: 'a2',
        genericName: 'naproxen',
        displayName: 'Naproxen (Naprosyn)',
        doseLabel: '500 mg BID',
        dailyDoseMg: 1000,
        startDay: 35,
        reportedSymptom: 'Aching leg & shoulder muscles',
        setting: 'outpatient'
      },
      {
        id: 'a3',
        genericName: 'amlodipine',
        displayName: 'Amlodipine (Norvasc)',
        doseLabel: '5 mg daily',
        dailyDoseMg: 5,
        startDay: 62,
        reportedSymptom: 'Rising blood pressure',
        setting: 'outpatient'
      },
      {
        id: 'a4',
        genericName: 'baclofen',
        displayName: 'Baclofen (Lioresal)',
        doseLabel: '10 mg TID',
        dailyDoseMg: 30,
        startDay: 75,
        reportedSymptom: 'Lower back muscle spasm',
        setting: 'outpatient'
      },
      {
        id: 'a5',
        genericName: 'ciprofloxacin',
        displayName: 'Ciprofloxacin (Cipro)',
        doseLabel: '500 mg BID',
        dailyDoseMg: 1000,
        startDay: 90,
        reportedSymptom: 'Acute UTI treatment',
        setting: 'outpatient'
      }
    ],
    homeMeds: [],
    simulationButtons: [
      {
        id: 'btn_arthur_sever_statin',
        label: 'Step 1: Sever Statin Cascade Only',
        actionType: 'SEVER_STATIN',
        rootDrugGeneric: 'atorvastatin',
        substituteGeneric: 'pravastatin',
        substituteDisplay: 'Pravastatin (Pravachol)',
        substituteDose: '40 mg daily',
        substituteDailyDoseMg: 40,
        description: 'Switch Atorvastatin 80 mg to hydrophilic Pravastatin 40 mg daily; deprescribe cascaded Naproxen and Amlodipine. (Baclofen and Ciprofloxacin remain active).'
      },
      {
        id: 'btn_arthur_full_optimization',
        label: 'Step 2: Full Regimen & Renal Optimization',
        actionType: 'FULL_OPTIMIZATION',
        description: 'Taper off Baclofen (Beers Table 6 contraindication < 60 mL/min) and renally adjust/discontinue Ciprofloxacin to eliminate nephrotoxicity.'
      }
    ]
  },
  {
    id: 'eleanor_r',
    name: 'Eleanor R.',
    tagline: 'Post-Hospital Discharge Reconciliation Trap',
    summary: '74yo female with HFrEF and Type 2 Diabetes admitted for acute COPD exacerbation. Discharged with accidental beta-blocker duplication and omitted SGLT2 inhibitor.',
    plainSummary: '74-year-old grandmother discharged from the hospital with a dangerous duplicate blood pressure pill, while her essential diabetes heart-shield pill was accidentally left off.',
    vitals: {
      age: 74,
      sex: 'F',
      weightKg: 68,
      serumCreatinineMgDl: 1.0,
      diagnoses: ['Heart Failure (HFrEF)', 'Type 2 Diabetes', 'Iron-Deficiency Anemia']
    },
    expectedCrCl: 53.0,
    expectedBaselinePhi: 94,
    expectedPostPhi: 12,
    homeMeds: [
      {
        id: 'hm1',
        genericName: 'ferrous sulfate',
        displayName: 'Ferrous Sulfate (Feosol)',
        doseLabel: '325 mg TID',
        dailyDoseMg: 975,
        startDay: 0,
        setting: 'home'
      },
      {
        id: 'hm2',
        genericName: 'metoprolol tartrate',
        displayName: 'Metoprolol Tartrate (Lopressor)',
        doseLabel: '50 mg BID',
        dailyDoseMg: 100,
        startDay: 0,
        setting: 'home'
      },
      {
        id: 'hm3',
        genericName: 'empagliflozin',
        displayName: 'Empagliflozin (Jardiance)',
        doseLabel: '10 mg daily',
        dailyDoseMg: 10,
        startDay: 0,
        setting: 'home'
      }
    ],
    regimen: [
      {
        id: 'e1',
        genericName: 'ferrous sulfate',
        displayName: 'Ferrous Sulfate (Feosol)',
        doseLabel: '325 mg TID',
        dailyDoseMg: 975,
        startDay: 0,
        reportedSymptom: 'Baseline microcytic anemia',
        setting: 'home'
      },
      {
        id: 'e2',
        genericName: 'metoprolol tartrate',
        displayName: 'Metoprolol Tartrate (Lopressor)',
        doseLabel: '50 mg BID',
        dailyDoseMg: 100,
        startDay: 0,
        reportedSymptom: 'Baseline rate control',
        setting: 'home'
      },
      {
        id: 'e3',
        genericName: 'senna',
        displayName: 'Senna (Senokot)',
        doseLabel: '8.6 mg BID',
        dailyDoseMg: 17.2,
        startDay: 10,
        reportedSymptom: 'Severe constipation from iron',
        setting: 'outpatient'
      },
      {
        id: 'e4',
        genericName: 'prednisone',
        displayName: 'Prednisone (Deltasone)',
        doseLabel: '20 mg daily',
        dailyDoseMg: 20,
        startDay: 14,
        reportedSymptom: 'Acute COPD flare at hospital admission',
        setting: 'admission'
      },
      {
        id: 'e5',
        genericName: 'quetiapine',
        displayName: 'Quetiapine (Seroquel)',
        doseLabel: '50 mg QHS',
        dailyDoseMg: 50,
        startDay: 17,
        reportedSymptom: 'Hospital nocturnal agitation & delirium',
        setting: 'inpatient'
      },
      {
        id: 'e6',
        genericName: 'loperamide',
        displayName: 'Loperamide (Imodium)',
        doseLabel: '2 mg TID',
        dailyDoseMg: 6,
        startDay: 18,
        reportedSymptom: 'Loose watery stools from laxative',
        setting: 'discharge'
      },
      {
        id: 'e7',
        genericName: 'metoprolol succinate',
        displayName: 'Metoprolol Succinate (Toprol-XL)',
        doseLabel: '100 mg daily',
        dailyDoseMg: 100,
        startDay: 18,
        reportedSymptom: 'Hospital discharge transition',
        setting: 'discharge'
      }
    ],
    simulationButtons: [
      {
        id: 'btn_eleanor_reconcile',
        label: 'Execute Discharge Reconciliation & Deprescribing',
        actionType: 'EXECUTE_RECONCILIATION',
        description: 'Stop duplicate Metoprolol Tartrate (maintain Toprol-XL 100 mg), restart omitted Jardiance 10 mg, convert iron to alternate-day dosing, taper off Prednisone + Quetiapine, and discontinue Senna + Loperamide.'
      }
    ]
  },
  {
    id: 'custom_builder',
    name: 'Custom Regimen Builder',
    tagline: 'Interactive Patient & Zero-Key Clinical Note NLP Parser',
    summary: 'Adjust patient vitals, type medications, or paste an unformatted clinical discharge note to automatically parse timelines, drugs, and cascade interactions.',
    plainSummary: 'Build your own custom medication list or paste a doctor’s note to check for prescription traps and safety warnings.',
    vitals: {
      age: 72,
      sex: 'M',
      weightKg: 75,
      serumCreatinineMgDl: 1.1,
      diagnoses: ['Hypertension', 'Osteoarthritis']
    },
    expectedCrCl: 68.2,
    expectedBaselinePhi: 0,
    expectedPostPhi: 0,
    regimen: [
      {
        id: 'c1',
        genericName: 'amlodipine',
        displayName: 'Amlodipine (Norvasc)',
        doseLabel: '10 mg daily',
        dailyDoseMg: 10,
        startDay: 0,
        reportedSymptom: 'Hypertension management',
        setting: 'outpatient'
      },
      {
        id: 'c2',
        genericName: 'furosemide',
        displayName: 'Furosemide (Lasix)',
        doseLabel: '40 mg daily',
        dailyDoseMg: 40,
        startDay: 20,
        reportedSymptom: 'Swollen ankles',
        setting: 'outpatient'
      }
    ],
    homeMeds: [],
    simulationButtons: [
      {
        id: 'btn_custom_substitute',
        label: 'Simulate Root Deprescribing',
        actionType: 'ROOT_SUBSTITUTION',
        rootDrugGeneric: 'amlodipine',
        substituteGeneric: 'losartan',
        substituteDisplay: 'Losartan (Cozaar)',
        substituteDose: '50 mg daily',
        substituteDailyDoseMg: 50,
        description: 'Deprescribe root drug and sever downstream cascade edges.'
      }
    ]
  }
];

export const SAMPLE_CLINICAL_NOTES = [
  {
    title: 'Sample 1: Discharge Summary (Domino Cascade)',
    text: `DISCHARGE SUMMARY - GERIATRIC INPATIENT SERVICE
Patient: Martha V. | Age: 78 | Female
Admission Day 0: Patient maintained on Norvasc 10 mg daily for blood pressure.
Outpatient Day 24: Patient noted bilateral ankle swelling; started on Lasix 40 mg daily.
Outpatient Day 52: Developed sudden bladder urgency and frequency; commenced Ditropan 10 mg daily.
Outpatient Day 85: Family reported acute cognitive decline and brain fog; started on Aricept 5 mg QHS.
Outpatient Day 105: Trouble sleeping and vivid night dreams; initiated Ambien 5 mg QHS.`
  },
  {
    title: 'Sample 2: Renal Statin Cascade Note',
    text: `NEPHROLOGY CONSULTATION NOTE
Patient: Arthur K. | Age: 81 | Male | Weight: 70 kg | SCr: 2.3 mg/dL
Day 0: Patient initiated on Lipitor 80 mg daily for secondary prevention.
Day 35: Developed severe aching leg & shoulder muscles. Initiated Naprosyn 500 mg BID for joint pain.
Day 62: Blood pressure spike noted; started Norvasc 5 mg daily.
Day 75: Complaining of lower back muscle spasms; started Lioresal 10 mg TID.
Day 90: Prescribed Cipro 500 mg BID for acute uncomplicated cystitis.`
  },
  {
    title: 'Sample 3: Hospital Transition Note (Reconciliation Errors)',
    text: `HOSPITAL DISCHARGE MEDICATION RECONCILIATION
Patient: Eleanor R. | Age: 74 | Female | HFrEF, Type 2 DM
Home Medications:
- Feosol 325 mg TID for microcytic anemia
- Lopressor 50 mg BID for heart rate control
- Jardiance 10 mg daily for cardioprotective glycemic control (OMITTED on discharge!)
Hospital Course:
Day 10: Prescribed Senokot 8.6 mg BID for severe iron constipation.
Day 14: Admitted for acute flare; started Deltasone 20 mg daily.
Day 17: Inpatient nighttime agitation and delirium; started Seroquel 50 mg QHS.
Day 18 Discharge: Prescribed Imodium 2 mg TID for diarrhea.
Day 18 Discharge: Prescribed Toprol-XL 100 mg daily (duplicate beta-blocker with home Lopressor!).`
  }
];

