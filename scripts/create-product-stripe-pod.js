#!/usr/bin/env node

/**
 * Create Stripe Product + POD (Printful) Setup for Single Product
 * Usage: node scripts/create-product-stripe-pod.js --sku DIA-SYSTEM-000
 * 
 * This script:
 * 1. Reads product from data/products.json
 * 2. Creates Stripe Product and Price
 * 3. Creates Printful Product with variants
 * 4. Updates products.json with IDs
 * 5. Publishes to store HTML
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config(); // Load .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRIPE_API_KEY = process.env.STRIPE_API_KEY || process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLIC_KEY;
const PRINTFUL_API_TOKEN = process.env.PRINTFUL_API_TOKEN;

if (!STRIPE_API_KEY || !PRINTFUL_API_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   - STRIPE_API_KEY');
  console.error('   - PRINTFUL_API_TOKEN');
  process.exit(1);
}

const args = process.argv.slice(2);
const skuIndex = args.indexOf('--sku');
if (skuIndex === -1) {
  console.error('❌ Usage: node scripts/create-product-stripe-pod.js --sku DIA-SYSTEM-000');
  process.exit(1);
}
const sku = args[skuIndex + 1];

async function getProduct(sku) {
  const productsPath = path.join(__dirname, '../data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  return products.find(p => p.sku === sku);
}

async function createStripeProduct(product) {
  console.log(`💳 Creating Stripe Product: ${product.sku}`);
  
  const stripeAuth = Buffer.from(`${STRIPE_API_KEY}:`).toString('base64');
  
  // Create product
  const productRes = await fetch('https://api.stripe.com/v1/products', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${stripeAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      name: product.title,
      description: product.description,
      'metadata[sku]': product.sku,
      'metadata[category]': product.category,
      'metadata[cost]': product.cost,
    }).toString(),
  });

  if (!productRes.ok) {
    const error = await productRes.json();
    throw new Error(`Stripe product creation failed: ${JSON.stringify(error)}`);
  }

  const stripeProduct = await productRes.json();
  console.log(`  ✓ Stripe Product ID: ${stripeProduct.id}`);

  // Create price
  const priceRes = await fetch('https://api.stripe.com/v1/prices', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${stripeAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      product: stripeProduct.id,
      unit_amount: product.price * 100,
      currency: 'nzd',
      'metadata[margin]': (product.price - product.cost),
    }).toString(),
  });

  if (!priceRes.ok) {
    const error = await priceRes.json();
    throw new Error(`Stripe price creation failed: ${JSON.stringify(error)}`);
  }

  const stripePrice = await priceRes.json();
  console.log(`  ✓ Stripe Price ID: ${stripePrice.id}`);

  return {
    product_id: stripeProduct.id,
    price_id: stripePrice.id,
  };
}

async function createPrintfulProduct(product) {
  console.log(`🖨️  Creating Printful Product: ${product.sku}`);

  // Determine Printful product type based on category
  const printfulTypeMap = {
    'tee': 1,
    'hoodie': 2,
    'tracksuit': 3,
    'polo': 4,
    'long-sleeve': 5,
  };

  const printfulType = printfulTypeMap[product.category] || 1; // Default to tee

  const productPayload = {
    sync_product: {
      external_id: product.sku,
      name: product.title,
      variants: product.sizes.map((size, idx) => ({
        external_id: `${product.sku}-${size}`,
        sync_variant_id: null,
        name: size,
        sku: `${product.sku}-${size}`,
        price: product.price.toFixed(2),
        product_template_id: printfulType,
        files: [
          {
            type: 'embroidery_front',
            url: `https://allifisher826-coder.github.io/d-i-a-storefront/public/images/${product.sku}-front-embroidery.png`,
          },
          {
            type: 'embroidery_back',
            url: `https://allifisher826-coder.github.io/d-i-a-storefront/public/images/${product.sku}-back-embroidery.png`,
          },
        ],
        options: [
          { id: 'size', value: size },
          { id: 'color', value: product.colors[0] || 'black' },
        ],
      })),
    },
  };

  const response = await fetch('https://api.printful.com/sync/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_TOKEN}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '0',
    },
    body: JSON.stringify(productPayload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Printful Error:', error);
    throw new Error(`Printful product creation failed: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  console.log(`  ✓ Printful Product ID: ${result.result.sync_product.id}`);

  return {
    printful_product_id: result.result.sync_product.id,
  };
}

async function updateProductJSON(sku, stripeIds, printfulIds) {
  const productsPath = path.join(__dirname, '../data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  const productIdx = products.findIndex(p => p.sku === sku);
  if (productIdx === -1) throw new Error(`Product ${sku} not found`);

  products[productIdx] = {
    ...products[productIdx],
    stripe_product_id: stripeIds.product_id,
    stripe_price_id: stripeIds.price_id,
    printful_product_id: printfulIds.printful_product_id,
    published: true,
  };

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log(`✓ Updated products.json with IDs`);
}

async function publishToStore(product) {
  console.log(`📦 Publishing to store: ${product.sku}`);

  const indexPath = path.join(__dirname, '../index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Add product to store HTML if not already there
  if (!html.includes(`data-sku="${product.sku}"`)) {
    const productHTML = `
    <div class="product-card" data-sku="${product.sku}" data-price="${product.price}" data-title="${product.title}">
      <div class="product-image">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23181818' width='400' height='400'/%3E%3Ctext x='200' y='195' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.3)' text-anchor='middle'%3E${encodeURIComponent(product.title)}%3C/text%3E%3C/svg%3E" alt="${product.title}">
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <span class="category">${product.category}</span>
          <span class="price">$${product.price}</span>
        </div>
        <button class="add-to-cart" data-sku="${product.sku}" data-stripe-price="${product.stripe_price_id}">
          Buy Now
        </button>
      </div>
    </div>`;

    // Insert before closing products container
    html = html.replace(
      '</div><!-- end products -->',
      `${productHTML}\n    </div><!-- end products -->`
    );

    fs.writeFileSync(indexPath, html);
    console.log(`  ✓ Added to index.html`);
  }
}

async function main() {
  try {
    console.log(`\n🚀 Starting Product Creation: ${sku}\n`);

    // 1. Get product
    const product = await getProduct(sku);
    if (!product) throw new Error(`Product ${sku} not found in catalog`);
    console.log(`✓ Found product: ${product.title}`);

    // 2. Create Stripe Product + Price
    const stripeIds = await createStripeProduct(product);

    // 3. Create Printful Product
    const printfulIds = await createPrintfulProduct(product);

    // 4. Update products.json
    await updateProductJSON(sku, stripeIds, printfulIds);

    // 5. Publish to store
    await publishToStore(product);

    console.log(`\n✅ Product Creation Complete!\n`);
    console.log(`Product: ${product.title}`);
    console.log(`SKU: ${sku}`);
    console.log(`Price: $${product.price}`);
    console.log(`Stripe ID: ${stripeIds.product_id}`);
    console.log(`Printful ID: ${printfulIds.printful_product_id}`);
    console.log(`Status: Ready for Purchase\n`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
