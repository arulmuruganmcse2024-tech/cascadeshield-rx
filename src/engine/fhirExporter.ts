// src/engine/fhirExporter.ts
// Official HL7 FHIR R4 Clinical Bundle Generator for EHR interoperability

import { PatientVitals, RegimenMed, ClinicalAnalysisResult } from '../types/clinical';
import { getOfflineDrugProfile } from '../data/offlineDrugCache';

export interface FhirBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'collection';
  timestamp: string;
  meta: {
    lastUpdated: string;
    profile: string[];
  };
  entry: Array<{
    fullUrl: string;
    resource: any;
  }>;
}

export function generateFhirR4Bundle(
  vitals: PatientVitals,
  regimen: RegimenMed[],
  analysis: ClinicalAnalysisResult,
  patientName = 'CascadeShield Patient'
): FhirBundle {
  const bundleId = `cascadeshield-bundle-${Date.now()}`;
  const now = new Date().toISOString();
  const patientId = `patient-cs-${Math.abs(vitals.age * 137 + (vitals.sex === 'F' ? 1 : 2))}`;

  const entries: Array<{ fullUrl: string; resource: any }> = [];

  // 1. Patient Resource
  entries.push({
    fullUrl: `urn:uuid:${patientId}`,
    resource: {
      resourceType: 'Patient',
      id: patientId,
      meta: {
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient']
      },
      name: [
        {
          use: 'official',
          text: patientName
        }
      ],
      gender: vitals.sex === 'F' ? 'female' : 'male',
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-age',
          valueInteger: vitals.age
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-weight-kg',
          valueQuantity: {
            value: vitals.weightKg,
            unit: 'kg',
            system: 'http://unitsofmeasure.org',
            code: 'kg'
          }
        }
      ]
    }
  });

  // 2. Renal Observations (LOINC 2160-0 Serum Creatinine & LOINC 33558-8 Cockcroft-Gault CrCl)
  entries.push({
    fullUrl: `urn:uuid:obs-scr-${Date.now()}`,
    resource: {
      resourceType: 'Observation',
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'laboratory',
              display: 'Laboratory'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '2160-0',
            display: 'Creatinine [Mass/volume] in Serum or Plasma'
          }
        ],
        text: 'Serum Creatinine'
      },
      subject: { reference: `urn:uuid:${patientId}` },
      valueQuantity: {
        value: vitals.serumCreatinineMgDl,
        unit: 'mg/dL',
        system: 'http://unitsofmeasure.org',
        code: 'mg/dL'
      }
    }
  });

  entries.push({
    fullUrl: `urn:uuid:obs-crcl-${Date.now()}`,
    resource: {
      resourceType: 'Observation',
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'exam',
              display: 'Exam'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '33558-8',
            display: 'Creatinine renal clearance formula (Cockcroft-Gault)'
          }
        ],
        text: 'Cockcroft-Gault Estimated Creatinine Clearance'
      },
      subject: { reference: `urn:uuid:${patientId}` },
      valueQuantity: {
        value: analysis.crcl,
        unit: 'mL/min',
        system: 'http://unitsofmeasure.org',
        code: 'mL/min'
      },
      interpretation: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: analysis.crcl < 30 ? 'LL' : (analysis.crcl < 60 ? 'L' : 'N'),
              display: analysis.crcl < 30 ? 'Critically Low (<30 mL/min)' : (analysis.crcl < 60 ? 'Low (<60 mL/min)' : 'Normal')
            }
          ]
        }
      ]
    }
  });

  // 3. MedicationStatements with official RxNorm codes
  for (const med of regimen) {
    const profile = getOfflineDrugProfile(med.genericName);
    entries.push({
      fullUrl: `urn:uuid:med-${med.id}`,
      resource: {
        resourceType: 'MedicationStatement',
        id: `med-${med.id}`,
        status: med.isDeprescribed ? 'stopped' : 'active',
        subject: { reference: `urn:uuid:${patientId}` },
        medicationCodeableConcept: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: profile.rxcui !== 'N/A' ? profile.rxcui : 'CUSTOM-RXCUI',
              display: med.displayName
            }
          ],
          text: med.displayName
        },
        dosage: [
          {
            text: med.doseLabel,
            route: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '260548002',
                  display: 'Oral'
                }
              ]
            }
          }
        ],
        note: [
          {
            text: med.isDeprescribed
              ? `DEPRESCRIBED: ${med.deprescribeReason || 'Prescribing cascade severing / renal safety optimization'}`
              : `Active medication. Start Day: ${med.startDay}. Reported Symptom: ${med.reportedSymptom || 'Routine management'}. ACB Score: ${profile.acb}.`
          }
        ]
      }
    });
  }

  // 4. DetectedIssue Resources for Identified Prescribing Cascades
  for (let idx = 0; idx < analysis.cascades.length; idx++) {
    const c = analysis.cascades[idx];
    entries.push({
      fullUrl: `urn:uuid:cascade-issue-${idx + 1}`,
      resource: {
        resourceType: 'DetectedIssue',
        id: `issue-cascade-${idx + 1}`,
        status: 'preliminary',
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/detectedissue-category',
              code: 'DRG-CASCADE',
              display: 'Prescribing Cascade Toxicity'
            }
          ],
          text: c.ruleName
        },
        severity: c.confidence >= 90 ? 'high' : 'moderate',
        patient: { reference: `urn:uuid:${patientId}` },
        implicated: [
          { reference: `urn:uuid:med-${c.fromMed.id}`, display: c.fromMed.displayName },
          { reference: `urn:uuid:med-${c.toMed.id}`, display: c.toMed.displayName }
        ],
        detail: `Prescribing Cascade identified with Confidence Score ${c.confidence}/100 (Signal Strength E=${c.signalE}, Latency=${c.dtDays} days). ${c.clinicalBridge}. Peer Evidence: ${c.citation}.`,
        mitigation: [
          {
            action: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/us/core/CodeSystem/clinical-action',
                  code: 'DEPRESCRIBE_ROOT_SUBSTITUTION',
                  display: 'Deprescribe or Substitute Root Cause'
                }
              ],
              text: c.agsAlternativeLabel
            }
          }
        ]
      }
    });
  }

  // 5. DetectedIssue Resources for Beers Table 6 Renal Violations
  for (let idx = 0; idx < analysis.renalAlerts.length; idx++) {
    const r = analysis.renalAlerts[idx];
    entries.push({
      fullUrl: `urn:uuid:renal-issue-${idx + 1}`,
      resource: {
        resourceType: 'DetectedIssue',
        id: `issue-renal-${idx + 1}`,
        status: 'preliminary',
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/detectedissue-category',
              code: 'RENAL-BEERS6',
              display: '2023 AGS Beers Criteria Table 6 Renal Threshold Violation'
            }
          ],
          text: `Renal Impairment Contraindication for ${r.med.displayName}`
        },
        severity: r.severity === 'CONTRAINDICATED' ? 'high' : 'moderate',
        patient: { reference: `urn:uuid:${patientId}` },
        implicated: [{ reference: `urn:uuid:med-${r.med.id}`, display: r.med.displayName }],
        detail: `${r.ruleText} Patient CrCl = ${r.actualCrCl} mL/min is below safety threshold ${r.cutoffCrCl} mL/min.`
      }
    });
  }

  // 6. DetectedIssue Resources for Hospital Discharge Reconciliation Diffs
  for (let idx = 0; idx < analysis.reconciliations.length; idx++) {
    const rec = analysis.reconciliations[idx];
    entries.push({
      fullUrl: `urn:uuid:reconcil-issue-${idx + 1}`,
      resource: {
        resourceType: 'DetectedIssue',
        id: `issue-reconcil-${idx + 1}`,
        status: 'preliminary',
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/detectedissue-category',
              code: rec.type === 'DUPLICATION' ? 'DUP-THERAPY' : 'OMIT-START3',
              display: rec.type === 'DUPLICATION' ? 'Duplicate Pharmacotherapy' : 'Omission of Indicated Medication'
            }
          ],
          text: rec.type
        },
        severity: rec.clinicalSeverity === 'HIGH' ? 'high' : 'moderate',
        patient: { reference: `urn:uuid:${patientId}` },
        detail: rec.description,
        mitigation: [
          {
            action: {
              text: rec.actionRequired
            }
          }
        ]
      }
    });
  }

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp: now,
    meta: {
      lastUpdated: now,
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle']
    },
    entry: entries
  };
}

export function downloadFhirBundleJson(bundle: FhirBundle, filename = 'cascadeshield-fhir-bundle.json'): void {
  const jsonStr = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
