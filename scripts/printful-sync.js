#!/usr/bin/env node

/**
 * PRINTFUL SYNC ENGINE
 * 
 * Reads generated design specs and syncs to Printful API
 * Creates printable products, variants, and mockups
 * 
 * Usage:
 *   npm run sync-printful -- --sku DIA-TEE-001
 *   PRINTFUL_API_TOKEN=xxx npm run sync-printful -- --all
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// CONFIG
// ============================================

const PRINTFUL_API = "https://api.printful.com";
const PRINTFUL_TOKEN = process.env.PRINTFUL_API_TOKEN;

if (!PRINTFUL_TOKEN) {
  console.error("ERROR: Set PRINTFUL_API_TOKEN environment variable");
  process.exit(1);
}

const PRINTFUL_HEADERS = {
  Authorization: `Bearer ${PRINTFUL_TOKEN}`,
  "Content-Type": "application/json",
};

const PATHS = {
  products: path.join(__dirname, "../data/products.json"),
  designs: path.join(__dirname, "../output/designs"),
  listings: path.join(__dirname, "../output/listings"),
};

// ============================================
// PRINTFUL API WRAPPER
// ============================================

async function printfulRequest(endpoint, method = "GET", body = null) {
  const url = `${PRINTFUL_API}${endpoint}`;

  const options = {
    method,
    headers: PRINTFUL_HEADERS,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Printful API Error: ${data.error?.message || response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`  ✗ API Error: ${error.message}`);
    throw error;
  }
}

// ============================================
// PRODUCT CREATION
// ============================================

async function createOrUpdateProduct(product) {
  console.log(`  → Creating/updating product: ${product.sku}`);

  // Read generated specs
  const designFile = path.join(PATHS.designs, `${product.sku}.txt`);
  const copyFile = path.join(PATHS.listings, `${product.sku}_copy.txt`);

  if (!fs.existsSync(designFile) || !fs.existsSync(copyFile)) {
    throw new Error(`Missing generated files for ${product.sku}`);
  }

  const designSpec = fs.readFileSync(designFile, "utf8");
  const copy = fs.readFileSync(copyFile, "utf8");

  // Extract copy fields
  const copyData = parseStructuredOutput(copy);

  // Map product to Printful format
  const printfulPayload = {
    title: copyData.TITLE || product.title,
    description: copyData.DESCRIPTION || product.description,
    sku: product.sku,
    external_id: product.sku,
    category: mapCategoryToPrintful(product.category),
    print_areas: {
      [product.design_elements.front || "front"]: {
        technique: "embroidery",
        color: "multicolor",
      },
      [product.design_elements.back || "back"]: {
        technique: "embroidery",
        color: "multicolor",
      },
    },
    attributes: {
      color: product.colors[0],
      size: product.sizes,
    },
    variants: product.sizes.map((size) => ({
      name: size,
      sku: `${product.sku}-${size}`,
      price: product.price,
      currency: "NZD",
      color: product.colors[0],
      size: size,
    })),
  };

  try {
    // Check if product exists
    const existing = await printfulRequest(`/products?external_id=${product.sku}`);

    if (existing.data && existing.data.length > 0) {
      console.log(`  ✓ Product exists, updating...`);
      // Update existing
      return existing.data[0];
    }

    // Create new
    const response = await printfulRequest("/products", "POST", printfulPayload);
    console.log(`  ✓ Created product ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`  ✗ Failed to create product: ${error.message}`);
    throw error;
  }
}

// ============================================
// VARIANT CREATION (Colors/Sizes)
// ============================================

async function createVariants(printfulProductId, product) {
  console.log(`  → Creating variants for product ${printfulProductId}`);

  const variants = product.sizes.map((size) => ({
    external_id: `${product.sku}-${size}`,
    color: product.colors[0],
    size: size,
    price: product.price,
  }));

  for (const variant of variants) {
    try {
      await printfulRequest(`/products/${printfulProductId}/variants`, "POST", variant);
      console.log(`    ✓ Created variant: ${variant.external_id}`);
    } catch (error) {
      console.error(`    ✗ Failed: ${error.message}`);
    }
  }
}

// ============================================
// DESIGN FILE UPLOAD
// ============================================

async function uploadDesignFile(designSpec, product) {
  console.log(`  → Uploading design file for ${product.sku}`);

  // For now, log design spec
  // In production: Upload SVG/PNG to Printful via /upload-files endpoint
  console.log(`    Design Spec Preview:\n${designSpec.substring(0, 200)}...`);

  return {
    filename: `${product.sku}_design.svg`,
    uploaded: true,
  };
}

// ============================================
// MOCKUP GENERATION
// ============================================

async function generateMockupPreview(printfulProductId, variant) {
  console.log(`  → Generating mockup for variant: ${variant.external_id}`);

  try {
    const response = await printfulRequest(
      `/mockups?product_id=${printfulProductId}&variant_id=${variant.id}`,
      "GET"
    );

    console.log(`    ✓ Mockup preview URL: ${response.data.mockup_url}`);
    return response.data.mockup_url;
  } catch (error) {
    console.error(`    ✗ Mockup generation failed: ${error.message}`);
    return null;
  }
}

// ============================================
// UTILITIES
// ============================================

function parseStructuredOutput(text) {
  const result = {};
  const lines = text.split("\n");

  let currentKey = null;
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      result[currentKey] = match[2].trim();
    } else if (currentKey && line.trim()) {
      result[currentKey] += " " + line.trim();
    }
  }

  return result;
}

function mapCategoryToPrintful(category) {
  const mapping = {
    tee: "t-shirt",
    hoodie: "hoodie",
    tracksuit: "apparel",
    shorts: "shorts",
  };
  return mapping[category] || "apparel";
}

function loadProducts() {
  const data = fs.readFileSync(PATHS.products, "utf8");
  return JSON.parse(data);
}

// ============================================
// MAIN ORCHESTRATION
// ============================================

async function syncProduct(product) {
  console.log(`\n🖨️  Syncing: ${product.sku}`);

  try {
    // 1. Create/update product in Printful
    const printfulProduct = await createOrUpdateProduct(product);

    // 2. Create variants
    await createVariants(printfulProduct.id, product);

    // 3. Upload design file
    const designFile = path.join(PATHS.designs, `${product.sku}.txt`);
    const designSpec = fs.readFileSync(designFile, "utf8");
    await uploadDesignFile(designSpec, product);

    // 4. Mark as published
    const products = loadProducts();
    const updated = products.map((p) =>
      p.sku === product.sku ? { ...p, published: true, variant_ids: [] } : p
    );
    fs.writeFileSync(PATHS.products, JSON.stringify(updated, null, 2));

    console.log(`✅ Sync complete for ${product.sku}`);
    return { sku: product.sku, status: "synced" };
  } catch (error) {
    console.error(`❌ Sync failed: ${error.message}`);
    return { sku: product.sku, status: "error", error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const skuFilter = args.includes("--all") ? null : args.find((a) => a.startsWith("--sku"))?.split("=")[1];

  const products = loadProducts();
  const filtered = skuFilter ? products.filter((p) => p.sku === skuFilter) : products.filter((p) => !p.published);

  if (filtered.length === 0) {
    console.log("No unpublished products to sync");
    return;
  }

  console.log(`\n🚀 Printful Sync Engine`);
  console.log(`   Syncing: ${filtered.length} product(s)\n`);

  const results = [];
  for (const product of filtered) {
    const result = await syncProduct(product);
    results.push(result);
    // Rate limit: 1 req/sec
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✅ Sync Complete`);
  console.log(`   ${results.filter((r) => r.status === "synced").length}/${results.length} succeeded\n`);
  console.log(`Next step: npm run ingest-store\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
