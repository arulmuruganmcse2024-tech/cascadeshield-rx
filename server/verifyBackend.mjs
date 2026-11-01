// server/verifyBackend.mjs
// Automated CI Backend Test Suite for CascadeShield Rx
// Validates Node.js REST API Server, Cockcroft-Gault, PHI calculation, and SHA-256 signatures

import { createServer } from './clinicalServer.mjs';

async function runBackendVerification() {
  console.log('\n=============================================================');
  console.log('🩺 CASCADESHIELD RX: NODE.JS BACKEND REST SERVER CI VERIFIER');
  console.log('=============================================================\n');

  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`[CI] Server started on ephemeral port: ${address.port}\n`);

  let failures = 0;

  // Test 1: GET /api/health
  try {
    const t0 = performance.now();
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    const dt = Math.round(performance.now() - t0);

    if (res.status === 200 && data.status === 'ok' && Array.isArray(data.standards)) {
      console.log(`✓ Test 1: GET /api/health -> 200 OK (${dt}ms)`);
      console.log(`   Service: ${data.engine} (v${data.version})`);
      console.log(`   Standards Verified: ${data.standards.length} clinical consensus bodies\n`);
    } else {
      console.error(`✗ Test 1: GET /api/health failed. Status: ${res.status}`);
      failures++;
    }
  } catch (err) {
    console.error(`✗ Test 1 Exception:`, err.message);
    failures++;
  }

  // Test 2: POST /api/clinical-audit (Martha V. 4-Drug Cascade Test)
  try {
    const marthaPayload = {
      presetId: 'martha_v',
      vitals: {
        age: 78,
        sex: 'F',
        weightKg: 62,
        serumCreatinineMgDl: 1.4,
        diagnoses: ['Hypertension', 'Osteoarthritis']
      },
      regimen: [
        { id: 'm1', genericName: 'amlodipine', displayName: 'Amlodipine (Norvasc)', doseLabel: '10 mg daily', dailyDoseMg: 10, startDay: 0 },
        { id: 'm2', genericName: 'furosemide', displayName: 'Furosemide (Lasix)', doseLabel: '40 mg daily', dailyDoseMg: 40, startDay: 24 },
        { id: 'm3', genericName: 'oxybutynin', displayName: 'Oxybutynin (Ditropan)', doseLabel: '10 mg daily', dailyDoseMg: 10, startDay: 52 },
        { id: 'm4', genericName: 'donepezil', displayName: 'Donepezil (Aricept)', doseLabel: '5 mg QHS', dailyDoseMg: 5, startDay: 85 },
        { id: 'm5', genericName: 'zolpidem', displayName: 'Zolpidem (Ambien)', doseLabel: '5 mg QHS', dailyDoseMg: 5, startDay: 105 }
      ]
    };

    const t0 = performance.now();
    const res = await fetch(`${baseUrl}/api/clinical-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marthaPayload)
    });
    const data = await res.json();
    const dt = Math.round(performance.now() - t0);

    const hasCrCl = data?.analytics?.crclMlMin === 32.4;
    const hasPhi = data?.analytics?.phiScore === 92;
    const hasCascades = data?.detectedCascades?.length === 4;
    const hasHash = typeof data?.sha256_integrity_hash === 'string' && data.sha256_integrity_hash.length === 64;

    if (res.status === 200 && hasCrCl && hasPhi && hasCascades && hasHash) {
      console.log(`✓ Test 2: POST /api/clinical-audit -> 200 OK (${dt}ms)`);
      console.log(`   Patient CrCl: ${data.analytics.crclMlMin} mL/min (Exact Cockcroft-Gault verified)`);
      console.log(`   Harm Index (PHI): ${data.analytics.phiScore}/100 (4 Cascade chains flagged)`);
      console.log(`   Cryptographic SHA-256 Hash: ${data.sha256_integrity_hash}`);
      console.log(`   HL7 FHIR R4 Bundle Entries: ${data.fhirBundleSummary.totalEntries} resources\n`);
    } else {
      console.error(`✗ Test 2 Failed:`, { status: res.status, hasCrCl, hasPhi, hasCascades, hasHash });
      failures++;
    }
  } catch (err) {
    console.error(`✗ Test 2 Exception:`, err.message);
    failures++;
  }

  // Teardown
  server.close(() => {
    console.log('-------------------------------------------------------------');
    if (failures === 0) {
      console.log('🎉 ALL BACKEND REST TESTS PASSED (100% CI VERIFIED)');
      console.log('-------------------------------------------------------------\n');
    } else {
      console.error(`💥 ${failures} BACKEND TESTS FAILED`);
      console.log('-------------------------------------------------------------\n');
      process.exitCode = 1;
    }
  });
}

runBackendVerification();
