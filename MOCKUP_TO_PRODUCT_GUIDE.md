# 📸 MOCKUP TO PRODUCT WORKFLOW

## **The 3-Step Process**

You have mockup images? Here's how to get them published:

```
Step 1: Add mockup image + metadata file
Step 2: Run one command
Step 3: Product is live
```

---

## **STEP 1: Prepare Your Mockups**

### A. Create Mockup Image

Design or screenshot your product mockup. Save as:
```
mockups-input/DIA-TEE-001.jpg
mockups-input/DIA-HOODIE-001.png
mockups-input/DIA-TRACKSUIT-001.jpg
```

**Supported formats:** `.jpg`, `.png`, `.webp`

**Image tips:**
- Clear, high quality (1200x1200px or larger)
- Shows product clearly
- Can be flat lay, on model, or product shot
- Color accurate to final product

### B. Create Metadata File

Create a `.txt` file with same SKU name:

**File:** `mockups-input/DIA-TEE-001.txt`

**Content:**
```
TITLE: Do It Anyway Oversized Tee
PRICE: 89
COST: 32
CATEGORY: tee
MATERIAL: 180gsm cotton
FIT: oversized
COLORS: black
SIZES: XS,S,M,L,XL,2XL
DESCRIPTION: Minimal front, wearable manifesto back. Premium mineral wash. Entry point to the Culture.
DESIGN_PROMPT: Clean sans-serif typography. High contrast white on black. Bold, confident, minimal.
TARGET_AUDIENCE: New customers, accessible entry point
DESIGN_NOTES: Front: small D.I.A. embroidery. Back: large "DO IT ANYWAY" statement text.
```

**Required fields:**
- `TITLE` — Product name
- `PRICE` — Selling price (NZD)
- `COST` — Production cost
- `CATEGORY` — tee, hoodie, tracksuit, shorts
- `DESCRIPTION` — What it is (2-3 sentences)
- `TARGET_AUDIENCE` — Who buys this

**Optional fields:**
- `MATERIAL` — Fabric type
- `FIT` — How it fits
- `COLORS` — Comma-separated
- `SIZES` — Comma-separated (default: XS-2XL)
- `DESIGN_PROMPT` — Design style notes
- `DESIGN_NOTES` — Production notes

---

## **STEP 2: Convert to Product**

### Single Mockup

```bash
npm run pod:from-mockup -- --sku DIA-TEE-001
```

System will:
1. ✓ Analyze your mockup image
2. ✓ Extract design specifications
3. ✓ Generate embroidery-ready specs
4. ✓ Generate product copy
5. ✓ Add to product catalog
6. ✓ Sync to Printful
7. ✓ Update store
8. ✓ Deploy to live site

**Time:** ~2 minutes

### Multiple Mockups

Add all mockup images + metadata files to `mockups-input/`, then:

```bash
npm run pod:from-mockups:all
```

Processes all in batch.

---

## **STEP 3: Review & Launch**

### Verify Generated Content

The system creates three files:

```bash
# View generated design specs
cat output/designs/DIA-TEE-001.txt

# View generated product copy
cat output/listings/DIA-TEE-001_copy.txt

# View your product in catalog
grep "DIA-TEE-001" data/products.json
```

### Check Store

Visit: **doitanyway.netlify.app**

Your product appears within 2 minutes of running the command.

### Verify Printful

Login to: **printful.com/dashboard**

Your product is ready for fulfillment.

---

## **REAL EXAMPLE**

### File 1: Mockup Image
```
mockups-input/DIA-TEE-001.jpg
```
(Your actual product photo/mockup)

### File 2: Metadata
```
mockups-input/DIA-TEE-001.txt
```
Content:
```
TITLE: Do It Anyway Tee
PRICE: 89
COST: 32
CATEGORY: tee
MATERIAL: 180gsm cotton
FIT: oversized
COLORS: black
SIZES: XS,S,M,L,XL,2XL
DESCRIPTION: Minimal front embroidery. Large back statement. Wearable manifesto for humans who actually execute.
DESIGN_PROMPT: Bold sans-serif. White on black. Minimalist. Premium embroidery.
TARGET_AUDIENCE: Creators, athletes, discipline-focused people
DESIGN_NOTES: Front: small D.I.A. left chest. Back: "DO IT ANYWAY" full back.
```

### Command
```bash
npm run pod:from-mockup -- --sku DIA-TEE-001
```

### Result
✅ Design specs extracted from image  
✅ Product copy generated  
✅ Product added to catalog  
✅ Synced to Printful  
✅ Published to store  
✅ Live at doitanyway.netlify.app  

---

## **ADVANCED: Custom Design Notes**

The AI analyzes your mockup image and:
1. **Identifies design placement** (front/back/sleeves)
2. **Detects colors and style** from the mockup
3. **Generates embroidery specifications** production-ready
4. **Respects your DESIGN_NOTES** field for specific requirements

Example DESIGN_NOTES:
```
DESIGN_NOTES: 
- Front: small 2x3cm embroidery, left chest
- Back: 30x40cm statement text, centered
- Colors: Red and white only
- Stitching: max 50,000 stitches
```

The system incorporates these into production specs.

---

## **TROUBLESHOOTING**

### "Image not found"

```bash
# Check file exists in mockups-input/
ls -la mockups-input/DIA-TEE-001.jpg

# Check SKU matches (case-sensitive)
# File: DIA-TEE-001.jpg
# Command: npm run pod:from-mockup -- --sku DIA-TEE-001
```

### "Missing metadata file"

```bash
# Must create .txt file with same SKU name
mockups-input/DIA-TEE-001.jpg  ✓
mockups-input/DIA-TEE-001.txt  ✓ (required)
```

### "Generated specs don't match my design"

Edit manually:
```bash
# Review what AI generated
cat output/designs/DIA-TEE-001.txt

# Edit if needed
nano output/designs/DIA-TEE-001.txt

# Re-ingest to store
npm run ingest-store -- --sku DIA-TEE-001
```

### "Product appears in catalog but not on store"

```bash
# Validate everything
npm run validate

# Re-ingest
npm run ingest-store -- --sku DIA-TEE-001

# Check Netlify deploy logs
git log --oneline -1
```

---

## **BATCH UPLOAD (Multiple Products)**

### Example: Release 5 Products

**Files:**
```
mockups-input/
├── DIA-TEE-001.jpg
├── DIA-TEE-001.txt
├── DIA-HOODIE-001.jpg
├── DIA-HOODIE-001.txt
├── DIA-TRACKSUIT-001.jpg
├── DIA-TRACKSUIT-001.txt
├── DIA-SHORT-001.jpg
├── DIA-SHORT-001.txt
├── DIA-CAP-001.jpg
└── DIA-CAP-001.txt
```

**Command:**
```bash
npm run pod:from-mockups:all
```

**Process:**
- Converts all 5 in batch
- Generates all specs + copy
- Syncs all to Printful
- Publishes all to store
- All go live together

**Time:** ~10 minutes for 5 products

---

## **QUALITY CHECKLIST**

Before you upload mockups:

- [ ] Image is clear and high quality (1200x1200px+)
- [ ] Metadata file has all required fields
- [ ] SKU naming matches (.jpg + .txt)
- [ ] Price > Cost (40%+ margin)
- [ ] Category is valid (tee/hoodie/tracksuit/shorts)
- [ ] Description is 2-3 sentences max
- [ ] All fields are spelled correctly

---

## **YOUR WORKFLOW**

```
Morning: Design 2-3 mockups
         ↓
Afternoon: Add images + metadata to mockups-input/
         ↓
Evening: npm run pod:from-mockups:all
         ↓
Next day: Products live, customers buying
         ↓
Money appears
```

---

## **NEXT ACTIONS**

1. **Prepare your first mockup** (image + .txt file)
2. **Place in** `mockups-input/` folder
3. **Run:** `npm run pod:from-mockup -- --sku YOUR-SKU`
4. **Wait:** ~2 minutes
5. **Visit:** doitanyway.netlify.app
6. **Verify:** Product is live
7. **Promote:** Post on social media
8. **Repeat:** Add more mockups

---

**You now have a system where you can upload mockups and have them auto-published without any manual steps.**

Questions? Check the metadata template in `mockups-input/MOCKUP_EXAMPLE.txt`

🚀
