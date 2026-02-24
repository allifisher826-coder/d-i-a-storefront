# 📸 **MOCKUP-TO-PRODUCT: YOUR WORKFLOW**

**Part of the D.I.A. automation system. See [COMPLETE_BUILD_SUMMARY.md](COMPLETE_BUILD_SUMMARY.md) for full deployment timeline and integration points.**

## **What You Can Now Do**

You can now provide mockup images + brief product info, and the system will:

1. ✅ **Analyze your mockup** (AI vision)
2. ✅ **Extract design specs** (embroidery-ready)
3. ✅ **Generate product copy** (SEO + conversion)
4. ✅ **Sync to Printful** (fulfillment)
5. ✅ **Publish to store** (live immediately)
6. ✅ **Deploy to web** (doitanyway.netlify.app)

**All automatically. Zero manual steps.**

---

## **THE SYSTEM**

### **Files You Create**

```
mockups-input/
├── DIA-TEE-001.jpg           ← Your product mockup image
├── DIA-TEE-001.txt           ← Product details (see template)
├── DIA-HOODIE-001.png        ← Another mockup
├── DIA-HOODIE-001.txt        ← Another product details
└── [more products...]
```

### **One Command to Publish**

```bash
# Single product
npm run pod:from-mockup -- --sku DIA-TEE-001

# Multiple products (all in mockups-input/)
npm run pod:from-mockups:all
```

### **Automatic Result**

- ✅ Design specifications extracted
- ✅ Product copy generated
- ✅ Product added to catalog
- ✅ Synced to Printful
- ✅ Published to store
- ✅ Live on doitanyway.netlify.app

**Time: ~5 minutes per product**

---

## **METADATA TEMPLATE**

Save as `mockups-input/DIA-TEE-001.txt`:

```
TITLE: Your Product Name
PRICE: 89
COST: 32
CATEGORY: tee
MATERIAL: 180gsm cotton
FIT: oversized
COLORS: black
SIZES: XS,S,M,L,XL,2XL
DESCRIPTION: What your product is. 2-3 sentences.
DESIGN_PROMPT: Design style notes. Bold/minimal/etc.
TARGET_AUDIENCE: Who this is for.
DESIGN_NOTES: Specific production notes (optional).
```

**Required:** TITLE, PRICE, COST, CATEGORY, DESCRIPTION, TARGET_AUDIENCE

---

## **HOW THE AI WORKS**

1. **Reads your mockup image** (JPG, PNG, WEBP)
2. **Analyzes design elements:**
   - Placement (front/back/sleeves)
   - Colors and palette
   - Typography and graphics
   - Style and complexity
3. **Generates production specs:**
   - Embroidery specifications
   - Thread colors
   - Stitch counts
   - Technical requirements
4. **Writes product copy:**
   - Title (or revises yours)
   - Benefits
   - Keywords
   - Social post

---

## **STEP-BY-STEP WALKTHROUGH**

### **Step 1: Design Your Mockup**

Create a product mockup/photo showing:
- How the product looks
- Design placement
- Colors and styling
- Clear, high-quality image

**Image requirements:**
- 1200x1200px or larger
- JPG, PNG, or WEBP
- Clear and color accurate

### **Step 2: Create Metadata File**

Create `mockups-input/DIA-TEE-001.txt`:

```
TITLE: Do It Anyway Tee
PRICE: 89
COST: 32
CATEGORY: tee
MATERIAL: 180gsm cotton
FIT: oversized
COLORS: black
SIZES: XS,S,M,L,XL,2XL
DESCRIPTION: Minimal front embroidery, powerful back statement. Premium mineral wash. Entry point to the Culture of Discipline.
DESIGN_PROMPT: Clean sans-serif typography. High contrast. Bold, confident, minimal. Perfect for embroidery.
TARGET_AUDIENCE: New customers, accessible entry point
DESIGN_NOTES: Front: small D.I.A. embroidery left chest. Back: large "DO IT ANYWAY" statement centered.
```

### **Step 3: Save Your Files**

```
mockups-input/
├── DIA-TEE-001.jpg      ✓ Your image
└── DIA-TEE-001.txt      ✓ Your metadata
```

### **Step 4: Run Conversion**

```bash
npm run pod:from-mockup -- --sku DIA-TEE-001
```

**Output:**
```
🎨 Converting mockup: DIA-TEE-001
  → Analyzing mockup for DIA-TEE-001...
  → Generating product copy from mockup...
  ✓ Design spec saved: output/designs/DIA-TEE-001.txt
  ✓ Product copy saved: output/listings/DIA-TEE-001_copy.txt
  ✓ Product added to catalog: DIA-TEE-001
✅ Mockup converted: DIA-TEE-001

🖨️  Syncing: DIA-TEE-001
  → Creating/updating product: DIA-TEE-001
  ✓ Created product ID: 12345
  → Creating variants for product 12345
    ✓ Created variant: DIA-TEE-001-XS
    ✓ Created variant: DIA-TEE-001-S
    [... all sizes ...]
✅ Sync complete for DIA-TEE-001

📦 Ingesting: DIA-TEE-001
  ✓ Updated index.html with DIA-TEE-001 products

✅ Ingestion Complete
   1/1 products added to store

Next step: npm run sync-printful
```

### **Step 5: Verify**

Visit store: **doitanyway.netlify.app**

Your product appears within 2 minutes.

---

## **BATCH UPLOAD EXAMPLE**

### **Release 3 Products at Once**

**Files:**
```
mockups-input/
├── DIA-TEE-001.jpg
├── DIA-TEE-001.txt
├── DIA-HOODIE-001.jpg
├── DIA-HOODIE-001.txt
├── DIA-TRACKSUIT-001.jpg
└── DIA-TRACKSUIT-001.txt
```

**Command:**
```bash
npm run pod:from-mockups:all
```

**Process:** ~10 minutes  
**Result:** All 3 products live on store

---

## **EDITING GENERATED CONTENT**

If you want to tweak the AI-generated specs or copy:

### **Edit Design Specs**

```bash
nano output/designs/DIA-TEE-001.txt
```

Save and run:
```bash
npm run ingest-store -- --sku DIA-TEE-001
```

### **Edit Product Copy**

```bash
nano output/listings/DIA-TEE-001_copy.txt
```

Save and run:
```bash
npm run ingest-store -- --sku DIA-TEE-001
```

---

## **FILE LOCATIONS**

### **Input (Where You Add Mockups)**
```
mockups-input/
└── Your images + metadata files
```

### **Template (What to Copy)**
```
mockups-input/MOCKUP_EXAMPLE.txt
```

### **Output (What System Generates)**
```
output/
├── designs/DIA-TEE-001.txt         ← Design specs
├── listings/DIA-TEE-001_copy.txt   ← Product copy
└── mockups/DIA-TEE-001_scene.txt   ← Mockup scene
```

### **Catalog (Your Products)**
```
data/products.json                   ← Auto-updated
```

---

## **COMMANDS REFERENCE**

```bash
# Single mockup conversion
npm run pod:from-mockup -- --sku DIA-TEE-001

# All mockups in batch
npm run pod:from-mockups:all

# Just analyze (don't publish)
npm run mockup:convert -- --sku DIA-TEE-001

# Validate before publishing
npm run validate
```

---

## **TIMELINE TO FIRST SALE**

```
Monday:
├─ Create first product mockup (30 min)
├─ Write metadata file (5 min)
└─ Run npm run pod:from-mockup (5 min)
└─ LIVE on store ✅

Tuesday:
├─ Create 2-3 more mockups (1 hour)
├─ Run npm run pod:from-mockups:all (5 min)
└─ All live ✅

Wednesday:
├─ Promote on social media
└─ First customers buying ✅

Thursday:
├─ Printful fulfills orders
└─ Money shows up ✅
```

---

## **METRICS**

| Aspect | Value |
|--------|-------|
| **Time per product** | ~5 min |
| **Manual work** | 0 |
| **Cost per product** | ~$0.03 (AI) |
| **Products per week** | 5-10 |
| **Monthly potential** | 20-40 products |
| **Fulfillment** | 100% automated |
| **Deployment** | Instant |

---

## **NEXT ACTION**

1. Design or screenshot your first product mockup
2. Save to: `mockups-input/DIA-TEE-001.jpg`
3. Create metadata: `mockups-input/DIA-TEE-001.txt` (copy template)
4. Run: `npm run pod:from-mockup -- --sku DIA-TEE-001`
5. Wait 2 minutes
6. Visit: doitanyway.netlify.app
7. See your product live

**That's it.**

---

## **DOCUMENTATION**

- **Quick intro:** `mockups-input/README.md`
- **Full guide:** `MOCKUP_TO_PRODUCT_GUIDE.md`
- **Template:** `mockups-input/MOCKUP_EXAMPLE.txt`
- **Visual guide:** `MOCKUP_WORKFLOW.txt`

---

**You now have a complete system to convert your mockups into published products in under 5 minutes.**

🚀
