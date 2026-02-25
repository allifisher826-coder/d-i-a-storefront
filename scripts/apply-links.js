#!/usr/bin/env node

/**
 * D.I.A. — Apply Stripe Payment Links to Store
 * Reads payment links from products.json and injects into index.html checkout flow
 *
 * Usage: npm run apply-links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const C = {
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m'
};

function main() {
  console.log(`\n${C.red}${C.bold}  D.I.A. — Apply Payment Links${C.reset}\n`);

  const prodPath = path.join(ROOT, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(prodPath, 'utf8'));

  // Build payment links map
  const links = {};
  let count = 0;
  for (const p of products) {
    if (p.stripe_payment_link) {
      links[p.sku] = p.stripe_payment_link;
      console.log(`  ${C.green}✓${C.reset} ${p.sku} → ${C.cyan}${p.stripe_payment_link}${C.reset}`);
      count++;
    } else {
      console.log(`  ${C.yellow}⚠${C.reset} ${p.sku} — no payment link (run ${C.cyan}npm run setup${C.reset})`);
    }
  }

  if (count === 0) {
    console.log(`\n  ${C.yellow}No payment links found. Run ${C.cyan}npm run setup${C.yellow} first.${C.reset}\n`);
    return;
  }

  // Read index.html and inject payment links into PRODUCTS array
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Add stripe_payment_link to each product in the JS PRODUCTS array
  for (const p of products) {
    if (!p.stripe_payment_link) continue;

    // Find the product entry in the PRODUCTS array by sku and add payment_link property
    const skuRegex = new RegExp(`(sku:'${p.sku}'[^}]*?)( })`);
    if (skuRegex.test(html)) {
      // Remove old payment_link if exists
      html = html.replace(new RegExp(`\\s*,?\\s*payment_link:'[^']*'`, 'g'), '');
      // Add new one
      html = html.replace(skuRegex, `$1, payment_link:'${p.stripe_payment_link}'$2`);
    }
  }

  // Update checkout function to use payment links when available
  if (!html.includes('// STRIPE PAYMENT LINK CHECKOUT')) {
    const oldCheckout = `function checkout() {
  const items = Object.values(cart);
  if (!items.length) return;`;
    const newCheckout = `function checkout() {
  const items = Object.values(cart);
  if (!items.length) return;

  // STRIPE PAYMENT LINK CHECKOUT — redirect to Stripe if single product with payment link
  if (items.length === 1) {
    const p = PRODUCTS.find(x => x.id === items[0].id);
    if (p && p.payment_link) {
      window.location.href = p.payment_link;
      return;
    }
  }`;

    if (html.includes(oldCheckout)) {
      html = html.replace(oldCheckout, newCheckout);
      console.log(`\n  ${C.green}✓${C.reset} Injected Stripe checkout redirect into index.html`);
    }
  }

  fs.writeFileSync(indexPath, html);
  console.log(`  ${C.green}✓${C.reset} index.html updated\n`);
  console.log(`  ${C.bold}Next:${C.reset} ${C.cyan}git add -A && git commit -m "Add Stripe payment links" && git push${C.reset}\n`);
}

main();
