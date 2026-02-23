# Mockups Input Folder

Drop your mockup images here to have them auto-converted to POD-ready products.

## How to Use

### Step 1: Add Your Mockup Image

Place image file here:
```
mockups-input/DIA-TEE-001.jpg
mockups-input/DIA-HOODIE-001.jpg
mockups-input/DIA-TRACKSUIT-001.jpg
```

Supported formats: `.jpg`, `.png`, `.webp`

### Step 2: Create Metadata File

Create a `.txt` file with same name:
```
mockups-input/DIA-TEE-001.txt
```

Content:
```
TITLE: Your Product Name
PRICE: 89
CATEGORY: tee
DESCRIPTION: What your product is. Keep it 2-3 sentences.
DESIGN_PROMPT: Minimal red and white. Clean aesthetic.
TARGET_AUDIENCE: Creators and discipline-focused humans
```

### Step 3: Run Conversion

```bash
npm run pod:from-mockup -- --sku DIA-TEE-001
```

System will:
1. ✓ Read your mockup image
2. ✓ Analyze design
3. ✓ Generate embroidery specs
4. ✓ Generate product copy
5. ✓ Sync to Printful
6. ✓ Publish to store
7. ✓ Deploy to live site

### Example Files

See `MOCKUP_EXAMPLE.txt` for template.

---

## Batch Processing

Add multiple mockups + metadata files, then:

```bash
npm run pod:from-mockups:all
```

Processes all and publishes in batch.

---

## File Naming Convention

Use SKU as filename:
```
mockups-input/
├── DIA-TEE-001.jpg
├── DIA-TEE-001.txt
├── DIA-HOODIE-001.png
├── DIA-HOODIE-001.txt
└── DIA-TRACKSUIT-001.jpg
└── DIA-TRACKSUIT-001.txt
```

System matches .jpg with .txt by SKU.
