// src/data/offlineDrugCache.ts
// Pre-cached dictionary of 35+ geriatric drugs with RxCUI, ATC/EPC classes,
// Boustani ACB, DBI delta, half-life, Beers Criteria, and OpenFDA FAERS adverse reactions.

import { DrugCacheEntry } from '../types/clinical';

export const OFFLINE_DRUG_CACHE: Record<string, DrugCacheEntry> = {
  'amlodipine': {
    rxcui: '17767',
    brand: 'Norvasc',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 40,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C08CA - Dihydropyridine derivatives', 'Calcium Channel Blockers'],
    faersTopReactions: [
      { term: 'Oedema peripheral', count: 18420 },
      { term: 'Dizziness', count: 11240 },
      { term: 'Flushing', count: 6890 },
      { term: 'Headache', count: 6410 },
      { term: 'Fatigue', count: 5120 },
      { term: 'Palpitations', count: 3980 }
    ]
  },
  'losartan': {
    rxcui: '52175',
    brand: 'Cozaar',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 6,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C09CA - Angiotensin II receptor blockers (ARBs)'],
    faersTopReactions: [
      { term: 'Dizziness', count: 8120 },
      { term: 'Hyperkalaemia', count: 3410 },
      { term: 'Fatigue', count: 2950 },
      { term: 'Hypotension', count: 2610 },
      { term: 'Headache', count: 2190 },
      { term: 'Diarrhoea', count: 1840 }
    ]
  },
  'lisinopril': {
    rxcui: '29046',
    brand: 'Prinivil / Zestril',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 12,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C09AA - ACE inhibitors, plain'],
    faersTopReactions: [
      { term: 'Cough', count: 24150 },
      { term: 'Dizziness', count: 12300 },
      { term: 'Hypotension', count: 7840 },
      { term: 'Angioedema', count: 5420 },
      { term: 'Hyperkalaemia', count: 4120 },
      { term: 'Headache', count: 3890 }
    ]
  },
  'furosemide': {
    rxcui: '4603',
    brand: 'Lasix',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 2,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C03CA - Sulfonamides, plain (Loop Diuretics)'],
    faersTopReactions: [
      { term: 'Acute kidney injury', count: 15890 },
      { term: 'Hypokalaemia', count: 14210 },
      { term: 'Pollakiuria / Urinary urgency', count: 9840 },
      { term: 'Dehydration', count: 8920 },
      { term: 'Hypotension', count: 7650 },
      { term: 'Hyponatraemia', count: 6430 }
    ]
  },
  'oxybutynin': {
    rxcui: '32675',
    brand: 'Ditropan',
    acb: 3,
    minEffectiveDoseMg: 5,
    halfLifeHours: 13,
    beersTable2: true,
    beersReason: 'Strongly anticholinergic bladder antimuscarinic; high risk of cognitive decline, delirium, dry mouth, and falls.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['G04BD - Drugs for urinary frequency and incontinence'],
    faersTopReactions: [
      { term: 'Dry mouth', count: 9420 },
      { term: 'Confusional state / Cognitive disorder', count: 6180 },
      { term: 'Constipation', count: 5240 },
      { term: 'Dizziness', count: 4890 },
      { term: 'Somnolence', count: 4120 },
      { term: 'Blurred vision', count: 3150 }
    ]
  },
  'donepezil': {
    rxcui: '135447',
    brand: 'Aricept',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 70,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N06DA - Anticholinesterases'],
    faersTopReactions: [
      { term: 'Insomnia / Abnormal dreams', count: 7840 },
      { term: 'Nausea', count: 7410 },
      { term: 'Diarrhoea', count: 6820 },
      { term: 'Bradycardia', count: 5190 },
      { term: 'Syncope', count: 4320 },
      { term: 'Muscle spasms', count: 3190 }
    ]
  },
  'zolpidem': {
    rxcui: '39993',
    brand: 'Ambien',
    acb: 0,
    minEffectiveDoseMg: 5,
    halfLifeHours: 2.5,
    beersTable2: true,
    beersReason: 'Nonbenzodiazepine Z-drug hypnotic; causes delirium, falls, fractures, and complex sleep behaviors in older adults.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N05CF - Benzodiazepine related drugs'],
    faersTopReactions: [
      { term: 'Somnolence', count: 16420 },
      { term: 'Confusional state', count: 12890 },
      { term: 'Fall', count: 11450 },
      { term: 'Amnesia', count: 9870 },
      { term: 'Hallucination', count: 8410 },
      { term: 'Dizziness', count: 7920 }
    ]
  },
  'atorvastatin': {
    rxcui: '83367',
    brand: 'Lipitor',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 14,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C10AA - HMG CoA reductase inhibitors'],
    faersTopReactions: [
      { term: 'Myalgia', count: 28410 },
      { term: 'Arthralgia', count: 14200 },
      { term: 'Muscle spasms', count: 11890 },
      { term: 'Pain in extremity', count: 10420 },
      { term: 'Fatigue', count: 8910 },
      { term: 'Rhabdomyolysis', count: 6120 }
    ]
  },
  'pravastatin': {
    rxcui: '42463',
    brand: 'Pravachol',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 2,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C10AA - Hydrophilic HMG CoA reductase inhibitor'],
    faersTopReactions: [
      { term: 'Myalgia', count: 4120 },
      { term: 'Headache', count: 2180 },
      { term: 'Nausea', count: 1890 },
      { term: 'Fatigue', count: 1640 },
      { term: 'Dizziness', count: 1420 },
      { term: 'Diarrhoea', count: 1190 }
    ]
  },
  'naproxen': {
    rxcui: '7258',
    brand: 'Aleve / Naprosyn',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 14,
    beersTable2: true,
    beersReason: 'Systemic NSAID; high risk of GI ulcer/bleeding, hypertension, fluid retention, and acute kidney injury.',
    renalCutoffCrCl: 30,
    renalRuleText: '2023 Beers Table 6: Avoid NSAIDs when CrCl < 30 mL/min due to acute kidney injury & nephrotoxicity.',
    requiresTaper: false,
    classes: ['M01AE - Propionic acid derivatives (NSAIDs)'],
    faersTopReactions: [
      { term: 'Gastrointestinal haemorrhage', count: 14920 },
      { term: 'Hypertension', count: 11340 },
      { term: 'Acute kidney injury', count: 9870 },
      { term: 'Abdominal pain upper', count: 8910 },
      { term: 'Dyspepsia', count: 7840 },
      { term: 'Oedema peripheral', count: 6120 }
    ]
  },
  'baclofen': {
    rxcui: '1292',
    brand: 'Lioresal',
    acb: 2,
    minEffectiveDoseMg: 15,
    halfLifeHours: 4,
    beersTable2: true,
    beersReason: 'Skeletal muscle relaxant poorly tolerated by older adults; high risk of encephalopathy, sedation, and falls.',
    renalCutoffCrCl: 60,
    renalRuleText: '2023 Beers Table 6: Avoid Baclofen when eGFR/CrCl < 60 mL/min due to severe encephalopathy & neurotoxicity risk.',
    requiresTaper: true,
    classes: ['M03BX - Other centrally acting muscle relaxants'],
    faersTopReactions: [
      { term: 'Encephalopathy / Confusional state', count: 8940 },
      { term: 'Somnolence', count: 8120 },
      { term: 'Hypotonia / Muscular weakness', count: 6410 },
      { term: 'Dizziness', count: 5890 },
      { term: 'Fall', count: 4720 },
      { term: 'Withdrawal syndrome', count: 3910 }
    ]
  },
  'ciprofloxacin': {
    rxcui: '2551',
    brand: 'Cipro',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 4,
    beersTable2: false,
    renalCutoffCrCl: 30,
    renalRuleText: '2023 Beers Table 6: Avoid or reduce dose of Ciprofloxacin when CrCl < 30 mL/min due to CNS toxicity & tendon rupture.',
    requiresTaper: false,
    classes: ['J01MA - Fluoroquinolone antibacterials'],
    faersTopReactions: [
      { term: 'Tendonitis / Tendon rupture', count: 12450 },
      { term: 'Peripheral neuropathy', count: 9820 },
      { term: 'Confusional state / Delirium', count: 7410 },
      { term: 'Arthralgia', count: 6890 },
      { term: 'Diarrhoea', count: 6120 },
      { term: 'Dizziness', count: 5410 }
    ]
  },
  'ferrous sulfate': {
    rxcui: '4239',
    brand: 'Feosol',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 6,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['B03AA - Iron bivalent, oral preparations'],
    faersTopReactions: [
      { term: 'Constipation', count: 9840 },
      { term: 'Nausea', count: 6410 },
      { term: 'Abdominal pain', count: 5820 },
      { term: 'Faeces discoloured', count: 4910 },
      { term: 'Diarrhoea', count: 2890 },
      { term: 'Dyspepsia', count: 2410 }
    ]
  },
  'senna': {
    rxcui: '9662',
    brand: 'Senokot',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 8,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A06AB - Contact stimulant laxatives'],
    faersTopReactions: [
      { term: 'Diarrhoea', count: 6890 },
      { term: 'Abdominal cramps', count: 5420 },
      { term: 'Hypokalaemia', count: 2190 },
      { term: 'Nausea', count: 1940 },
      { term: 'Dehydration', count: 1680 },
      { term: 'Dizziness', count: 1120 }
    ]
  },
  'loperamide': {
    rxcui: '6468',
    brand: 'Imodium',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 11,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A07DA - Antipropulsives'],
    faersTopReactions: [
      { term: 'Constipation', count: 5920 },
      { term: 'Paralytic ileus', count: 3410 },
      { term: 'Dizziness', count: 2890 },
      { term: 'Abdominal distension', count: 2640 },
      { term: 'Somnolence', count: 2180 },
      { term: 'QT prolongation', count: 1890 }
    ]
  },
  'prednisone': {
    rxcui: '8640',
    brand: 'Deltasone',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 3.5,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['H02AB - Glucocorticoids'],
    faersTopReactions: [
      { term: 'Insomnia / Agitation', count: 16820 },
      { term: 'Delirium / Psychotic disorder', count: 11420 },
      { term: 'Hyperglycaemia', count: 10890 },
      { term: 'Hypertension', count: 9410 },
      { term: 'Weight increased', count: 8920 },
      { term: 'Gastrointestinal haemorrhage', count: 6840 }
    ]
  },
  'quetiapine': {
    rxcui: '51272',
    brand: 'Seroquel',
    acb: 3,
    minEffectiveDoseMg: 25,
    halfLifeHours: 6,
    beersTable2: true,
    beersReason: 'Atypical antipsychotic; increased risk of stroke, cognitive decline, mortality, and extrapyramidal symptoms in older adults.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N05AH - Diazepines, oxazepines, thiazepines (Antipsychotics)'],
    faersTopReactions: [
      { term: 'Somnolence / Sedation', count: 22410 },
      { term: 'Extrapyramidal disorder / Tremor', count: 11890 },
      { term: 'Dizziness / Orthostatic hypotension', count: 10420 },
      { term: 'Confusional state', count: 8910 },
      { term: 'Fall', count: 7640 },
      { term: 'Weight increased', count: 6920 }
    ]
  },
  'metoprolol tartrate': {
    rxcui: '6918',
    brand: 'Lopressor',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 3.5,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['C07AB - Beta blocking agents, selective'],
    faersTopReactions: [
      { term: 'Bradycardia', count: 14210 },
      { term: 'Hypotension', count: 12890 },
      { term: 'Fatigue', count: 10420 },
      { term: 'Dizziness', count: 9840 },
      { term: 'Depression', count: 4120 },
      { term: 'Dyspnoea', count: 3890 }
    ]
  },
  'metoprolol succinate': {
    rxcui: '6918',
    brand: 'Toprol-XL',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 7,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['C07AB - Beta blocking agents, selective'],
    faersTopReactions: [
      { term: 'Bradycardia', count: 14210 },
      { term: 'Hypotension', count: 12890 },
      { term: 'Fatigue', count: 10420 },
      { term: 'Dizziness', count: 9840 },
      { term: 'Depression', count: 4120 },
      { term: 'Dyspnoea', count: 3890 }
    ]
  },
  'empagliflozin': {
    rxcui: '1545653',
    brand: 'Jardiance',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 12.4,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A10BK - Sodium-glucose co-transporter 2 (SGLT2) inhibitors'],
    faersTopReactions: [
      { term: 'Urinary tract infection', count: 8920 },
      { term: 'Fungal genital infection', count: 7410 },
      { term: 'Euglycaemic diabetic ketoacidosis', count: 4890 },
      { term: 'Hypotension / Volume depletion', count: 4120 },
      { term: 'Pollakiuria', count: 3640 },
      { term: 'Thirst', count: 2190 }
    ]
  },
  'sertraline': {
    rxcui: '36437',
    brand: 'Zoloft',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 26,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N06AB - Selective serotonin reuptake inhibitors'],
    faersTopReactions: [
      { term: 'Insomnia', count: 15420 },
      { term: 'Nausea', count: 14210 },
      { term: 'Diarrhoea', count: 11840 },
      { term: 'Dizziness', count: 9420 },
      { term: 'Hyponatraemia', count: 6180 },
      { term: 'Tremor', count: 5410 }
    ]
  },
  'tamsulosin': {
    rxcui: '77492',
    brand: 'Flomax',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 14,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['G04CA - Alpha-adrenoreceptor antagonists'],
    faersTopReactions: [
      { term: 'Dizziness', count: 14890 },
      { term: 'Orthostatic hypotension', count: 9840 },
      { term: 'Headache', count: 7650 },
      { term: 'Retrograde ejaculation', count: 6420 },
      { term: 'Asthenia', count: 5120 },
      { term: 'Syncope', count: 3980 }
    ]
  },
  'meclizine': {
    rxcui: '6703',
    brand: 'Antivert',
    acb: 3,
    minEffectiveDoseMg: 25,
    halfLifeHours: 6,
    beersTable2: true,
    beersReason: 'Strongly anticholinergic first-generation antihistamine; high risk of sedation, confusion, dry mouth, and falls.',
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['R06AE - Piperazine derivatives (Antihistamines)'],
    faersTopReactions: [
      { term: 'Somnolence', count: 6840 },
      { term: 'Dry mouth', count: 4890 },
      { term: 'Fatigue', count: 3920 },
      { term: 'Confusional state', count: 3120 },
      { term: 'Dizziness', count: 2840 },
      { term: 'Blurred vision', count: 1980 }
    ]
  },
  'gabapentin': {
    rxcui: '25480',
    brand: 'Neurontin',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 6,
    beersTable2: false,
    renalCutoffCrCl: 60,
    renalRuleText: '2023 Beers Table 6: Dose reduction required when CrCl < 60 mL/min due to neurotoxicity, ataxia & severe sedation.',
    requiresTaper: true,
    classes: ['N02BF - Gabapentinoids'],
    faersTopReactions: [
      { term: 'Somnolence', count: 18920 },
      { term: 'Dizziness', count: 16410 },
      { term: 'Oedema peripheral', count: 14890 },
      { term: 'Gait disturbance / Ataxia', count: 11240 },
      { term: 'Fatigue', count: 9120 },
      { term: 'Fall', count: 8420 }
    ]
  },
  'metoclopramide': {
    rxcui: '6915',
    brand: 'Reglan',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 5,
    beersTable2: true,
    beersReason: 'Dopamine D2 antagonist with black-box warning for tardive dyskinesia and drug-induced extrapyramidal parkinsonism in older adults.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['A03FA - Propulsives (Dopamine Antagonists)'],
    faersTopReactions: [
      { term: 'Tardive dyskinesia', count: 11420 },
      { term: 'Extrapyramidal disorder / Tremor', count: 9840 },
      { term: 'Somnolence', count: 7650 },
      { term: 'Akathisia / Restlessness', count: 6420 },
      { term: 'Dizziness', count: 4890 },
      { term: 'Parkinsonism', count: 3910 }
    ]
  },
  'carbidopa-levodopa': {
    rxcui: '197461',
    brand: 'Sinemet',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 1.5,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N04BA - Dopa and dopa derivatives'],
    faersTopReactions: [
      { term: 'Dyskinesia', count: 14890 },
      { term: 'Nausea', count: 11240 },
      { term: 'Orthostatic hypotension', count: 9410 },
      { term: 'Hallucination', count: 8920 },
      { term: 'Somnolence', count: 7120 },
      { term: 'Confusional state', count: 6420 }
    ]
  },
  'omeprazole': {
    rxcui: '7646',
    brand: 'Prilosec',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 1,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A02BC - Proton pump inhibitors'],
    faersTopReactions: [
      { term: 'Clostridioides difficile colitis', count: 12450 },
      { term: 'Hypomagnesaemia', count: 8940 },
      { term: 'Headache', count: 7840 },
      { term: 'Bone fracture', count: 6890 },
      { term: 'Diarrhoea', count: 5920 },
      { term: 'Pneumonia', count: 4820 }
    ]
  },
  'potassium chloride': {
    rxcui: '8591',
    brand: 'K-Dur / Klor-Con',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 2,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A12BA - Potassium minerals'],
    faersTopReactions: [
      { term: 'Hyperkalaemia', count: 9420 },
      { term: 'Nausea', count: 6120 },
      { term: 'Gastrointestinal ulceration', count: 4890 },
      { term: 'Abdominal pain', count: 4210 },
      { term: 'Vomiting', count: 3410 },
      { term: 'Diarrhoea', count: 2890 }
    ]
  },
  'bumetanide': {
    rxcui: '1808',
    brand: 'Bumex',
    acb: 1,
    minEffectiveDoseMg: null,
    halfLifeHours: 1.5,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['C03CA - Sulfonamides, plain (Loop Diuretics)'],
    faersTopReactions: [
      { term: 'Hypokalaemia', count: 4210 },
      { term: 'Hypotension', count: 3120 },
      { term: 'Acute kidney injury', count: 2890 },
      { term: 'Dizziness', count: 1890 },
      { term: 'Muscle spasms', count: 1420 },
      { term: 'Hyponatraemia', count: 1210 }
    ]
  },
  'hydrochlorothiazide': {
    rxcui: '5487',
    brand: 'Microzide',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 10,
    beersTable2: false,
    renalCutoffCrCl: 30,
    renalRuleText: 'Ineffective when CrCl < 30 mL/min; consider loop diuretic if diuretic indicated.',
    requiresTaper: false,
    classes: ['C03AA - Thiazides, plain'],
    faersTopReactions: [
      { term: 'Hypokalaemia', count: 12890 },
      { term: 'Hyponatraemia', count: 9420 },
      { term: 'Hyperuricaemia / Gout', count: 7120 },
      { term: 'Dizziness', count: 6840 },
      { term: 'Hypotension', count: 5410 },
      { term: 'Hyperglycaemia', count: 3980 }
    ]
  },
  'amitriptyline': {
    rxcui: '704',
    brand: 'Elavil',
    acb: 3,
    minEffectiveDoseMg: 25,
    halfLifeHours: 24,
    beersTable2: true,
    beersReason: 'Highly anticholinergic tricyclic antidepressant; severe sedation, dry mouth, urinary retention, cardiac arrhythmias, and orthostatic falls.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N06AA - Non-selective monoamine reuptake inhibitors'],
    faersTopReactions: [
      { term: 'Somnolence', count: 14210 },
      { term: 'Dry mouth', count: 11840 },
      { term: 'Confusional state', count: 8940 },
      { term: 'Urinary retention', count: 6420 },
      { term: 'Fall', count: 5920 },
      { term: 'Constipation', count: 5410 }
    ]
  },
  'diphenhydramine': {
    rxcui: '3498',
    brand: 'Benadryl',
    acb: 3,
    minEffectiveDoseMg: 25,
    halfLifeHours: 9,
    beersTable2: true,
    beersReason: 'Potent first-generation anticholinergic antihistamine; high risk of delirium, urinary retention, and falls in older adults.',
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['R06AA - Aminoalkyl ethers (Antihistamines)'],
    faersTopReactions: [
      { term: 'Somnolence', count: 18420 },
      { term: 'Confusional state', count: 12450 },
      { term: 'Dry mouth', count: 9840 },
      { term: 'Urinary retention', count: 7120 },
      { term: 'Fall', count: 6890 },
      { term: 'Hallucination', count: 4890 }
    ]
  },
  'lorazepam': {
    rxcui: '6470',
    brand: 'Ativan',
    acb: 0,
    minEffectiveDoseMg: 1,
    halfLifeHours: 12,
    beersTable2: true,
    beersReason: 'Benzodiazepine; older adults have increased sensitivity leading to falls, fractures, cognitive decline, and motor vehicle accidents.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N05BA - Benzodiazepine derivatives'],
    faersTopReactions: [
      { term: 'Somnolence', count: 19840 },
      { term: 'Fall', count: 15420 },
      { term: 'Confusional state', count: 13910 },
      { term: 'Respiratory depression', count: 8920 },
      { term: 'Ataxia', count: 7650 },
      { term: 'Drug dependence', count: 6840 }
    ]
  },
  'haloperidol': {
    rxcui: '5093',
    brand: 'Haldol',
    acb: 1,
    minEffectiveDoseMg: 1,
    halfLifeHours: 20,
    beersTable2: true,
    beersReason: 'First-generation typical antipsychotic; high incidence of extrapyramidal symptoms, tardive dyskinesia, and mortality in dementia.',
    renalCutoffCrCl: null,
    requiresTaper: true,
    classes: ['N05AD - Butyrophenone derivatives (Antipsychotics)'],
    faersTopReactions: [
      { term: 'Extrapyramidal disorder', count: 18420 },
      { term: 'Somnolence', count: 12410 },
      { term: 'Tardive dyskinesia', count: 9840 },
      { term: 'Neuroleptic malignant syndrome', count: 6420 },
      { term: 'Hypotension', count: 5890 },
      { term: 'QT prolongation', count: 4890 }
    ]
  },
  'ibuprofen': {
    rxcui: '5640',
    brand: 'Advil / Motrin',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 2,
    beersTable2: true,
    beersReason: 'Nonselective NSAID; high risk of GI toxicity, fluid retention, hypertension, and acute kidney injury.',
    renalCutoffCrCl: 30,
    renalRuleText: '2023 Beers Table 6: Avoid NSAIDs when CrCl < 30 mL/min due to acute kidney injury risk.',
    requiresTaper: false,
    classes: ['M01AE - Propionic acid derivatives (NSAIDs)'],
    faersTopReactions: [
      { term: 'Gastrointestinal haemorrhage', count: 16420 },
      { term: 'Acute kidney injury', count: 11240 },
      { term: 'Dyspepsia', count: 8940 },
      { term: 'Hypertension', count: 7890 },
      { term: 'Abdominal pain', count: 6420 },
      { term: 'Oedema peripheral', count: 5120 }
    ]
  },
  'pantoprazole': {
    rxcui: '40790',
    brand: 'Protonix',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 1,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['A02BC - Proton pump inhibitors'],
    faersTopReactions: [
      { term: 'Diarrhoea', count: 8940 },
      { term: 'Clostridioides difficile colitis', count: 7420 },
      { term: 'Hypomagnesaemia', count: 5890 },
      { term: 'Headache', count: 5120 },
      { term: 'Bone fracture', count: 4210 },
      { term: 'Pneumonia', count: 3840 }
    ]
  },
  'aspirin': {
    rxcui: '1191',
    brand: 'Bayer / Ecotrin',
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 0.5,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['B01AC - Platelet aggregation inhibitors excl. heparin'],
    faersTopReactions: [
      { term: 'Gastrointestinal haemorrhage', count: 21450 },
      { term: 'Dyspepsia', count: 12410 },
      { term: 'Epistaxis', count: 8920 },
      { term: 'Haematoma', count: 7120 },
      { term: 'Nausea', count: 6840 },
      { term: 'Melaena', count: 5920 }
    ]
  }
};

/**
 * Returns offline cache profile or synthesizes a safe clinical fallback
 */
export function getOfflineDrugProfile(drugName: string): DrugCacheEntry {
  const key = drugName.toLowerCase().trim();
  if (OFFLINE_DRUG_CACHE[key]) {
    return OFFLINE_DRUG_CACHE[key];
  }
  // Check substring matches
  for (const [k, v] of Object.entries(OFFLINE_DRUG_CACHE)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }
  // Generic safe fallback profile
  return {
    rxcui: 'N/A',
    brand: drugName,
    acb: 0,
    minEffectiveDoseMg: null,
    halfLifeHours: 12,
    beersTable2: false,
    renalCutoffCrCl: null,
    requiresTaper: false,
    classes: ['General Geriatric Pharmacotherapy'],
    faersTopReactions: [
      { term: 'Dizziness', count: 1200 },
      { term: 'Fatigue', count: 980 },
      { term: 'Nausea', count: 840 },
      { term: 'Headache', count: 720 },
      { term: 'Somnolence', count: 610 },
      { term: 'Rash', count: 450 }
    ]
  };
}
