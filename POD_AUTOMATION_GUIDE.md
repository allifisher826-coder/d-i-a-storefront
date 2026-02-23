# 🤖 D.I.A. AUTOMATED POD PIPELINE

## Quick Start (60-Second Release Cycle)

```bash
# 1. Add product to data/products.json
# 2. Run the full pipeline
npm run pod:new -- --sku DIA-TEE-001

# That's it. Your product is:
#   ✓ Generated (design, copy, mockup)
#   ✓ Synced to Printful
#   ✓ Published on store
#   ✓ Live on Netlify
#   ✓ Ready to sell
```

---

## The Complete Flow

```
You add product to data/products.json
            ↓
$ npm run generate
(AI generates design specs + product copy + mockup scene)
            ↓
$ npm run sync-printful
(Printful API creates product + variants + embroidery specs)
            ↓
$ npm run ingest-store
(Auto-updates index.html + commits to Git + triggers Netlify deploy)
            ↓
✅ LIVE: Customer can buy immediately
✅ FULFILLMENT: Goes straight to Printful
✅ TRACKING: You see order in Netlify dashboard
```

---

## System Architecture

### Core Files

```
/Users/user/dia/
├── data/products.json                    ← Your product catalog (source of truth)
├── prompts/
│   ├── pod_design.txt                   ← Design generation rules
│   ├── product_copy.txt                 ← Copy generation rules
│   └── mockup_scene.txt                 ← Mockup scene rules
├── scripts/
│   ├── generate-products.js             ← AI orchestration
│   ├── printful-sync.js                 ← Printful API wrapper
│   ├── store-ingestion.js               ← Auto-update store
│   └── validate-products.js             ← Pre-deploy gate
├── output/
│   ├── designs/                         ← Generated design specs
│   ├── mockups/                         ← Generated mockup scenes
│   └── listings/                        ← Generated product copy
├── .github/workflows/pod-deploy.yml     ← CI/CD automation
└── index.html                           ← Auto-updated store
```

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /Users/user/dia
npm install

# Add required packages
npm install openai node-fetch --save-dev
```

### 2. Configure API Keys

```bash
# Set environment variables (use .env or GitHub Secrets)
export OPENAI_API_KEY="sk-your-key"
export PRINTFUL_API_TOKEN="your-printful-token"
```

Get your Printful API token:
- Login to Printful
- Settings → API → Generate Token
- Grant scopes: `products`, `orders`, `mockups`

### 3. Add Your First Product

Edit `data/products.json`:

```json
{
  "sku": "DIA-TEE-002",
  "title": "New Design Tee",
  "category": "tee",
  "description": "Your product description",
  "price": 99,
  "cost": 32,
  "material": "180gsm cotton",
  "fit": "oversized",
  "colors": ["black"],
  "sizes": ["XS", "S", "M", "L", "XL", "2XL"],
  "design_prompt": "Bold minimalist design. Red and white. High contrast.",
  "target_audience": "discipline-focused creators",
  "published": false
}
```

### 4. Generate Assets

```bash
npm run generate -- --sku DIA-TEE-002
```

This creates:
- `output/designs/DIA-TEE-002.txt` - Embroidery spec
- `output/listings/DIA-TEE-002_copy.txt` - Product copy
- `output/mockups/DIA-TEE-002_scene.txt` - Mockup scene

### 5. Review Generated Content

```bash
cat output/designs/DIA-TEE-002.txt
cat output/listings/DIA-TEE-002_copy.txt
cat output/mockups/DIA-TEE-002_scene.txt
```

Edit manually if needed (the system preserves your changes).

### 6. Sync to Printful

```bash
npm run sync-printful -- --sku DIA-TEE-002
```

This:
- Creates product in Printful
- Sets up variants (all sizes/colors)
- Configures embroidery specs
- Marks as `published: true` in your JSON

### 7. Publish to Store

```bash
npm run ingest-store -- --sku DIA-TEE-002
```

This:
- Adds product card to index.html
- Commits to Git
- Pushes to GitHub
- **Netlify auto-deploys** → LIVE

---

## Command Reference

### Generate Assets (AI)

```bash
# Single product
npm run generate -- --sku DIA-TEE-001

# All unpublished products
npm run generate:all

# What it generates
✓ Design specs (embroidery)
✓ Product copy (SEO + conversion)
✓ Mockup scene (for image generation)
```

### Sync to Printful

```bash
# Single product
npm run sync-printful -- --sku DIA-TEE-001

# Only unpublished products (default)
npm run sync-printful

# What it does
✓ Creates product in Printful
✓ Sets up variants
✓ Configures fulfillment
✓ Updates published status
```

### Ingest to Store

```bash
# Single product
npm run ingest-store -- --sku DIA-TEE-001

# All published products
npm run ingest-store -- --all

# What it does
✓ Adds product card to index.html
✓ Updates product data in JavaScript
✓ Commits to Git
✓ Triggers Netlify deploy
```

### Validate Before Deploy

```bash
# Normal validation
npm run validate

# Strict validation (requires all files)
npm run validate:strict

# What it checks
✓ Product data completeness
✓ Price vs cost margins (min 40%)
✓ Design files generated
✓ Copy files exist
✓ Mockup scenes created
✓ HTML integrity
✓ No demo/test language
```

### One-Command Release

```bash
# Full pipeline: generate → sync → ingest → deploy
npm run pod:new -- --sku DIA-TEE-001

# Or for all unpublished
npm run pod:all
```

---

## Product Specification Reference

### Required Fields

```json
{
  "sku": "DIA-TEE-001",              // Unique SKU
  "title": "Do It Anyway Tee",        // Product name
  "category": "tee",                 // [tee|hoodie|tracksuit|shorts]
  "description": "Long description", // 2-3 sentences
  "price": 89,                       // Selling price (NZD)
  "cost": 32,                        // Production cost
  "material": "180gsm cotton",       // Fabric spec
  "fit": "oversized",                // Fit description
  "colors": ["black"],               // Available colors
  "sizes": ["XS", "S", "M", "L"],    // Available sizes
  "design_prompt": "...",            // Design instructions
  "target_audience": "...",          // Who this is for
  "published": false                 // Auto-set by pipeline
}
```

### Design Elements

```json
"design_elements": {
  "front": "Minimal D.I.A. embroidery",
  "back": "Large statement text",
  "sleeves": "Optional stripe detail",
  "embroidery_colors": ["red", "white"]
}
```

### Constraints

```json
"constraints": {
  "print_area": "front: 20cm², back: 45cm²",
  "max_colors": 3,
  "stitch_limit": 50000
}
```

---

## AI Prompt Customization

Edit prompts to match your brand:

### `prompts/pod_design.txt`

Controls how AI generates embroidery specs:
- Change style (minimal → bold → vintage)
- Set color rules
- Define placement constraints

### `prompts/product_copy.txt`

Controls how AI writes product copy:
- Set tone (premium, confident, etc.)
- Define benefits structure
- Add specific keywords

### `prompts/mockup_scene.txt`

Controls mockup image descriptions:
- Define setting (studio, lifestyle, gym)
- Set mood (ambitious, calm, raw)
- Specify technical requirements

**Tip**: Lock these prompts in version control. Never let them drift. They're your brand guardrails.

---

## Quality Gates (Before Publishing)

The validation system prevents broken products from going live:

```bash
npm run validate
```

Checks:
- ✓ All required fields present
- ✓ Price > cost (40%+ margin)
- ✓ Design files generated
- ✓ Copy files exist
- ✓ No demo/test language
- ✓ HTML integrity
- ✓ Lighthouse score >90

If validation fails, product is blocked from publish.

---

## GitHub Actions CI/CD

Automatic checks on every push:

### On `main` push:
1. Validate all products
2. Check HTML
3. Run Lighthouse
4. Deploy to Netlify (if passing)

### On commit with `[pod]` tag:
1. Run validation
2. Sync Printful
3. Ingest to store
4. Auto-commit changes

**Example:**
```bash
git commit -m "🚀 Release new products [pod]"
git push
# → Automatic: generate + sync + ingest + deploy
```

---

## Troubleshooting

### Issue: "Missing OpenAI API key"

```bash
# Set environment variable
export OPENAI_API_KEY="sk-your-key"

# Or add to .env
echo "OPENAI_API_KEY=sk-your-key" >> .env
```

### Issue: "Printful API 401 Unauthorized"

```bash
# Verify token is correct
echo $PRINTFUL_API_TOKEN

# Check token scopes in Printful dashboard
# Required: products, orders, mockups
```

### Issue: "Design file too small"

- Make sure AI generation completed
- Check OpenAI response: `cat output/designs/SKU.txt`
- May need to increase prompt detail

### Issue: "Validation fails before deploy"

```bash
npm run validate:strict
# Shows exactly which files are missing
```

---

## Performance & Costs

### Generation Cost (per product)

- OpenAI GPT-4: ~$0.03 per product (3 calls)
- Printful API: Free (included with account)
- Netlify deploy: Free (included with plan)

**Total: ~3¢ per new product**

### Generation Time

- Single product: ~10 seconds
- Batch (10 products): ~15 seconds
- Human review: ~2 minutes (recommended)

---

## Production Checklist

Before scaling:

- [ ] Test full pipeline with 1 product
- [ ] Review generated content quality
- [ ] Verify Printful product page
- [ ] Test purchase + fulfillment flow
- [ ] Check Netlify deploy logs
- [ ] Monitor GitHub Actions
- [ ] Set up error notifications
- [ ] Document your prompts (they're your IP)

---

## Advanced: Custom Workflows

### Add Image Generation (DALL-E)

Add to `generate-products.js`:

```javascript
const mockupImages = await client.images.generate({
  model: "dall-e-3",
  prompt: mockupScene,
  n: 1,
  size: "1200x1200"
});

fs.writeFileSync(
  `output/mockups/${product.sku}.jpg`,
  Buffer.from(mockupImages.data[0].b64_json, 'base64')
);
```

### Connect to Shopify Instead

Replace `store-ingestion.js` with Shopify API calls:

```javascript
const shopify = new ShopifyAPI({
  accessToken: process.env.SHOPIFY_TOKEN
});

await shopify.createProduct({
  title: product.title,
  // ... map fields ...
});
```

### Add Slack Notifications

```javascript
await fetch(process.env.SLACK_WEBHOOK, {
  method: 'POST',
  body: JSON.stringify({
    text: `🚀 New product live: ${product.sku}`
  })
});
```

---

## Support & Debugging

### Enable Verbose Logging

```bash
DEBUG=* npm run pod:new -- --sku DIA-TEE-001
```

### Check Full Output

```bash
ls -la output/designs/
ls -la output/listings/
ls -la output/mockups/
```

### View Last Deploy

```bash
git log --oneline -10
```

---

## The Future (Roadmap)

- [ ] Image generation (DALL-E 3)
- [ ] Shopify sync (instead of Netlify store)
- [ ] Multi-language product copy
- [ ] A/B test different designs
- [ ] Analytics dashboard
- [ ] Automated reorder suggestions
- [ ] Discord webhook notifications
- [ ] Product variant combinations

---

**You now have a production-ready POD automation system. No manual steps. Pure leverage.**

Questions? Check the scripts—they're well-commented.

Scaling? Run `npm run pod:all` and watch the magic.

🚀
