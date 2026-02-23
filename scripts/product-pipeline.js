#!/usr/bin/env node

/**
 * Complete Product Pipeline: Design → Mockup → Stripe → POD → Store → Live
 * 
 * One command to:
 * 1. Generate product mockups from designs
 * 2. Create Stripe product + pricing
 * 3. Sync to Printful (POD)
 * 4. Publish to store
 * 5. Deploy to web
 * 
 * Usage: npm run product:complete -- --sku DIA-SYSTEM-000
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const skuIndex = args.indexOf('--sku');
if (skuIndex === -1) {
  console.error('❌ Usage: npm run product:complete -- --sku DIA-SYSTEM-000');
  process.exit(1);
}
const sku = args[skuIndex + 1];

const pipeline = [
  {
    name: '📷 Generate Mockups',
    cmd: 'node',
    args: ['scripts/generate-mockups.js', '--sku', sku],
  },
  {
    name: '💳 Create Stripe Product',
    cmd: 'node',
    args: ['scripts/create-product-stripe-pod.js', '--sku', sku],
  },
  {
    name: '🖨️  Sync to Printful',
    cmd: 'npm',
    args: ['run', 'sync-printful'],
  },
  {
    name: '📦 Publish to Store',
    cmd: 'npm',
    args: ['run', 'ingest-store'],
  },
  {
    name: '🚀 Deploy to Web',
    cmd: 'npm',
    args: ['run', 'deploy'],
  },
];

async function runCommand(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n${step.name}...`);
    
    const proc = spawn(step.cmd, step.args, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        console.log(`✓ ${step.name} completed`);
        resolve();
      } else {
        reject(new Error(`${step.name} failed with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function main() {
  console.log(`\n🎯 Complete Product Pipeline: ${sku}\n`);

  try {
    for (let i = 0; i < pipeline.length; i++) {
      const step = pipeline[i];
      console.log(`\n[${i + 1}/${pipeline.length}] ${step.name}`);
      
      try {
        await runCommand(step);
      } catch (error) {
        console.error(`❌ ${step.name} failed: ${error.message}`);
        console.log(`\nYou can retry with: npm run ${step.cmd} ${step.args.join(' ')}`);
        process.exit(1);
      }
    }

    console.log(`\n✅ Pipeline Complete!\n`);
    console.log(`Product: ${sku}`);
    console.log(`Status: Live on doitanyways.netlify.app`);
    console.log(`Next: Promote on social media → Revenue starts\n`);

  } catch (error) {
    console.error(`\n❌ Pipeline failed: ${error.message}\n`);
    process.exit(1);
  }
}

main();
