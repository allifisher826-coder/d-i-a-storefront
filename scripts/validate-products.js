#!/usr/bin/env node

/**
 * VALIDATION GATE
 * 
 * Prevents broken products from going live
 * Runs before every deploy
 * 
 * Usage:
 *   npm run validate
 *   npm run validate -- --strict
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
  products: path.join(__dirname, "../data/products.json"),
  designs: path.join(__dirname, "../output/designs"),
  listings: path.join(__dirname, "../output/listings"),
  mockups: path.join(__dirname, "../output/mockups"),
  index: path.join(__dirname, "../index.html"),
};

// ============================================
// VALIDATORS
// ============================================

const VALIDATORS = {
  productData: (product) => {
    const required = ["sku", "title", "price", "cost", "description", "category"];
    const missing = required.filter((f) => !product[f]);

    if (missing.length > 0) {
      return { valid: false, error: `Missing fields: ${missing.join(", ")}` };
    }

    if (product.price <= product.cost) {
      return { valid: false, error: `Price (${product.price}) must exceed cost (${product.cost})` };
    }

    if (product.price < 50 || product.price > 500) {
      return { valid: false, error: `Price out of reasonable range: $${product.price}` };
    }

    const margin = ((product.price - product.cost) / product.price) * 100;
    if (margin < 40) {
      return {
        valid: false,
        error: `Margin too low (${margin.toFixed(1)}%). Min 40%.`,
      };
    }

    return { valid: true };
  },

  designFile: (sku) => {
    const file = path.join(PATHS.designs, `${sku}.txt`);
    if (!fs.existsSync(file)) {
      return { valid: false, error: `Design file missing: ${file}` };
    }

    const content = fs.readFileSync(file, "utf8");
    if (content.length < 100) {
      return { valid: false, error: `Design file too small (<100 chars)` };
    }

    // Check for required sections
    const required = ["DESIGN_NAME", "COLORS", "PLACEMENT"];
    const missing = required.filter((s) => !content.includes(s));
    if (missing.length > 0) {
      return { valid: false, error: `Missing design sections: ${missing.join(", ")}` };
    }

    return { valid: true };
  },

  copyFile: (sku) => {
    const file = path.join(PATHS.listings, `${sku}_copy.txt`);
    if (!fs.existsSync(file)) {
      return { valid: false, error: `Copy file missing: ${file}` };
    }

    const content = fs.readFileSync(file, "utf8");
    if (content.length < 150) {
      return { valid: false, error: `Copy too short (<150 chars)` };
    }

    // Check for required sections
    const required = ["TITLE", "DESCRIPTION", "BENEFITS"];
    const missing = required.filter((s) => !content.includes(s));
    if (missing.length > 0) {
      return { valid: false, error: `Missing copy sections: ${missing.join(", ")}` };
    }

    return { valid: true };
  },

  mockupFile: (sku) => {
    const file = path.join(PATHS.mockups, `${sku}_scene.txt`);
    if (!fs.existsSync(file)) {
      return { valid: false, error: `Mockup scene file missing: ${file}` };
    }

    const content = fs.readFileSync(file, "utf8");
    if (content.length < 100) {
      return { valid: false, error: `Mockup scene too short` };
    }

    return { valid: true };
  },

  htmlIntegrity: () => {
    const html = fs.readFileSync(PATHS.index, "utf8");

    // Check for required elements
    const required = [
      { tag: "body", count: 1 },
      { tag: "nav", count: 1 },
      { tag: "product-grid", count: 1 },
      { tag: "cart-modal", count: 1 },
    ];

    for (const item of required) {
      const pattern = new RegExp(`<${item.tag.replace("-", "[^>]*")}[^>]*>`, "gi");
      const matches = html.match(pattern) || [];
      if (matches.length < item.count) {
        return { valid: false, error: `HTML missing or broken: <${item.tag}>` };
      }
    }

    // Check for demo/test language
    const demoPatterns = [/demo\s+mode/i, /test\s+card/i, /fake\s+product/i];
    for (const pattern of demoPatterns) {
      if (pattern.test(html)) {
        return { valid: false, error: `Production blocker: Found demo/test language in HTML` };
      }
    }

    return { valid: true };
  },
};

// ============================================
// PRODUCT VALIDATION
// ============================================

function validateProduct(product, strict = false) {
  console.log(`  → Validating: ${product.sku}`);

  const errors = [];

  // Product data validation
  const dataCheck = VALIDATORS.productData(product);
  if (!dataCheck.valid) {
    errors.push(`Data: ${dataCheck.error}`);
  }

  // Only validate generated files if published
  if (product.published || strict) {
    const designCheck = VALIDATORS.designFile(product.sku);
    if (!designCheck.valid) {
      errors.push(`Design: ${designCheck.error}`);
    }

    const copyCheck = VALIDATORS.copyFile(product.sku);
    if (!copyCheck.valid) {
      errors.push(`Copy: ${copyCheck.error}`);
    }

    const mockupCheck = VALIDATORS.mockupFile(product.sku);
    if (!mockupCheck.valid) {
      errors.push(`Mockup: ${mockupCheck.error}`);
    }
  }

  if (errors.length > 0) {
    console.log(`    ✗ Failed:`);
    errors.forEach((e) => console.log(`       - ${e}`));
    return false;
  }

  console.log(`    ✓ Valid`);
  return true;
}

// ============================================
// MAIN
// ============================================

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");

  const products = JSON.parse(fs.readFileSync(PATHS.products, "utf8"));

  console.log(`\n✓ Validation Gate`);
  console.log(`   Checking: ${products.length} product(s)\n`);

  let valid = 0;
  let invalid = 0;

  for (const product of products) {
    if (validateProduct(product, strict)) {
      valid++;
    } else {
      invalid++;
    }
  }

  // HTML integrity check
  console.log(`\n  → Checking HTML integrity...`);
  const htmlCheck = VALIDATORS.htmlIntegrity();
  if (!htmlCheck.valid) {
    console.log(`    ✗ ${htmlCheck.error}`);
    invalid++;
  } else {
    console.log(`    ✓ HTML valid`);
    valid++;
  }

  // Summary
  console.log(`\n📋 Validation Summary`);
  console.log(`   ✓ Passed: ${valid}`);
  console.log(`   ✗ Failed: ${invalid}\n`);

  if (invalid > 0) {
    console.log(`🛑 Validation FAILED. Fix errors before deploying.\n`);
    process.exit(1);
  }

  console.log(`✅ All checks passed. Safe to deploy.\n`);
  process.exit(0);
}

main();
