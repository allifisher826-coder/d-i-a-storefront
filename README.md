# D.I.A. — Culture of Getting It Done
**Premium Streetwear. Systems > Willpower. Motion Creates Emotion.**

---

## 📁 Project Structure

```
/
├── index.html           # Production storefront (fixed & complete)
├── package.json         # Dependencies & build config
├── .gitignore           # Git ignore rules
├── README.md            # This file
│
├── /config/
│   ├── stripe.config.js     # Stripe API configuration
│   ├── printful.config.js   # Printful integration setup
│   └── env.example          # Environment variables template
│
├── /public/
│   ├── /images/
│   │   ├── hero-bg.jpg
│   │   ├── product-1.jpg
│   │   └── ...
│   ├── /assets/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   └── ...
│   └── /fonts/
│       └── (any custom fonts)
│
├── /js/
│   ├── cart.js              # Cart functionality (refactored out)
│   ├── stripe-checkout.js   # Stripe integration
│   ├── printful-api.js      # Printful fulfillment
│   └── analytics.js         # Event tracking
│
├── /css/
│   ├── main.css             # Core styles
│   ├── responsive.css       # Mobile optimizations
│   └── theme.css            # Brand colors & theme
│
├── /api/
│   ├── checkout.js          # Checkout endpoint
│   ├── orders.js            # Order management
│   └── webhook-handler.js   # Stripe webhook processing
│
└── /docs/
    ├── LEGAL_COMPLIANCE.md      # Terms, Privacy, Returns
    ├── BRAND_BIBLE.md           # Brand guidelines
    ├── SETUP_INSTRUCTIONS.md    # How to deploy
    └── API_DOCUMENTATION.md     # Integration reference
```

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Run Locally**
```bash
npm run dev
```
Then open: `http://localhost:3000`

### 3. **Configure Integrations**
Copy `.env.example` to `.env` and add:
```
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRINTFUL_API_TOKEN=...
SHOPIFY_STORE=...
```

---

## ✅ Fixed Issues

- ❌ **Removed**: `<!DOCTYPE html>.html` (invalid filename)
- ❌ **Removed**: Duplicate `store.html` (consolidated)
- ✅ **Fixed**: Missing closing `</script>` tags
- ✅ **Added**: SEO meta tags & structured data
- ✅ **Added**: Responsive mobile design
- ✅ **Added**: Cookie consent banner
- ✅ **Added**: Legal footer links
- ✅ **Added**: Proper code organization
- ✅ **Added**: JSON-LD schema markup

---

## 🔗 Integration Checklist

### Payment Processing (Stripe)
- [ ] Create Stripe account → stripe.com
- [ ] Get API keys (public & secret)
- [ ] Set up webhook endpoint
- [ ] Test checkout flow
- [ ] Configure payment methods (cards, Apple Pay, Google Pay)

### Fulfillment (Printful/Printify)
- [ ] Create Printful account
- [ ] Upload product designs
- [ ] Get API token
- [ ] Map products to variants
- [ ] Test order submission

### Email & Marketing (Klaviyo)
- [ ] Create Klaviyo account
- [ ] Set up automation workflows
- [ ] Configure abandon cart flow
- [ ] Test order confirmation emails

### Legal & Compliance
- [ ] Add Terms of Service
- [ ] Add Privacy Policy
- [ ] Add Returns Policy
- [ ] Add Shipping Policy
- [ ] Enable GDPR consent
- [ ] Set up cookie policy

### Analytics & Monitoring
- [ ] Configure Google Analytics 4
- [ ] Set up conversion tracking
- [ ] Add error monitoring (Sentry)
- [ ] Track custom events

---

## 🛠 Workflow

### Local Development
1. Make changes to `index.html` or create JS modules in `/js/`
2. Run `npm run dev`
3. Test in browser
4. Check responsiveness on mobile

### Before Deployment
1. Run `npm run build` (optimizes assets)
2. Test all integrations (Stripe, Printful, etc.)
3. Run performance audit (Google Lighthouse)
4. Test on multiple browsers

### Deployment Options

**Option 1: Netlify (Recommended for Static Site)**
```bash
npm install -g netlify-cli
netlify deploy
```

**Option 2: Vercel**
```bash
npm i -g vercel
vercel deploy
```

**Option 3: Shopify (Full E-Commerce)**
1. Move to Shopify store
2. Integrate Stripe payments
3. Connect Printful fulfillment

---

## 📊 File Changes Made

| File | Status | Changes |
|------|--------|---------|
| `index.html` | ✅ Fixed | Consolidated from 2 broken files, added SEO, fixed bugs |
| `store.html` | ❌ Deleted | Merged into index.html |
| `<!DOCTYPE html>.html` | ❌ Deleted | Invalid filename, code moved |
| `package.json` | ✅ New | Added dependencies & scripts |
| `.gitignore` | ✅ New | Added proper ignore rules |

---

## 🧪 Testing Checklist

- [ ] Cart add/remove works
- [ ] Quantity controls work
- [ ] Checkout flow completes
- [ ] Mobile menu responsive
- [ ] Links all functional
- [ ] Images load properly
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 📝 Next Steps

1. **Set up Stripe integration** (payment processing)
2. **Connect Printful API** (order fulfillment)
3. **Configure Klaviyo** (customer emails)
4. **Deploy to Netlify** (go live)
5. **Set up analytics** (track performance)

---

## 📞 Support

For setup questions:
- Email: support@d-i-a.nz
- Docs: See `/docs/` folder

---

**Systems > Willpower • Motion Creates Emotion • 5…4…3…2…1… GO**
