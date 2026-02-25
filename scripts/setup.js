#!/usr/bin/env node

/**
 * D.I.A. — Interactive Setup
 * Tests Stripe + Printful connections
 * Walks you through entering API keys
 *
 * Usage: npm run setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');

// Load existing .env
config({ path: ENV_PATH });

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

const C = {
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m'
};

function banner() {
  console.log(`\n${C.red}${C.bold}  ╔═══════════════════════════════════════╗`);
  console.log(`  ║       D.I.A. — SYSTEM SETUP           ║`);
  console.log(`  ╚═══════════════════════════════════════╝${C.reset}\n`);
}

// ─── Test Stripe ──────────────────────────────
async function testStripe(secretKey) {
  try {
    const auth = Buffer.from(`${secretKey}:`).toString('base64');
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (!res.ok) {
      const err = await res.json();
      return { ok: false, error: err.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    const nzd = data.available?.find(b => b.currency === 'nzd');
    return {
      ok: true,
      balance: nzd ? `NZ$${(nzd.amount / 100).toFixed(2)}` : 'Connected (no NZD balance yet)',
      mode: secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── Test Printful ────────────────────────────
async function testPrintful(token) {
  try {
    // Try /stores endpoint (works with personal access tokens)
    let res = await fetch('https://api.printful.com/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const stores = data.result || [];
      if (stores.length > 0) {
        return { ok: true, store: stores[0].name, id: stores[0].id };
      }
      return { ok: true, store: 'No stores yet — create one at printful.com', id: null };
    }
    // Fallback
    res = await fetch('https://api.printful.com/store', {
      headers: { 'Authorization': `Bearer ${token}`, 'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '' }
    });
    if (!res.ok) {
      const err = await res.json();
      return { ok: false, error: err.error?.message || `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { ok: true, store: data.result?.name || 'Connected', id: data.result?.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── List Printful Products ───────────────────
async function listPrintfulProducts(token) {
  try {
    const res = await fetch('https://api.printful.com/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const stores = data.result || [];
    if (stores.length === 0) return [];
    // Get products from first store
    const storeId = stores[0].id;
    const prodRes = await fetch('https://api.printful.com/store/products', {
      headers: { 'Authorization': `Bearer ${token}`, 'X-PF-Store-Id': String(storeId) }
    });
    if (!prodRes.ok) return [];
    const prodData = await prodRes.json();
    return prodData.result || [];
  } catch (e) {
    return [];
  }
}

// ─── List Stripe Products ─────────────────────
async function listStripeProducts(secretKey) {
  try {
    const auth = Buffer.from(`${secretKey}:`).toString('base64');
    const res = await fetch('https://api.stripe.com/v1/products?limit=10', {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    return [];
  }
}

// ─── Create Stripe Payment Link ───────────────
async function createStripePaymentLink(secretKey, product) {
  const auth = Buffer.from(`${secretKey}:`).toString('base64');

  // Create product
  const prodRes = await fetch('https://api.stripe.com/v1/products', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      name: product.title,
      description: product.description,
      'metadata[sku]': product.sku
    })
  });
  if (!prodRes.ok) throw new Error(`Product creation failed: ${(await prodRes.json()).error?.message}`);
  const stripeProd = await prodRes.json();

  // Create price
  const priceRes = await fetch('https://api.stripe.com/v1/prices', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      product: stripeProd.id,
      unit_amount: String(product.price * 100),
      currency: 'nzd'
    })
  });
  if (!priceRes.ok) throw new Error(`Price creation failed: ${(await priceRes.json()).error?.message}`);
  const stripePrice = await priceRes.json();

  // Create payment link
  const linkRes = await fetch('https://api.stripe.com/v1/payment_links', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'line_items[0][price]': stripePrice.id,
      'line_items[0][adjustable_quantity][enabled]': 'true',
      'line_items[0][adjustable_quantity][minimum]': '1',
      'line_items[0][adjustable_quantity][maximum]': '5',
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': `${process.env.SITE_URL || 'https://allifisher826-coder.github.io/d-i-a-storefront'}/order-confirmation.html`,
      'shipping_address_collection[allowed_countries][0]': 'NZ',
      'shipping_address_collection[allowed_countries][1]': 'AU',
      'shipping_address_collection[allowed_countries][2]': 'US',
      'shipping_address_collection[allowed_countries][3]': 'GB',
      'shipping_address_collection[allowed_countries][4]': 'CA'
    })
  });
  if (!linkRes.ok) throw new Error(`Payment link failed: ${(await linkRes.json()).error?.message}`);
  const paymentLink = await linkRes.json();

  return {
    product_id: stripeProd.id,
    price_id: stripePrice.id,
    payment_link_id: paymentLink.id,
    payment_url: paymentLink.url
  };
}

// ─── Write .env ───────────────────────────────
function writeEnv(updates) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  for (const [key, val] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${val}`);
    } else {
      content += `\n${key}=${val}`;
    }
  }
  fs.writeFileSync(ENV_PATH, content);
}

// ─── Update products.json with Stripe IDs ─────
function updateProductStripeIds(sku, ids) {
  const prodPath = path.join(ROOT, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
  const idx = products.findIndex(p => p.sku === sku);
  if (idx === -1) return;
  products[idx].stripe_product_id = ids.product_id;
  products[idx].stripe_price_id = ids.price_id;
  products[idx].stripe_payment_link = ids.payment_url;
  fs.writeFileSync(prodPath, JSON.stringify(products, null, 2));
}

// ═══════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════
async function main() {
  banner();

  let envUpdates = {};

  // ─── STRIPE SECRET KEY ────────────────────
  console.log(`${C.bold}1. STRIPE${C.reset}`);
  let stripeKey = process.env.STRIPE_SECRET_KEY || '';
  const hasStripe = stripeKey && !stripeKey.includes('ENTER_') && !stripeKey.includes('REPLACE_');

  if (hasStripe) {
    console.log(`  ${C.dim}Found key: ${stripeKey.slice(0, 12)}...${stripeKey.slice(-4)}${C.reset}`);
  } else {
    console.log(`  ${C.yellow}⚠ No Stripe Secret Key found${C.reset}`);
    console.log(`  ${C.dim}Get it at: https://dashboard.stripe.com/apikeys${C.reset}\n`);
    stripeKey = await ask(`  Enter Stripe Secret Key (sk_live_...): `);
    if (stripeKey.trim()) {
      envUpdates.STRIPE_SECRET_KEY = stripeKey.trim();
    }
  }

  if (stripeKey && !stripeKey.includes('ENTER_') && !stripeKey.includes('REPLACE_')) {
    process.stdout.write(`  Testing Stripe connection... `);
    const result = await testStripe(stripeKey);
    if (result.ok) {
      console.log(`${C.green}✓ Connected${C.reset} [${result.mode}] Balance: ${result.balance}`);
    } else {
      console.log(`${C.red}✗ Failed: ${result.error}${C.reset}`);
    }
  }

  // ─── PRINTFUL TOKEN ────────────────────────
  console.log(`\n${C.bold}2. PRINTFUL${C.reset}`);
  let printfulToken = process.env.PRINTFUL_API_TOKEN || '';
  const hasPrintful = printfulToken && !printfulToken.includes('YOUR_');

  if (hasPrintful) {
    console.log(`  ${C.dim}Found token: ${printfulToken.slice(0, 10)}...${printfulToken.slice(-4)}${C.reset}`);
  } else {
    console.log(`  ${C.yellow}⚠ No Printful token found${C.reset}`);
    console.log(`  ${C.dim}Get it at: https://www.printful.com/dashboard/developer/api${C.reset}\n`);
    printfulToken = await ask(`  Enter Printful API Token: `);
    if (printfulToken.trim()) {
      envUpdates.PRINTFUL_API_TOKEN = printfulToken.trim();
    }
  }

  if (printfulToken && !printfulToken.includes('YOUR_')) {
    process.stdout.write(`  Testing Printful connection... `);
    const result = await testPrintful(printfulToken);
    if (result.ok) {
      console.log(`${C.green}✓ Connected${C.reset} — Store: "${result.store}" (ID: ${result.id})`);

      // List existing products
      const products = await listPrintfulProducts(printfulToken);
      if (products.length > 0) {
        console.log(`  ${C.dim}Products in Printful:${C.reset}`);
        products.forEach(p => console.log(`    • ${p.name} (${p.variants} variants)`));
      } else {
        console.log(`  ${C.yellow}No products in Printful yet${C.reset} — you'll need to add them in the Printful dashboard`);
      }
    } else {
      console.log(`${C.red}✗ Failed: ${result.error}${C.reset}`);
    }
  }

  // ─── Save any updated keys ─────────────────
  if (Object.keys(envUpdates).length > 0) {
    writeEnv(envUpdates);
    console.log(`\n  ${C.green}✓ Keys saved to .env${C.reset}`);
    // Reload
    config({ path: ENV_PATH, override: true });
  }

  // ─── STRIPE PRODUCTS + PAYMENT LINKS ───────
  const canStripe = stripeKey && !stripeKey.includes('ENTER_') && !stripeKey.includes('REPLACE_');
  if (canStripe) {
    console.log(`\n${C.bold}3. STRIPE PRODUCTS & PAYMENT LINKS${C.reset}`);

    const existingProducts = await listStripeProducts(stripeKey);
    const prodPath = path.join(ROOT, 'data', 'products.json');
    const localProducts = JSON.parse(fs.readFileSync(prodPath, 'utf8'));

    for (const product of localProducts) {
      const existing = existingProducts.find(p => p.metadata?.sku === product.sku);
      if (existing || product.stripe_payment_link) {
        console.log(`  ${C.green}✓${C.reset} ${product.sku} — already in Stripe${product.stripe_payment_link ? ` (${product.stripe_payment_link})` : ''}`);
        continue;
      }

      const answer = await ask(`  Create Stripe product + payment link for ${C.bold}${product.title}${C.reset} ($${product.price})? [y/N] `);
      if (answer.toLowerCase() !== 'y') continue;

      try {
        process.stdout.write(`    Creating... `);
        const ids = await createStripePaymentLink(stripeKey, product);
        console.log(`${C.green}✓${C.reset}`);
        console.log(`    Product: ${ids.product_id}`);
        console.log(`    Price:   ${ids.price_id}`);
        console.log(`    ${C.bold}Payment Link: ${C.cyan}${ids.payment_url}${C.reset}`);
        updateProductStripeIds(product.sku, ids);
      } catch (e) {
        console.log(`${C.red}✗ ${e.message}${C.reset}`);
      }
    }
  }

  // ─── SUMMARY ───────────────────────────────
  console.log(`\n${C.red}${C.bold}  ═══════════════════════════════════════${C.reset}`);
  console.log(`${C.bold}  STATUS SUMMARY${C.reset}`);
  console.log(`${C.red}${C.bold}  ═══════════════════════════════════════${C.reset}\n`);

  const finalProducts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8'));
  const hasPaymentLinks = finalProducts.some(p => p.stripe_payment_link);

  console.log(`  Stripe Secret Key:     ${canStripe ? `${C.green}✓ Set${C.reset}` : `${C.red}✗ Missing${C.reset}`}`);
  console.log(`  Printful Token:        ${hasPrintful ? `${C.green}✓ Set${C.reset}` : `${C.red}✗ Missing${C.reset}`}`);
  console.log(`  Stripe Payment Links:  ${hasPaymentLinks ? `${C.green}✓ Created${C.reset}` : `${C.yellow}⚠ Run setup again after adding Stripe key${C.reset}`}`);

  if (hasPaymentLinks) {
    console.log(`\n  ${C.bold}Payment links ready! Run:${C.reset}`);
    console.log(`  ${C.cyan}npm run apply-links${C.reset}  — inject payment links into the store`);
    console.log(`  ${C.cyan}git add -A && git commit -m "Add payment links" && git push${C.reset}`);
  }

  console.log(`\n  ${C.bold}Printful Setup:${C.reset}`);
  console.log(`  ${C.dim}1. Go to printful.com → Add Store → Manual/API${C.reset}`);
  console.log(`  ${C.dim}2. Add products in Printful dashboard${C.reset}`);
  console.log(`  ${C.dim}3. Upload your design files (front/back)${C.reset}`);
  console.log(`  ${C.dim}4. Set pricing & shipping${C.reset}`);
  console.log(`  ${C.dim}5. Run: npm run sync-printful${C.reset}\n`);

  rl.close();
}

main().catch(e => { console.error(`\n${C.red}Error: ${e.message}${C.reset}\n`); rl.close(); process.exit(1); });
