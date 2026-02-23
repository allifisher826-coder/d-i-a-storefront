#!/usr/bin/env node

/**
 * D.I.A. POD ORCHESTRATION ENGINE
 * 
 * Flow: Product Data → AI Generation → Printful Sync → Store Ingestion
 * 
 * Usage:
 *   npm run generate -- --sku DIA-TEE-001
 *   npm run generate -- --all
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// CONFIG
// ============================================

const PATHS = {
  products: path.join(__dirname, "../data/products.json"),
  prompts: {
    design: path.join(__dirname, "../prompts/pod_design.txt"),
    copy: path.join(__dirname, "../prompts/product_copy.txt"),
    mockup: path.join(__dirname, "../prompts/mockup_scene.txt"),
  },
  output: {
    designs: path.join(__dirname, "../output/designs"),
    mockups: path.join(__dirname, "../output/mockups"),
    listings: path.join(__dirname, "../output/listings"),
  },
};

// ============================================
// LOAD DATA
// ============================================

function loadProducts() {
  const data = fs.readFileSync(PATHS.products, "utf8");
  return JSON.parse(data);
}

function loadPrompt(name) {
  return fs.readFileSync(PATHS.prompts[name], "utf8");
}

function ensureOutputDirs() {
  Object.values(PATHS.output).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// ============================================
// AI GENERATION
// ============================================

async function generateDesignSpec(product) {
  const prompt = loadPrompt("design");

  const filled = prompt
    .replace("{{PRODUCT_JSON}}", JSON.stringify(product, null, 2))
    .replace("{{MAX_COLORS}}", product.max_colors)
    .replace("{{PLACEMENT}}", Object.keys(product.design_elements).join(", "));

  console.log(`  ► Generating design spec for ${product.sku}...`);

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: filled }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
}

async function generateProductCopy(product) {
  const prompt = loadPrompt("copy");

  const filled = prompt
    .replace("{{PRODUCT_JSON}}", JSON.stringify(product, null, 2))
    .replace("{{TITLE}}", product.title)
    .replace("{{TARGET_AUDIENCE}}", product.target_audience)
    .replace("{{PRIMARY_BENEFIT}}", product.design_prompt);

  console.log(`  ► Generating copy for ${product.sku}...`);

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: filled }],
    temperature: 0.6,
    max_tokens: 800,
  });

  return response.choices[0].message.content;
}

async function generateMockupScene(product) {
  const prompt = loadPrompt("mockup");

  const filled = prompt
    .replace("{{PRODUCT_JSON}}", JSON.stringify(product, null, 2));

  console.log(`  ► Generating mockup scene for ${product.sku}...`);

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: filled }],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}

// ============================================
// SAVE OUTPUTS
// ============================================

function saveDesignSpec(sku, spec) {
  const file = path.join(PATHS.output.designs, `${sku}.txt`);
  fs.writeFileSync(file, spec);
  console.log(`  ✓ Saved design spec: ${file}`);
}

function saveCopy(sku, copy) {
  const file = path.join(PATHS.output.listings, `${sku}_copy.txt`);
  fs.writeFileSync(file, copy);
  console.log(`  ✓ Saved copy: ${file}`);
}

function saveMockupScene(sku, scene) {
  const file = path.join(PATHS.output.mockups, `${sku}_scene.txt`);
  fs.writeFileSync(file, scene);
  console.log(`  ✓ Saved mockup scene: ${file}`);
}

// ============================================
// ORCHESTRATION
// ============================================

async function processProduct(product) {
  console.log(`\n📦 Processing: ${product.sku}`);

  try {
    // Generate all assets in parallel
    const [designSpec, copy, mockupScene] = await Promise.all([
      generateDesignSpec(product),
      generateProductCopy(product),
      generateMockupScene(product),
    ]);

    // Save all outputs
    saveDesignSpec(product.sku, designSpec);
    saveCopy(product.sku, copy);
    saveMockupScene(product.sku, mockupScene);

    return {
      sku: product.sku,
      status: "success",
      designSpec,
      copy,
      mockupScene,
    };
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    return {
      sku: product.sku,
      status: "error",
      error: error.message,
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const skuFilter = args.includes("--all") ? null : args.find((a) => a.startsWith("--sku"))?.split("=")[1];

  ensureOutputDirs();

  const products = loadProducts();
  const filtered = skuFilter ? products.filter((p) => p.sku === skuFilter) : products;

  if (filtered.length === 0) {
    console.error("No products found matching filter");
    process.exit(1);
  }

  console.log(`\n🚀 D.I.A. POD Orchestration Engine`);
  console.log(`   Processing: ${filtered.length} product(s)\n`);

  const results = [];
  for (const product of filtered) {
    const result = await processProduct(product);
    results.push(result);
  }

  // Summary
  console.log(`\n✅ Generation Complete`);
  const success = results.filter((r) => r.status === "success").length;
  console.log(`   ${success}/${results.length} products processed successfully\n`);

  // Output summary
  console.log("📂 Outputs generated:");
  console.log(`   Designs:  ${PATHS.output.designs}`);
  console.log(`   Mockups:  ${PATHS.output.mockups}`);
  console.log(`   Listings: ${PATHS.output.listings}\n`);

  console.log("Next step: npm run sync-printful\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
