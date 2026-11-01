// server/clinicalServer.mjs
// Standalone Node.js REST Backend Server for CascadeShield Rx
// Zero external dependencies - pure Node.js HTTP & Crypto

import http from 'node:http';
import crypto from 'node:crypto';

// Server-side Drug Dictionary for Deterministic CDSS
const SERVER_DRUG_MAP = {
  'amlodipine': { rxcui: '17767', brand: 'Norvasc', acb: 0, minDoseMg: null, halfLifeHours: 40, beers2: false, renal: null },
  'losartan': { rxcui: '52175', brand: 'Cozaar', acb: 0, minDoseMg: null, halfLifeHours: 6, beers2: false, renal: null },
  'furosemide': { rxcui: '4603', brand: 'Lasix', acb: 1, minDoseMg: null, halfLifeHours: 2, beers2: false, renal: null },
  'oxybutynin': { rxcui: '32675', brand: 'Ditropan', acb: 3, minDoseMg: 5, halfLifeHours: 13, beers2: true, renal: null },
  'donepezil': { rxcui: '135447', brand: 'Aricept', acb: 0, minDoseMg: null, halfLifeHours: 70, beers2: false, renal: null },
  'zolpidem': { rxcui: '39993', brand: 'Ambien', acb: 0, minDoseMg: 5, halfLifeHours: 2.5, beers2: true, renal: null },
  'atorvastatin': { rxcui: '83367', brand: 'Lipitor', acb: 0, minDoseMg: null, halfLifeHours: 14, beers2: false, renal: null },
  'pravastatin': { rxcui: '42463', brand: 'Pravachol', acb: 0, minDoseMg: null, halfLifeHours: 2, beers2: false, renal: null },
  'naproxen': { rxcui: '7258', brand: 'Naprosyn', acb: 0, minDoseMg: null, halfLifeHours: 14, beers2: true, renal: 30 },
  'baclofen': { rxcui: '1292', brand: 'Lioresal', acb: 2, minDoseMg: 15, halfLifeHours: 4, beers2: true, renal: 60 },
  'ciprofloxacin': { rxcui: '2551', brand: 'Cipro', acb: 0, minDoseMg: null, halfLifeHours: 4, beers2: false, renal: 30 },
  'ferrous sulfate': { rxcui: '4239', brand: 'Feosol', acb: 0, minDoseMg: null, halfLifeHours: 6, beers2: false, renal: null },
  'senna': { rxcui: '9662', brand: 'Senokot', acb: 0, minDoseMg: null, halfLifeHours: 8, beers2: false, renal: null },
  'loperamide': { rxcui: '6468', brand: 'Imodium', acb: 0, minDoseMg: null, halfLifeHours: 11, beers2: false, renal: null },
  'prednisone': { rxcui: '8640', brand: 'Deltasone', acb: 1, minDoseMg: null, halfLifeHours: 3.5, beers2: false, renal: null },
  'quetiapine': { rxcui: '51272', brand: 'Seroquel', acb: 3, minDoseMg: 25, halfLifeHours: 6, beers2: true, renal: null },
  'metoprolol tartrate': { rxcui: '6918', brand: 'Lopressor', acb: 1, minDoseMg: null, halfLifeHours: 3.5, beers2: false, renal: null },
  'metoprolol succinate': { rxcui: '6918', brand: 'Toprol-XL', acb: 1, minDoseMg: null, halfLifeHours: 7, beers2: false, renal: null },
  'empagliflozin': { rxcui: '1545653', brand: 'Jardiance', acb: 0, minDoseMg: null, halfLifeHours: 12.4, beers2: false, renal: null }
};

// 1. Cockcroft-Gault Creatinine Clearance (CrCl) with Sarcopenia Floor
export function calcCrClServer(vitals) {
  const age = Math.max(18.0, Math.min(115.0, Number(vitals?.age) || 75.0));
  const weight = Math.max(25.0, Math.min(250.0, Number(vitals?.weightKg) || 65.0));
  const rawScr = Number(vitals?.serumCreatinineMgDl);
  const scrVal = isNaN(rawScr) ? 1.0 : rawScr;
  const scr = Math.max(0.4, Math.min(15.0, scrVal));
  let crcl = ((140.0 - age) * weight) / (72.0 * scr);
  if (vitals?.sex === 'F') {
    crcl *= 0.85;
  }
  return Math.round(crcl * 10.0) / 10.0;
}

// 2. Cascade Temporal Decay Kernel
function calcWindowWeight(dtDays, tauMin, tauMax) {
  if (dtDays <= 0 || !Number.isFinite(dtDays)) return 0.0;
  if (dtDays < tauMin) return 0.75;
  if (dtDays <= tauMax) return 1.00;
  if (dtDays <= 365) {
    return Math.max(0.25, Number(Math.exp(-(dtDays - tauMax) / 180.0).toFixed(4)));
  }
  return 0.25;
}

// 3. Cascade Confidence Calculation
function calcCascadeConfidence(signalStrengthE, dtDays, tauMin, tauMax, hasSymptomMatch, hasComorbidityConfounder) {
  if (dtDays <= 0 || !Number.isFinite(dtDays)) return 0;
  const wWin = calcWindowWeight(dtDays, tauMin, tauMax);
  const sSymp = hasSymptomMatch ? 1.0 : 0.4;
  const gamma = hasComorbidityConfounder ? 0.65 : 1.0;
  const raw = 100.0 * (0.45 * signalStrengthE + 0.35 * wWin + 0.20 * sSymp) * gamma;
  return Math.round(Math.max(0.0, Math.min(100.0, raw)));
}

// 4. Dose-Weighted Drug Burden Index (DBI)
function calcDBIServer(meds) {
  let sum = 0.0;
  for (const m of meds) {
    const prof = SERVER_DRUG_MAP[(m.genericName || '').toLowerCase()];
    if (prof && prof.minDoseMg && m.dailyDoseMg > 0) {
      sum += m.dailyDoseMg / (prof.minDoseMg + m.dailyDoseMg);
    }
  }
  return Math.round(sum * 100.0) / 100.0;
}

// 5. Composite Polypharmacy Harm Index (PHI)
function calcPHIServer(cascadeScores, acbTotal, beersPimCount, renalOrReconcilCount, crcl) {
  const k = cascadeScores.length;
  const maxC = k > 0 ? Math.max(...cascadeScores) : 0;
  const sCascade = k === 0 ? 0.0 : Math.min(40.0, 0.25 * maxC + 5.0 * k);
  const sAcb = Math.min(24.0, Math.max(0, acbTotal) * 6.0);
  const sPim = Math.min(24.0, Math.max(0, beersPimCount) * 8.0 + Math.max(0, renalOrReconcilCount) * 10.0);
  const sRenal = crcl < 45.0 ? 12.0 : (crcl < 60.0 ? 6.0 : 0.0);
  return Math.round(Math.min(100.0, sCascade + sAcb + sPim + sRenal));
}

// Execute complete Clinical Audit Server-Side
export function performServerAudit(payload) {
  const { vitals = {}, regimen = [], homeMeds = [], presetId = 'custom' } = payload;
  const crcl = calcCrClServer(vitals);
  const activeMeds = regimen.filter(m => !m.isDeprescribed);

  // ACB Score
  let acbTotal = 0;
  for (const m of activeMeds) {
    const prof = SERVER_DRUG_MAP[(m.genericName || '').toLowerCase()];
    if (prof?.acb) acbTotal += prof.acb;
  }

  // DBI Score
  const dbiTotal = calcDBIServer(activeMeds);

  // Beers PIMs & Renal Contraindications
  let beersPimCount = 0;
  let renalViolations = 0;
  for (const m of activeMeds) {
    const prof = SERVER_DRUG_MAP[(m.genericName || '').toLowerCase()];
    if (prof) {
      if (prof.beers2) beersPimCount++;
      if (prof.renal !== null && crcl < prof.renal) renalViolations++;
    }
  }

  // Hospital Discharge Omissions
  let omissionCount = 0;
  if (Array.isArray(homeMeds) && homeMeds.length > 0) {
    for (const hm of homeMeds) {
      const isPresent = activeMeds.some(am => (am.genericName || '').toLowerCase() === (hm.genericName || '').toLowerCase());
      if (!isPresent) omissionCount++;
    }
  }

  // Known Prescribing Cascades
  const cascadeScores = [];
  const detectedCascades = [];
  for (let i = 0; i < activeMeds.length; i++) {
    for (let j = 0; j < activeMeds.length; j++) {
      if (i === j) continue;
      const m1 = activeMeds[i];
      const m2 = activeMeds[j];
      const dt = (m2.startDay || 0) - (m1.startDay || 0);
      if (dt > 0) {
        const g1 = (m1.genericName || '').toLowerCase();
        const g2 = (m2.genericName || '').toLowerCase();
        let ruleMatch = null;

        if (g1.includes('amlodipine') && g2.includes('furosemide')) {
          ruleMatch = { name: 'CCB -> Loop Diuretic Cascade', sig: 0.92, tMin: 3, tMax: 30 };
        } else if (g1.includes('furosemide') && g2.includes('oxybutynin')) {
          ruleMatch = { name: 'Loop Diuretic -> Bladder Antimuscarinic Cascade', sig: 0.80, tMin: 3, tMax: 45 };
        } else if (g1.includes('oxybutynin') && g2.includes('donepezil')) {
          ruleMatch = { name: 'Anticholinergic -> AChEI Dementia Cascade', sig: 0.85, tMin: 7, tMax: 90 };
        } else if (g1.includes('donepezil') && g2.includes('zolpidem')) {
          ruleMatch = { name: 'AChEI -> Z-Drug Sedative Cascade', sig: 0.88, tMin: 3, tMax: 60 };
        } else if (g1.includes('atorvastatin') && g2.includes('naproxen')) {
          ruleMatch = { name: 'Statin -> NSAID Myalgia Cascade', sig: 0.88, tMin: 7, tMax: 60 };
        } else if (g1.includes('naproxen') && g2.includes('amlodipine')) {
          ruleMatch = { name: 'NSAID -> Antihypertensive Fluid Cascade', sig: 0.85, tMin: 3, tMax: 45 };
        } else if (g1.includes('prednisone') && g2.includes('quetiapine')) {
          ruleMatch = { name: 'Steroid -> Antipsychotic Delirium Cascade', sig: 0.98, tMin: 1, tMax: 14 };
        } else if (g1.includes('ferrous') && g2.includes('senna')) {
          ruleMatch = { name: 'Iron -> Stimulant Laxative Cascade', sig: 0.94, tMin: 3, tMax: 45 };
        } else if (g1.includes('senna') && g2.includes('loperamide')) {
          ruleMatch = { name: 'Laxative -> Anti-Diarrheal Pendulum Cascade', sig: 0.96, tMin: 1, tMax: 21 };
        }

        if (ruleMatch) {
          const conf = calcCascadeConfidence(ruleMatch.sig, dt, ruleMatch.tMin, ruleMatch.tMax, true, false);
          cascadeScores.push(conf);
          detectedCascades.push({
            rule: ruleMatch.name,
            from: m1.displayName || m1.genericName,
            to: m2.displayName || m2.genericName,
            dtDays: dt,
            confidence: conf
          });
        }
      }
    }
  }

  const phi = calcPHIServer(cascadeScores, acbTotal, beersPimCount, renalViolations + omissionCount, crcl);

  // Construct Signed HL7 FHIR R4 Bundle
  const bundleId = `urn:uuid:cs-${crypto.randomUUID()}`;
  const fhirBundle = {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          gender: vitals?.sex === 'F' ? 'female' : 'male',
          extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/patient-age', valueInteger: vitals?.age || 75 }]
        }
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '33558-8', display: 'Cockcroft-Gault CrCl' }] },
          valueQuantity: { value: crcl, unit: 'mL/min' }
        }
      },
      ...activeMeds.map((m, idx) => ({
        resource: {
          resourceType: 'MedicationStatement',
          id: `med-${idx + 1}`,
          status: 'active',
          medicationCodeableConcept: {
            coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: SERVER_DRUG_MAP[(m.genericName || '').toLowerCase()]?.rxcui || 'UNKNOWN', display: m.displayName || m.genericName }]
          },
          dosage: [{ text: m.doseLabel || '10 mg daily' }]
        }
      })),
      ...detectedCascades.map((c, idx) => ({
        resource: {
          resourceType: 'DetectedIssue',
          id: `cascade-${idx + 1}`,
          status: 'preliminary',
          code: { text: c.rule },
          severity: c.confidence >= 90 ? 'high' : 'moderate',
          detail: `Cascade ${c.from} -> ${c.to} at latency ${c.dtDays} days (Confidence: ${c.confidence}/100)`
        }
      }))
    ]
  };

  // Generate SHA-256 Cryptographic Hash over Audit
  const rawAuditEnvelope = JSON.stringify({ presetId, vitals, crcl, phi, acbTotal, dbiTotal, cascades: detectedCascades, fhirBundle });
  const sha256Hash = crypto.createHash('sha256').update(rawAuditEnvelope).digest('hex');

  return {
    status: 'SUCCESS',
    auditId: `audit_${crypto.randomBytes(6).toString('hex')}`,
    timestamp: new Date().toISOString(),
    sha256_integrity_hash: sha256Hash,
    analytics: {
      crclMlMin: crcl,
      phiScore: phi,
      acbScore: acbTotal,
      dbiScore: dbiTotal,
      beersPimCount,
      renalViolations,
      omissionCount,
      activeCascadesCount: detectedCascades.length
    },
    detectedCascades,
    fhirBundleSummary: {
      resourceType: 'Bundle',
      bundleId,
      totalEntries: fhirBundle.entry.length
    },
    fhirBundle
  };
}

// Create and export Node.js HTTP server instance
export function createServer() {
  return http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // GET /api/health
    if (req.method === 'GET' && pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        engine: 'CascadeShield Rx Node.js Clinical Graph & FHIR R4 Server',
        version: '2.1.0-fullstack',
        timestamp: new Date().toISOString(),
        standards: [
          '2026 BMJ PIPC',
          '2025 ThinkCascades',
          '2023 AGS Beers Criteria',
          '2025 AGS Alternatives',
          'STOPP/START v3',
          'HL7 FHIR R4'
        ],
        endpoints: ['GET /api/health', 'POST /api/clinical-audit', 'POST /api/fhir-r4']
      }));
      return;
    }

    // POST /api/clinical-audit
    if (req.method === 'POST' && pathname === '/api/clinical-audit') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = performServerAudit(payload);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Audit-Signature': result.sha256_integrity_hash
          });
          res.end(JSON.stringify(result, null, 2));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload', message: err.message }));
        }
      });
      return;
    }

    // POST /api/fhir-r4
    if (req.method === 'POST' && pathname === '/api/fhir-r4') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = performServerAudit(payload);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-FHIR-Checksum': result.sha256_integrity_hash
          });
          res.end(JSON.stringify(result.fhirBundle, null, 2));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload', message: err.message }));
        }
      });
      return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint Not Found', pathname }));
  });
}

// Start standalone server when executed directly
if (process.argv[1]?.endsWith('clinicalServer.mjs')) {
  const PORT = process.env.PORT || 8787;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`[CascadeShield Rx] Node.js Clinical Server listening at http://localhost:${PORT}`);
    console.log(`[CascadeShield Rx] Standards: 2026 BMJ | ThinkCascades | AGS Beers 2025 | HL7 FHIR R4`);
  });
}
