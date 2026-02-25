#!/usr/bin/env node

/**
 * D.I.A. — Quick Connection Test
 * Tests Stripe + Printful API connections
 *
 * Usage: npm run connect
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });

const C = {
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m'
};

async function testStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('ENTER_') || key.includes('REPLACE_')) {
    return { ok: false, error: 'No secret key — add STRIPE_SECRET_KEY to .env' };
  }
  try {
    const auth = Buffer.from(`${key}:`).toString('base64');
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (!res.ok) {
      const err = await res.json();
      return { ok: false, error: err.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    const nzd = data.available?.find(b => b.currency === 'nzd');
    return { ok: true, detail: nzd ? `NZ$${(nzd.amount / 100).toFixed(2)} available` : 'Connected' };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function testPrintful() {
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token || token.includes('YOUR_')) {
    return { ok: false, error: 'No token — add PRINTFUL_API_TOKEN to .env' };
  }
  try {
    // Try /stores endpoint first (works with OAuth/personal tokens)
    let res = await fetch('https://api.printful.com/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const stores = data.result || [];
      if (stores.length > 0) {
        const store = stores[0];
        return { ok: true, detail: `Store: "${store.name}" (ID: ${store.id})` };
      }
      return { ok: true, detail: 'Connected — no stores yet. Create one at printful.com' };
    }
    // Fallback to /store with store_id header
    res = await fetch('https://api.printful.com/store', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || ''
      }
    });
    if (!res.ok) {
      const err = await res.json();
      return { ok: false, error: err.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { ok: true, detail: `Store: "${data.result?.name}" (ID: ${data.result?.id})` };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function main() {
  console.log(`\n${C.red}${C.bold}  D.I.A. — Connection Check${C.reset}\n`);

  process.stdout.write(`  Stripe ....... `);
  const s = await testStripe();
  console.log(s.ok ? `${C.green}✓ ${s.detail}${C.reset}` : `${C.red}✗ ${s.error}${C.reset}`);

  process.stdout.write(`  Printful ..... `);
  const p = await testPrintful();
  console.log(p.ok ? `${C.green}✓ ${p.detail}${C.reset}` : `${C.red}✗ ${p.error}${C.reset}`);

  const allGood = s.ok && p.ok;
  console.log(`\n  ${allGood ? `${C.green}${C.bold}All systems go!` : `${C.yellow}Run ${C.cyan}npm run setup${C.yellow} to fix missing keys`}${C.reset}\n`);
}

main();
