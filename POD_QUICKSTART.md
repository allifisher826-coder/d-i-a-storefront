# 🚀 **D.I.A. POD — GET STARTED IN 5 MINUTES**

## **What You Have Now**

A fully automated system that takes:
```
Image + Style Prompt
    ↓
AI Generation (design + copy + mockup)
    ↓
Printful Sync (product creation + variants)
    ↓
Auto-Published (on store)
    ↓
Customer Buys → Printful Fulfills (you see nothing, money appears)
```

---

## **Setup (First Time Only)**

### Step 1: Install Node Packages

```bash
cd /Users/user/dia
npm install
npm install openai node-fetch --save-dev
```

### Step 2: Get Your API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new key
3. Copy it

**Printful:**
1. Login to https://printful.com
2. Settings → API
3. Create token (grant all scopes)
4. Copy it

### Step 3: Set Environment Variables

```bash
# Mac/Linux
export OPENAI_API_KEY="sk-..."
export PRINTFUL_API_TOKEN="..."

# Or create .env file
cat > .env << 'EOF'
OPENAI_API_KEY=sk-...
PRINTFUL_API_TOKEN=...
EOF
```

### Step 4: Verify Everything Works

```bash
npm run validate
```

Should show:
```
✅ All checks passed. Safe to deploy.
```

---

## **Add Your First Product (3 Steps)**

### Step 1: Edit `data/products.json`

Add a new product object:

```json
{
  "sku": "DIA-HOODIE-002",
  "title": "Discipline Hoodie Redux",
  "category": "hoodie",
  "description": "New colorway. Same culture. Heavy 400gsm embroidery.",
  "price": 179,
  "cost": 85,
  "material": "400gsm heavyweight",
  "fit": "oversized",
  "colors": ["black"],
  "sizes": ["XS", "S", "M", "L", "XL", "2XL"],
  "design_prompt": "Bold, minimal. Red + white embroidery. Premium aesthetic.",
  "target_audience": "discipline-focused creators",
  "published": false
}
```

### Step 2: Generate Assets

```bash
npm run generate -- --sku DIA-HOODIE-002
```

**What it creates:**
- `output/designs/DIA-HOODIE-002.txt` — Embroidery specs
- `output/listings/DIA-HOODIE-002_copy.txt` — Product copy
- `output/mockups/DIA-HOODIE-002_scene.txt` — Mockup scene

Review any file:
```bash
cat output/listings/DIA-HOODIE-002_copy.txt
```

Edit if needed (the system keeps your changes).

### Step 3: Publish to Store

```bash
npm run sync-printful -- --sku DIA-HOODIE-002
npm run ingest-store -- --sku DIA-HOODIE-002
```

**What happens:**
1. ✅ Product created in Printful
2. ✅ Variants auto-created (all sizes/colors)
3. ✅ Added to your store
4. ✅ Auto-pushed to GitHub
5. ✅ **LIVE on Netlify in 30 seconds**

---

## **That's It. Your Product is Live.**

Visit your store at:
- **doitanyway.netlify.app**

Your product is ready to:
- ✓ Be purchased
- ✓ Be fulfilled by Printful (directly)
- ✓ Generate revenue (automatic)

You don't see the product. You don't handle it. Money shows up.

---

## **Command Cheat Sheet**

```bash
# Generate assets (AI)
npm run generate -- --sku DIA-TEE-001

# Sync to Printful
npm run sync-printful -- --sku DIA-TEE-001

# Publish to store
npm run ingest-store -- --sku DIA-TEE-001

# Do all three at once
npm run pod:new -- --sku DIA-TEE-001

# Release all unpublished products
npm run pod:all

# Validate before deploying
npm run validate
```

---

## **How to Scale (Release Multiple Products)**

### Option 1: One at a Time
```bash
npm run pod:new -- --sku DIA-TEE-001
npm run pod:new -- --sku DIA-TEE-002
npm run pod:new -- --sku DIA-TEE-003
```

### Option 2: Batch Release
Add all products to `data/products.json`, then:
```bash
npm run pod:all
```

This processes all unpublished products automatically.

---

## **Customize Your Brand**

The prompts control how AI generates your products:

**Edit:** `prompts/pod_design.txt` — Design generation rules  
**Edit:** `prompts/product_copy.txt` — Copy generation rules  
**Edit:** `prompts/mockup_scene.txt` — Mockup scene rules  

These are versioned in Git. Change them to match your brand.

Example:
```
# Before
You are a senior apparel designer...

# After
You are a premium streetwear designer creating for elite discipline brands...
```

---

## **Troubleshooting**

### "Command not found: npm run generate"

```bash
# Make sure you're in the right directory
cd /Users/user/dia

# Reinstall npm packages
npm install
```

### "Missing OpenAI API key"

```bash
export OPENAI_API_KEY="sk-your-key"
npm run generate -- --sku DIA-TEE-001
```

### "Validation fails"

```bash
npm run validate:strict
```

Shows exactly what's missing.

### "Product doesn't appear on store"

```bash
# Check Git push worked
git log --oneline -1

# Check Netlify deploy
# Go to doitanyway.netlify.app and wait 60 seconds
```

---

## **What Happens Behind the Scenes**

```
npm run pod:new -- --sku DIA-TEE-001
          ↓
    Reads product from JSON
          ↓
    OpenAI generates 3 specs:
    - Embroidery design
    - Product copy
    - Mockup scene
          ↓
    Printful API creates:
    - Product
    - Variants (all sizes)
    - Embroidery settings
          ↓
    Auto-updates index.html with:
    - Product card
    - Price
    - Copy
    - Mockup placeholder
          ↓
    Git commit + push
          ↓
    Netlify auto-deploys
          ↓
    🎉 LIVE. Customer can buy.
          ↓
    Order → Printful fulfills → Shipped
          ↓
    You: Checking Netlify dashboard
```

---

## **Next Steps**

1. ✅ Add your first product
2. ✅ Run `npm run pod:new`
3. ✅ Visit your store
4. ✅ Place a test order
5. ✅ Check Printful dashboard for fulfillment

---

## **You Now Have**

✅ Automated design generation (AI)  
✅ Automated product creation (Printful)  
✅ Automated store updates (Netlify)  
✅ Automated CI/CD (GitHub Actions)  
✅ Zero manual steps  
✅ Production-ready system  

**Total time to launch new product: ~2 minutes**

---

**Questions? Check [POD_AUTOMATION_GUIDE.md](POD_AUTOMATION_GUIDE.md) for full documentation.**

🚀 **Now go make money with discipline.**
