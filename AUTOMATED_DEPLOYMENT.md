# 🚀 Automated Product Launch

**Part of the D.I.A. system. See [COMPLETE_BUILD_SUMMARY.md](COMPLETE_BUILD_SUMMARY.md) for full system overview.**

## How It Works

1. **You add product to catalog** (`data/products.json` or mockup to `mockups-input/`)
2. **Push to GitHub** (`git push origin main`)
3. **GitHub Actions runs automatically:**
   - ✅ Generates mockups (Printful API)
   - ✅ Creates Stripe product + pricing
   - ✅ Syncs to Printful (fulfillment)
   - ✅ Publishes to store
   - ✅ Deploys to Netlify
4. **Live in ~5 minutes** on doitanyways.netlify.app

## Setup Required (One-Time)

### In GitHub (Secrets)

Go to: **Settings → Secrets and variables → Actions**

Add these secrets:

```
STRIPE_API_KEY              = sk_live_your_key
STRIPE_PUBLISHABLE_KEY      = pk_live_your_key
PRINTFUL_API_TOKEN          = your_printful_token
PRINTFUL_STORE_ID           = your_store_id
NETLIFY_AUTH_TOKEN          = your_netlify_token
NETLIFY_SITE_ID             = your_site_id
```

### Get Your Keys

**Stripe:**
- https://dashboard.stripe.com/apikeys
- Copy "Secret key" and "Publishable key"

**Printful:**
- https://www.printful.com/settings/api
- Generate API token
- Copy Store ID from dashboard

**Netlify:**
- https://app.netlify.com/user/applications/personal-access-tokens
- Create personal access token
- Get Site ID from Netlify dashboard

## Product Workflow

### Add New Product

```bash
# 1. Edit your product catalog
nano data/products.json

# 2. Add your product (copy existing format)

# 3. Push to GitHub
git add data/products.json
git commit -m "Add new product: DIA-TEE-002"
git push origin main

# Result: GitHub Actions runs automatically
#         Product published in ~5 minutes
```

### Add Multiple Products (Batch)

```bash
# 1. Add multiple products to data/products.json

# 2. Push once
git push origin main

# Result: All products published together
```

## Real-Time Monitoring

- **GitHub Actions:** https://github.com/allifisher826-coder/d-i-a-storefront/actions
- **Netlify Deploys:** https://app.netlify.com/sites/doitanyways/deploys
- **Live Store:** https://doitanyways.netlify.app

## What Each Stage Does

| Stage | Purpose | Time |
|-------|---------|------|
| **Mockups** | Generates product images from designs | 30s |
| **Stripe** | Creates product + pricing in Stripe | 15s |
| **Printful Sync** | Sets up product for fulfillment | 20s |
| **Store Publish** | Adds buy button to store | 10s |
| **Deploy** | Pushes live to Netlify | 45s |
| **Total** | Completely automated | ~2 min |

## Revenue Flow

```
New Product Added
       ↓
GitHub Push
       ↓
Actions Pipeline Runs
       ↓
Live on Store
       ↓
Customer Buys
       ↓
Stripe Charges
       ↓
Printful Fulfills
       ↓
Money in Your Account
```

**Completely automated. Zero manual steps.**

## Monitoring Products

Check live products:
```bash
# View all products in catalog
cat data/products.json | jq '.[].title'

# Check which products are published
cat data/products.json | jq '.[] | select(.published == true) | .title'
```

## Troubleshooting

**Product didn't publish?**
- Check GitHub Actions: https://github.com/allifisher826-coder/d-i-a-storefront/actions
- Check Netlify logs: https://app.netlify.com/sites/doitanyways/deploys
- Check secrets are set correctly in GitHub

**Stuck in pending?**
- GitHub Actions may need auth - check runner status
- Netlify may need deploy key - regenerate if needed

## Next Steps

1. Set secrets in GitHub (see above)
2. Add product to `data/products.json`
3. Push to main
4. Watch it go live automatically
5. Repeat for each product

That's it. You've got a completely automated product publishing system.

---

**Questions?** Check:
- `/github/workflows/product-pipeline.yml` - The automation
- `package.json` - Available commands
- `data/products.json` - Product format
