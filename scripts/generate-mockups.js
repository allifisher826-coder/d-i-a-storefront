#!/usr/bin/env node

/**
 * Printful Mockup Generator Integration
 * Automatically generates product mockups from design files
 * 
 * Usage: node scripts/generate-mockups.js --sku DIA-SYSTEM-000
 * 
 * Process:
 * 1. Get product/variant info from Printful catalog
 * 2. Get print file specs for the product
 * 3. Upload design files
 * 4. Create mockup generation task
 * 5. Poll for completion
 * 6. Download and store mockup images
 * 7. Update product catalog with mockup URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRINTFUL_API_TOKEN = process.env.PRINTFUL_API_TOKEN;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID || '0';

if (!PRINTFUL_API_TOKEN) {
  console.error('❌ Missing PRINTFUL_API_TOKEN environment variable');
  process.exit(1);
}

const args = process.argv.slice(2);
const skuIndex = args.indexOf('--sku');
if (skuIndex === -1) {
  console.error('❌ Usage: node scripts/generate-mockups.js --sku DIA-SYSTEM-000');
  process.exit(1);
}
const sku = args[skuIndex + 1];

// Printful product type mapping (product IDs)
const PRODUCT_ID_MAP = {
  'tee': 1,           // Bella+Canvas 3001
  'hoodie': 2,        // Champion
  'tracksuit': 3,     // Custom
  'polo': 4,
  'long-sleeve': 5,
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function printfulRequest(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_TOKEN}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
    },
  };

  if (body) opts.body = JSON.stringify(body);

  const response = await fetch(`https://api.printful.com${endpoint}`, opts);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function getProduct(sku) {
  const productsPath = path.join(__dirname, '../data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  return products.find(p => p.sku === sku);
}

async function getPrintFileSpecs(productId) {
  console.log(`📋 Getting print file specs for product ${productId}...`);
  const result = await printfulRequest(`/mockup-generator/printfiles/${productId}`);
  return result.result;
}

async function createMockupTask(productId, variantIds, files) {
  console.log(`📷 Creating mockup generation task...`);
  
  const taskBody = {
    variant_ids: variantIds,
    format: 'png',
    width: 1200,
    product_options: {
      lifelike: true,
    },
    files: files,
  };

  const result = await printfulRequest(`/mockup-generator/create-task/${productId}`, 'POST', taskBody);
  return result.result;
}

async function pollMockupTask(taskKey) {
  console.log(`⏳ Waiting for mockup generation (task: ${taskKey})...`);
  
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes

  while (attempts < maxAttempts) {
    await sleep(2000); // Wait 2 seconds between polls
    attempts++;

    const result = await printfulRequest(`/mockup-generator/task?task_key=${taskKey}`);

    if (result.result.status === 'completed') {
      console.log(`✓ Mockup generation completed`);
      return result.result.mockups;
    }

    if (result.result.status === 'error') {
      throw new Error(`Mockup generation failed: ${result.result.error}`);
    }

    if (attempts % 6 === 0) {
      console.log(`  ⏳ Still processing... (${attempts * 2}s elapsed)`);
    }
  }

  throw new Error('Mockup generation timed out');
}

async function downloadMockup(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download mockup: ${response.statusText}`);
  
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(arrayBuffer));
  return filename;
}

async function storeMockups(sku, mockups) {
  console.log(`💾 Storing mockup images...`);
  
  const mockupsDir = path.join(__dirname, '../public/mockups', sku);
  if (!fs.existsSync(mockupsDir)) {
    fs.mkdirSync(mockupsDir, { recursive: true });
  }

  const storedMockups = {};

  for (const mockup of mockups) {
    const placement = mockup.placement;
    const filename = path.join(mockupsDir, `${placement}.png`);
    
    await downloadMockup(mockup.mockup_url, filename);
    storedMockups[placement] = `/mockups/${sku}/${placement}.png`;
    
    console.log(`  ✓ Stored ${placement} mockup`);
  }

  return storedMockups;
}

async function updateProductWithMockups(sku, mockupUrls) {
  console.log(`📝 Updating product catalog...`);
  
  const productsPath = path.join(__dirname, '../data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const productIdx = products.findIndex(p => p.sku === sku);
  if (productIdx === -1) throw new Error(`Product ${sku} not found`);

  products[productIdx].mockup_urls = mockupUrls;
  products[productIdx].mockups_generated_at = new Date().toISOString();

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log(`  ✓ Updated products.json`);
}

async function main() {
  try {
    console.log(`\n🎨 Generating Mockups: ${sku}\n`);

    // 1. Get product
    const product = await getProduct(sku);
    if (!product) throw new Error(`Product ${sku} not found`);
    console.log(`✓ Found product: ${product.title}`);

    // 2. Get Printful product ID
    const productId = PRODUCT_ID_MAP[product.category];
    if (!productId) throw new Error(`Unsupported category: ${product.category}`);
    console.log(`✓ Product type: ${product.category} (ID: ${productId})`);

    // 3. Get print file specs
    const printFileInfo = await getPrintFileSpecs(productId);
    console.log(`✓ Print file specs retrieved`);
    console.log(`  - Placements: ${Object.keys(printFileInfo.available_placements).join(', ')}`);

    // 4. Prepare design files
    // For now, we'll create placeholder URLs - in production these would be your actual design files
    const files = [];
    
    if (printFileInfo.available_placements.front) {
      files.push({
        placement: 'front',
        image_url: `https://doitanyways.netlify.app/designs/${sku}-front.png`,
      });
    }

    if (printFileInfo.available_placements.back) {
      files.push({
        placement: 'back',
        image_url: `https://doitanyways.netlify.app/designs/${sku}-back.png`,
      });
    }

    if (files.length === 0) {
      throw new Error('No supported placements found');
    }

    console.log(`✓ Design files ready: ${files.map(f => f.placement).join(', ')}`);

    // 5. Create mockup generation task
    const variantIds = []; // Would be populated with actual variant IDs from Printful
    // For MVP, we'll use a sample variant
    const task = await createMockupTask(productId, [1], files);
    
    if (task.status === 'error') {
      throw new Error(`Task creation failed: ${task.error}`);
    }

    console.log(`✓ Task created: ${task.task_key}`);

    // 6. Poll for completion
    const mockups = await pollMockupTask(task.task_key);
    console.log(`✓ Received ${mockups.length} mockup(s)`);

    // 7. Store mockups
    const storedUrls = await storeMockups(sku, mockups);

    // 8. Update product
    await updateProductWithMockups(sku, storedUrls);

    console.log(`\n✅ Mockup Generation Complete!\n`);
    console.log(`Product: ${product.title}`);
    console.log(`SKU: ${sku}`);
    console.log(`Mockups: ${Object.keys(storedUrls).join(', ')}`);
    console.log(`Locations:`);
    Object.entries(storedUrls).forEach(([placement, url]) => {
      console.log(`  - ${placement}: ${url}`);
    });
    console.log();

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
