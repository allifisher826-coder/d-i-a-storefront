# 🎯 HOW TO USE YOUR SYSTEM (Step-by-Step)

## THE SIMPLE VERSION

**3 things you need to do to launch a new product:**

### Step 1: Edit JSON File

Open `data/products.json` and add:

```json
{
  "sku": "DIA-NEW-001",
  "title": "Your Product Name",
  "category": "tee",  // or hoodie, tracksuit, shorts
  "description": "What it is and why it matters",
  "price": 99,       // your selling price
  "cost": 32,        // production cost
  "material": "what it's made of",
  "fit": "oversized",
  "colors": ["black"],
  "sizes": ["XS", "S", "M", "L", "XL", "2XL"],
  "design_prompt": "describe the design style",
  "target_audience": "who this is for",
  "published": false
}
```

### Step 2: Run One Command

```bash
npm run pod:new -- --sku DIA-NEW-001
```

That's it. The system:
- ✓ Generates design
- ✓ Generates copy
- ✓ Syncs to Printful
- ✓ Updates your store
- ✓ Goes live

### Step 3: Done

Your product is live on **doitanyway.netlify.app**

Customers can buy it. Printful fulfills it. You see money.

---

## WHAT HAPPENS BEHIND THE SCENES

```
npm run pod:new -- --sku DIA-NEW-001
│
├─ npm run generate
│  └─ AI reads your product
│     ├─ Creates design specs (embroidery details)
│     ├─ Writes product copy (SEO + conversion)
│     └─ Designs mockup scene (for images)
│
├─ npm run sync-printful
│  └─ Takes those specs
│     ├─ Uploads to Printful API
│     ├─ Creates product + variants
│     └─ Marks as published
│
├─ npm run ingest-store
│  └─ Updates your store
│     ├─ Adds product card to index.html
│     ├─ Updates product database
│     └─ Commits to Git
│
└─ git push → GitHub Actions → Netlify deploys
   └─ 🎉 LIVE
```

**Total time: ~45 seconds**

---

## YOUR WORKFLOW

### Monday: Plan Content

- Decide on new product
- Sketch design idea
- Plan product positioning

### Tuesday: Create in Data File

Edit `data/products.json`:
- Add SKU
- Write description
- Set price + cost
- Define design prompt

### Tuesday (2 min): Launch

```bash
npm run pod:new -- --sku NEW-SKU
```

Wait 45 seconds.

### Tuesday (3 min): Live

Visit store. Product is there. Ready to sell.

### Wednesday+: Promote

- Create TikTok video
- Post on Instagram
- Send email campaign
- Watch sales come in

---

## COMMON SCENARIOS

### Scenario 1: You Have a Design Mockup

You've got a design image you want to use.

```bash
# Add to data/products.json
# Set design_prompt = "based on this mockup, create embroidery specs"

npm run pod:new -- --sku NEW-SKU
```

System will generate embroidery-ready specs from your mockup.

### Scenario 2: You Want to Tweak Generated Copy

```bash
# After generation, edit the copy file
nano output/listings/NEW-SKU_copy.txt

# Then ingest (it will use your edited version)
npm run ingest-store -- --sku NEW-SKU
```

### Scenario 3: You Want to Launch 10 Products at Once

```bash
# Add all 10 to data/products.json

# Then do a batch release
npm run pod:all
```

System processes all in parallel. All go live together.

### Scenario 4: You Want to Update an Existing Product

```bash
# Edit the product in data/products.json (change price, description, etc)

# Regenerate and redeploy
npm run generate -- --sku EXISTING-SKU
npm run ingest-store -- --sku EXISTING-SKU
```

Store updates automatically.

---

## IMPORTANT: THE LOCKED PROMPTS

Three files control how AI generates your products:

1. **`prompts/pod_design.txt`**
   - Controls embroidery design generation
   - Edit to change design style
   - Version controlled in Git

2. **`prompts/product_copy.txt`**
   - Controls how copy is written
   - Edit to change tone/voice
   - Version controlled in Git

3. **`prompts/mockup_scene.txt`**
   - Controls mockup descriptions
   - Edit to change photo style
   - Version controlled in Git

**These are your brand guardrails. Change them for different product tiers:**

Example:
```
prompts/pod_design.txt:          "minimalist aesthetic"
prompts/pod_design_premium.txt:  "luxury, complex embroidery"
prompts/pod_design_summer.txt:   "vibrant, fun, seasonal"
```

---

## QUALITY CHECKS (Before You Publish)

Always run validation:

```bash
npm run validate
```

This checks:
- ✓ All required fields
- ✓ Price > Cost (40%+ margin)
- ✓ Design files exist
- ✓ Copy files exist
- ✓ No "demo" language
- ✓ HTML is valid

If it fails, fix the issues and try again.

---

## MONITORING & ANALYTICS

### Check Your Store

```
https://doitanyway.netlify.app
```

Product should appear within 1 minute of running `npm run pod:new`.

### Check Printful Dashboard

```
https://printful.com/dashboard
```

Your product appears in Printful's fulfillment system.

### Check GitHub

```
git log --oneline
```

You should see commits for each product launched.

### Check Analytics

(Coming soon: GA4 integration)
- Traffic sources
- Conversion rate
- Customer data
- Revenue tracking

---

## TROUBLESHOOTING

### "Product doesn't appear on store"

```bash
# Check if generation succeeded
ls -la output/listings/YOUR-SKU*

# If files exist, try reingest
npm run ingest-store -- --sku YOUR-SKU

# Check Git push worked
git log --oneline | head -1

# Wait 60 seconds for Netlify to deploy
# Refresh browser (hard refresh: Cmd+Shift+R on Mac)
```

### "Validation fails"

```bash
npm run validate:strict
```

Shows exactly which files are missing. Fix and retry.

### "API error from Printful"

Check:
- ✓ PRINTFUL_API_TOKEN is set correctly
- ✓ Token has all scopes enabled (Settings → API)
- ✓ Printful account has active subscription

### "OpenAI API error"

Check:
- ✓ OPENAI_API_KEY is set correctly
- ✓ API key hasn't been revoked
- ✓ Your OpenAI account has credits

---

## OPTIMIZATION TIPS

### Tip 1: Group Similar Products

If launching similar items (different colors), create them as separate SKUs:

```json
{
  "sku": "DIA-TEE-BLACK",
  "colors": ["black"],
  ...
},
{
  "sku": "DIA-TEE-WHITE",
  "colors": ["off-white"],
  ...
}
```

Then launch together:

```bash
npm run pod:all
```

### Tip 2: Seasonal Collections

Create date-stamped SKUs for seasonal drops:

```json
{
  "sku": "DIA-SUMMER-2026-001",
  ...
}
```

Makes it easy to track and audit by season.

### Tip 3: Test Prompts

Before generating all products, test a single product first:

```bash
npm run generate -- --sku DIA-TEST-001
```

Review the output. If you like it, adjust prompts if needed, then do batch:

```bash
npm run pod:all
```

### Tip 4: Manual Review (First 50 Products)

Before you scale, review every generated design + copy:

```bash
cat output/designs/SKU.txt
cat output/listings/SKU_copy.txt
cat output/mockups/SKU_scene.txt
```

Edit if needed. After 50, you'll understand the system and can skip reviews.

### Tip 5: Use SKU Prefixes

Organize by product type:

```
DIA-TEE-001      (t-shirts)
DIA-HOODIE-001   (hoodies)
DIA-TRACK-001    (tracksuits)
DIA-SHORT-001    (shorts)
DIA-CAPS-001     (future: caps)
```

Makes auditing easy.

---

## SCALING PATH

### Month 1: Get It Working
- Launch 3 products
- Verify fulfillment
- Test store completely
- Get first 5-10 sales

### Month 2-3: Optimize
- Generate 2-3 products/week
- Test different designs
- Optimize copy based on performance
- 20-50 sales/month

### Month 4+: Automate
- Launch 2-3 products/week
- Weekly drops (seasonal)
- Email campaigns automated
- 50-100+ sales/month

### Year 2: Scale
- New product categories
- International expansion
- Brand partnerships
- 500+ monthly revenue

---

## SUCCESS METRICS

### Track These

```
Weekly:
├─ New products launched: ___
├─ Total products live: ___
├─ Store traffic: ___
└─ Conversion rate: ___%

Monthly:
├─ Total sales: ___
├─ Revenue: $___
├─ Profit: $___
└─ Repeat customer %: ___%

Quarterly:
├─ Product ROI: ___
├─ Customer LTV: $___
├─ CAC: $___
└─ Margin trend: ↑/→/↓
```

---

## THE BOTTOM LINE

You now have a system where:

- **Adding a product = 2 minutes of work**
- **AI does design, copy, mockups**
- **Printful handles fulfillment**
- **Your store updates automatically**
- **GitHub Actions validates everything**
- **Netlify deploys instantly**

You don't see the product. You don't ship it. You don't handle returns.

Money comes in. You scale by adding more products.

**That's it. That's the system.**

---

## NEXT: Read POD_QUICKSTART.md and launch your first product

Command:
```bash
npm run pod:new -- --sku DIA-TEE-001
```

Result: Live store, ready to sell, in 45 seconds.

🚀
