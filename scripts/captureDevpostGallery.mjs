import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Static Production HTTP Server to serve dist/
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json'
};

function startServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      let filePath = path.join(projectRoot, 'dist', reqPath === '/' ? 'index.html' : reqPath);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(projectRoot, 'dist', 'index.html');
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      console.log(`[Capture] Production preview server listening at http://localhost:${port}`);
      resolve(server);
    });
  });
}

// Chrome paths on Windows
const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const chromePath = chromeCandidates.find(p => fs.existsSync(p));

async function run() {
  const server = await startServer(4173);
  const baseUrl = 'http://localhost:4173';

  console.log(`[Capture] Launching Chrome (${chromePath || 'default channel'})...`);
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=max']
  });

  // Exact 3:2 viewport (1500x1000) with 1.5 deviceScaleFactor -> 2250x1500 PNG
  const context = await browser.newContext({
    viewport: { width: 1500, height: 1000 },
    deviceScaleFactor: 1.5
  });

  const page = await context.newPage();
  console.log(`[Capture] Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Helper to sleep and take screenshot
  async function snap(filename, desc) {
    await page.waitForTimeout(600);
    const dest = path.join(assetsDir, filename);
    await page.screenshot({ path: dest, fullPage: false });
    const stat = fs.statSync(dest);
    const kb = (stat.size / 1024).toFixed(1);
    console.log(`✓ [Captured] ${filename} (${kb} KB) - ${desc}`);
  }

  try {
    // -------------------------------------------------------------
    // 1. assets/01-case1-martha-4drug-domino-cascade.png
    // -------------------------------------------------------------
    console.log('\n[1/10] Capturing Case 1: Martha V. 4-Drug Domino Cascade...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '01-case1-martha-4drug-domino-cascade.png',
      'Martha V. Baseline 4-Drug Domino Cascade (PHI 92, ACB 4, CrCl 32.4)'
    );

    // -------------------------------------------------------------
    // 2. assets/02-case1-root-switch-simulation-losartan.png
    // -------------------------------------------------------------
    console.log('\n[2/10] Simulating Root Switch (Losartan substitution)...');
    // Click button 2 on Judge ribbon or in hero center
    const simBtn = page.locator('button:has-text("Simulate Root Switch")').first();
    if (await simBtn.count() > 0) {
      await simBtn.click();
    } else {
      const altBtn = page.locator('button:has-text("Simulate Root")').first();
      await altBtn.click();
    }
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '02-case1-root-switch-simulation-losartan.png',
      'Case 1 Root Switch Simulation: Losartan 50mg, PHI drops 92 -> 12'
    );

    // -------------------------------------------------------------
    // 3. assets/03-pk-washout-curve-and-hyperbolic-taper.png
    // -------------------------------------------------------------
    console.log('\n[3/10] Framing 5-Half-Life PK Washout & Hyperbolic Taper...');
    // Ensure PK section is expanded
    const inspectPkBtn = page.locator('button:has-text("Inspect Washout & Taper")').first();
    if (await inspectPkBtn.count() > 0) {
      await inspectPkBtn.click();
      await page.waitForTimeout(400);
    }
    // Scroll into view of washout section
    await page.evaluate(() => {
      const el = document.getElementById('washout-section');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo({ top: 600, behavior: 'instant' });
      }
    });
    await snap(
      '03-pk-washout-curve-and-hyperbolic-taper.png',
      '5-Half-Life PK Washout Curve & 4-Step Hyperbolic Tapering Protocol'
    );

    // -------------------------------------------------------------
    // 4. assets/04-federal-evidence-inspector-openfda.png
    // -------------------------------------------------------------
    console.log('\n[4/10] Switching to Federal REST Evidence Inspector (Tab 1)...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const tab1Btn = page.locator('button:has-text("Evidence, Federal Inspector")').first();
    await tab1Btn.click();
    await page.waitForTimeout(600);

    // Select Oxybutynin or Amlodipine
    const drugSelect = page.locator('#inspector-drug-select');
    if (await drugSelect.count() > 0) {
      await drugSelect.selectOption({ label: 'Oxybutynin (Ditropan)' }).catch(() => {
        return drugSelect.selectOption('oxybutynin').catch(() => {});
      });
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '04-federal-evidence-inspector-openfda.png',
      'Federal Evidence Inspector (NIH RxNorm RxCUI, RxClass, OpenFDA FAERS)'
    );

    // -------------------------------------------------------------
    // 5. assets/05-case2-arthur-stage4-ckd-renal-guard.png
    // -------------------------------------------------------------
    console.log('\n[5/10] Switching to Case 2: Arthur K. (Stage 4 CKD Renal Guard)...');
    // Switch to Tab 0
    const tab0Btn = page.locator('button:has-text("Interactive Causal Graph")').first();
    await tab0Btn.click();
    await page.waitForTimeout(400);

    // Click Arthur K. preset card
    const arthurPreset = page.locator('text=Arthur K.').first();
    await arthurPreset.click();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '05-case2-arthur-stage4-ckd-renal-guard.png',
      'Arthur K. Stage 4 CKD CrCl 24.9 mL/min & Beers Table 6 Renal Alerts'
    );

    // -------------------------------------------------------------
    // 6. assets/06-case2-two-step-renal-optimization.png
    // -------------------------------------------------------------
    console.log('\n[6/10] Simulating Arthur K. Two-Step Renal Optimization...');
    const step1Btn = page.locator('button:has-text("Step 1: Sever Statin")').first();
    if (await step1Btn.count() > 0) {
      await step1Btn.click();
      await page.waitForTimeout(400);
    }
    const step2Btn = page.locator('button:has-text("Step 2: Full Regimen & Renal Optimization")').first();
    if (await step2Btn.count() > 0) {
      await step2Btn.click();
    } else {
      const optBtn = page.locator('button:has-text("Full Regimen")').first();
      if (await optBtn.count() > 0) await optBtn.click();
    }
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '06-case2-two-step-renal-optimization.png',
      'Arthur K. Renal Optimization: Pravastatin Switch, PHI drops 82 -> 12'
    );

    // -------------------------------------------------------------
    // 7. assets/07-tab2-eleanor-hospital-discharge-reconciliation.png
    // -------------------------------------------------------------
    console.log('\n[7/10] Loading Case 3: Eleanor R. (Discharge Reconciliation Trap)...');
    const eleanorPreset = page.locator('text=Eleanor R.').first();
    await eleanorPreset.click();
    await page.waitForTimeout(400);

    // Switch to Tab 1 (Evidence & Reconciliation)
    await tab1Btn.click();
    await page.waitForTimeout(600);

    // Scroll to frame the Hospital Discharge Reconciliation Diff Engine
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h3')).find(h =>
        h.textContent.includes('Hospital-to-Home Discharge')
      );
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo({ top: 400, behavior: 'instant' });
      }
    });
    await snap(
      '07-tab2-eleanor-hospital-discharge-reconciliation.png',
      'Eleanor R. Discharge Discrepancies (Beta-Blocker Duplication & Omission)'
    );

    // -------------------------------------------------------------
    // 8. assets/08-tab2-reconciliation-resolved-and-nlp-parser.png
    // -------------------------------------------------------------
    console.log('\n[8/10] Resolving Reconciliation & Opening Clinical Note NLP Ingestor...');
    // Click Execute Reconciliation
    const reconcileBtn = page.locator('button:has-text("Execute Discharge Reconciliation")').first();
    if (await reconcileBtn.count() > 0) {
      await reconcileBtn.click();
      await page.waitForTimeout(400);
    }

    // Switch to Tab 2 (Unit Tests, Custom NLP & FHIR)
    const tab2Btn = page.locator('button:has-text("Unit Tests, Custom NLP")').first();
    await tab2Btn.click();
    await page.waitForTimeout(600);

    // Scroll down to the Zero-Key Clinical Note NLP Parser
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h3')).find(h =>
        h.textContent.includes('Clinical Note NLP') || h.textContent.includes('Custom Regimen')
      );
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo({ top: 520, behavior: 'instant' });
      }
    });

    // Click sample note 1 to highlight parsed tags
    const sampleNoteBtn = page.locator('button:has-text("Sample Note 1")').first();
    if (await sampleNoteBtn.count() > 0) {
      await sampleNoteBtn.click();
      await page.waitForTimeout(400);
    }
    await snap(
      '08-tab2-reconciliation-resolved-and-nlp-parser.png',
      'Reconciliation Resolved & Zero-Key Clinical Note NLP Ingestion'
    );

    // -------------------------------------------------------------
    // 9. assets/09-senior-caregiver-plain-english-accessibility.png
    // -------------------------------------------------------------
    console.log('\n[9/10] Enabling Senior/Caregiver Plain-English Accessibility Mode...');
    // Reset to Martha V. on Tab 0
    await tab0Btn.click();
    await page.waitForTimeout(300);
    const marthaPreset = page.locator('text=Martha V.').first();
    await marthaPreset.click();
    await page.waitForTimeout(400);

    // Toggle Patient/Caregiver View & Large Text
    const caregiverBtn = page.locator('button:has-text("Patient / Caregiver View")').first();
    if (await caregiverBtn.count() > 0) {
      await caregiverBtn.click();
    }
    const largeTextBtn = page.locator('button:has-text("A+")').first();
    if (await largeTextBtn.count() > 0) {
      await largeTextBtn.click();
    }
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '09-senior-caregiver-plain-english-accessibility.png',
      'Senior/Caregiver Plain-English View with Large Text Accessibility'
    );

    // Reset accessibility toggles
    if (await largeTextBtn.count() > 0) await largeTextBtn.click();
    const clinicianBtn = page.locator('button:has-text("Clinician Pharmacology View")').first();
    if (await clinicianBtn.count() > 0) await clinicianBtn.click();

    // -------------------------------------------------------------
    // 10. assets/10-tab3-15-unit-tests-backend-api-fhir-r4.png
    // -------------------------------------------------------------
    console.log('\n[10/10] Running 15 Clinical Unit Tests & Backend API Audit...');
    await tab2Btn.click();
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    // Run 15 unit tests
    const runTestsBtn = page.locator('button:has-text("Run 15 Automated Unit Tests")').first();
    if (await runTestsBtn.count() > 0) {
      await runTestsBtn.click();
      await page.waitForTimeout(600);
    }

    // Trigger POST /api/clinical-audit
    const auditBtn = page.locator('button:has-text("Execute POST /api/clinical-audit")').first();
    if (await auditBtn.count() > 0) {
      await auditBtn.click();
      await page.waitForTimeout(800);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await snap(
      '10-tab3-15-unit-tests-backend-api-fhir-r4.png',
      '15/15 Automated Unit Tests PASS, SHA-256 Backend Audit & FHIR R4'
    );

  } catch (err) {
    console.error('[Error during capture]:', err);
  } finally {
    await browser.close();
    server.close();
    console.log('\n[Capture] Finished screenshot automation.');
  }
}

run();
