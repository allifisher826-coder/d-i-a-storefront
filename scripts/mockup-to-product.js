#!/usr/bin/env node

/**
 * MOCKUP TO PRODUCT CONVERTER
 * 
 * Takes your mockup images + brief metadata
 * Generates POD-ready design specs + copy + product page
 * Syncs to Printful + publishes to store
 * 
 * Usage:
 *   npm run pod:from-mockup -- --sku DIA-TEE-001
 *   npm run pod:from-mockups:all
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MOCKUP_DIR = path.join(__dirname, "../mockups-input");
const PATHS = {
  products: path.join(__dirname, "../data/products.json"),
  designs: path.join(__dirname, "../output/designs"),
  listings: path.join(__dirname, "../output/listings"),
  prompts: {
    design: path.join(__dirname, "../prompts/pod_design.txt"),
    copy: path.join(__dirname, "../prompts/product_copy.txt"),
  },
};

// ============================================
// UTILITIES
// ============================================

function findMockupFile(sku) {
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  for (const ext of exts) {
    const file = path.join(MOCKUP_DIR, `${sku}${ext}`);
    if (fs.existsSync(file)) {
      return file;
    }
  }
  return null;
}

function findMetadataFile(sku) {
  const file = path.join(MOCKUP_DIR, `${sku}.txt`);
  return fs.existsSync(file) ? file : null;
}

function parseMetadata(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};

  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+):\s*(.*)$/);
    if (match) {
      const key = match[1].toLowerCase();
      const value = match[2].trim();
      result[key] = value;
    }
  }

  return result;
}

function getMockupFileAsBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString("base64");
}

// ============================================
// AI GENERATION FROM MOCKUP
// ============================================

async function generateDesignFromMockup(sku, mockupPath, metadata) {
  console.log(`  → Analyzing mockup for ${sku}...`);

  const base64Image = getMockupFileAsBase64(mockupPath);
  const ext = path.extname(mockupPath).toLowerCase();
  const mediaType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

  const prompt = `You are an expert apparel embroidery designer.

You are looking at a product mockup image for: ${metadata.title}

MOCKUP ANALYSIS TASK:
1. Analyze the design in the image
2. Identify:
   - Design placement (front/back/sleeves)
   - Design style (minimalist/bold/complex)
   - Color scheme
   - Typography or graphics used
3. Generate production-ready embroidery specifications

PRODUCT CONTEXT:
- Category: ${metadata.category}
- Target: ${metadata.target_audience}
- Design notes: ${metadata.design_notes || "N/A"}

OUTPUT FORMAT:

DESIGN_NAME: ${sku}_embroidery
PLACEMENT: [front/back/sleeves - where design appears]
DESIGN_TYPE: [embroidery/print/combo]
COLORS_IDENTIFIED: [list colors in design]
STITCH_COMPLEXITY: [low/medium/high]
ESTIMATED_STITCHES: [approximate count]
PRODUCTION_NOTES: [any technical considerations]

EMBROIDERY_READY_DESCRIPTION:
[2-3 sentences describing the embroidery design for production]

DESIGN_SPECIFICATIONS:
- Dimensions: [estimated size]
- Color thread recommendations: [specific threads]
- Backing type: [tearaway/cutaway/none]
- Hoop size needed: [size]

QUALITY_CHECK:
- Technically feasible for embroidery? [yes/no]
- Premium quality achievable? [yes/no]
- Brand consistent? [yes/no]

Respond only in the format above. Be specific and production-ready.`;

  const response = await client.chat.completions.create({
    model: "gpt-4-vision",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mediaType};base64,${base64Image}`,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content;
}

async function generateCopyFromMockup(metadata) {
  console.log(`  → Generating product copy from mockup...`);

  const prompt = `You are a luxury e-commerce copywriter for premium streetwear.

PRODUCT:
- Title: ${metadata.title}
- Category: ${metadata.category}
- Price: NZ$${metadata.price}
- Description: ${metadata.description}
- Target: ${metadata.target_audience}

Write compelling product copy that:
1. Emphasizes premium quality
2. Communicates the design aesthetic
3. Speaks to the target audience
4. Creates desire without discounting

OUTPUT FORMAT:

TITLE: ${metadata.title} [keep or revise]

HEADLINE: [single sentence value prop]

TAGLINE: [2-word positioning]

BENEFITS:
- ${metadata.design_prompt} aesthetic
- [benefit 2]
- [benefit 3]
- [benefit 4]
- [benefit 5]

DESCRIPTION: [2-3 sentences, luxury tone]

KEYWORDS: [8 comma-separated keywords]

SOCIAL_POST: [140 char version for social]

Respond only in this format. Premium voice. No hype.`;

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

// ============================================
// CREATE PRODUCT ENTRY
// ============================================

function createProductEntry(sku, metadata) {
  return {
    sku,
    title: metadata.title,
    category: metadata.category,
    description: metadata.description,
    price: parseInt(metadata.price),
    cost: parseInt(metadata.cost || "0"),
    material: metadata.material,
    fit: metadata.fit || "standard",
    colors: metadata.colors?.split(",").map((c) => c.trim()) || ["black"],
    sizes: metadata.sizes?.split(",").map((s) => s.trim()) || [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL",
    ],
    design_prompt: metadata.design_prompt,
    target_audience: metadata.target_audience,
    design_elements: {
      front: "Design from mockup",
      back: "Design from mockup",
    },
    print_area: "front: 20cm², back: 45cm²",
    max_colors: 3,
    brand_identity: "premium discipline culture",
    published: false,
    created_at: new Date().toISOString().split("T")[0],
    variant_ids: [],
  };
}

// ============================================
// SAVE OUTPUTS
// ============================================

function saveDesignSpec(sku, spec) {
  const file = path.join(PATHS.designs, `${sku}.txt`);
  fs.writeFileSync(file, spec);
  console.log(`  ✓ Design spec saved: ${file}`);
}

function saveCopy(sku, copy) {
  const file = path.join(PATHS.listings, `${sku}_copy.txt`);
  fs.writeFileSync(file, copy);
  console.log(`  ✓ Product copy saved: ${file}`);
}

function addProductToJson(product) {
  const products = JSON.parse(fs.readFileSync(PATHS.products, "utf8"));

  // Remove if exists (update)
  const filtered = products.filter((p) => p.sku !== product.sku);
  filtered.push(product);

  fs.writeFileSync(PATHS.products, JSON.stringify(filtered, null, 2));
  console.log(`  ✓ Product added to catalog: ${product.sku}`);
}

// ============================================
// MAIN ORCHESTRATION
// ============================================

async function processMockup(sku) {
  console.log(`\n🎨 Converting mockup: ${sku}`);

  try {
    // 1. Find files
    const mockupFile = findMockupFile(sku);
    const metadataFile = findMetadataFile(sku);

    if (!mockupFile) {
      throw new Error(`Mockup image not found for ${sku}`);
    }

    if (!metadataFile) {
      throw new Error(`Metadata file not found for ${sku}`);
    }

    // 2. Parse metadata
    const metadata = parseMetadata(metadataFile);

    // Validate required fields
    const required = ["title", "price", "category", "description"];
    for (const field of required) {
      if (!metadata[field]) {
        throw new Error(`Missing required field in metadata: ${field}`);
      }
    }

    console.log(`  ✓ Metadata loaded for: ${metadata.title}`);

    // 3. Generate specs from mockup image
    const designSpec = await generateDesignFromMockup(sku, mockupFile, metadata);
    saveDesignSpec(sku, designSpec);

    // 4. Generate copy
    const copy = await generateCopyFromMockup(metadata);
    saveCopy(sku, copy);

    // 5. Create product entry
    const product = createProductEntry(sku, metadata);
    addProductToJson(product);

    console.log(`✅ Mockup converted: ${sku}`);
    return { sku, status: "success" };
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return { sku, status: "error", error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const skuFilter = args.find((a) => a.startsWith("--sku"))?.split("=")[1];

  if (!fs.existsSync(MOCKUP_DIR)) {
    console.error(`Mockups directory not found: ${MOCKUP_DIR}`);
    process.exit(1);
  }

  // Find all mockup files
  const allFiles = fs.readdirSync(MOCKUP_DIR);
  const imageFiles = allFiles.filter((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  const skus = [
    ...new Set(
      imageFiles.map((f) => f.replace(/\.(jpg|jpeg|png|webp)$/i, ""))
    ),
  ];

  if (skuFilter) {
    const toProcess = skus.filter((s) => s === skuFilter);
    if (toProcess.length === 0) {
      console.error(`SKU not found: ${skuFilter}`);
      process.exit(1);
    }
  }

  const toProcess = skuFilter ? skus.filter((s) => s === skuFilter) : skus;

  if (toProcess.length === 0) {
    console.log("No mockup images found in mockups-input/");
    console.log("Add images (DIA-TEE-001.jpg) and metadata (DIA-TEE-001.txt)");
    return;
  }

  console.log(`\n🎨 Mockup to Product Converter`);
  console.log(`   Processing: ${toProcess.length} mockup(s)\n`);

  const results = [];
  for (const sku of toProcess) {
    const result = await processMockup(sku);
    results.push(result);
    // Rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n✅ Conversion Complete`);
  const success = results.filter((r) => r.status === "success").length;
  console.log(`   ${success}/${results.length} mockups processed\n`);

  if (success > 0) {
    console.log(`Next step: npm run sync-printful\n`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
