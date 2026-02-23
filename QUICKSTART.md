# QUICK START GUIDE

**Get your D.I.A. store running in 5 minutes**

---

## 🚀 Start Development (Right Now)

```bash
# Navigate to project
cd /Users/user/dia

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

That's it. Your storefront is live locally.

---

## 📝 Configure APIs (Before Going Live)

### 1. Create .env File
```bash
cp config/.env.example .env
```

### 2. Get API Keys

**Stripe** (Payments)
- Go to: https://stripe.com
- Signup → Developers → API Keys
- Copy `pk_live_...` to `STRIPE_PUBLIC_KEY`
- Copy `sk_live_...` to `STRIPE_SECRET_KEY`

**Printful** (Fulfillment)
- Go to: https://printful.com
- Signup → Account → API
- Copy token to `PRINTFUL_API_TOKEN`

### 3. Add to .env
```
STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
PRINTFUL_API_TOKEN=YOUR_TOKEN
```

---

## 🌐 Deploy (Free - Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Add environment variables in Netlify dashboard
# (Settings → Environment)
```

Your site goes live at: `https://your-site.netlify.app`

---

## ✅ Test Checkout

Use Stripe test cards:

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success ✅ |
| 4000 0000 0000 0002 | Declined ❌ |

---

## 📊 File Structure

```
/dia
├── index.html              ← Main storefront (LIVE)
├── package.json            ← Dependencies
├── .env                    ← Your secret keys
├── README.md               ← Full guide
├── SETUP_GUIDE.md          ← Deployment guide
├── STATUS_REPORT.md        ← What was fixed
│
├── config/                 ← Integration templates
│   ├── stripe.config.js
│   └── printful.config.js
│
└── public/images/          ← Product images
```

---

## 🔍 Debug Checklist

**Checkout not working?**
```
✅ Check .env has STRIPE_PUBLIC_KEY
✅ Check console (F12) for errors
✅ Check Stripe dashboard for webhook events
```

**Orders not submitting?**
```
✅ Check .env has PRINTFUL_API_TOKEN
✅ Check product variant IDs match Printful
✅ Check shipping address is complete
```

**Site slow?**
```
✅ Run Google Lighthouse (Chrome DevTools)
✅ Check image sizes (< 500KB)
✅ Reduce third-party scripts
```

---

## 📚 Full Documentation

- **README.md** - Project overview & structure
- **SETUP_GUIDE.md** - Complete deployment walkthrough
- **STATUS_REPORT.md** - What was fixed & next steps
- **config/stripe.config.js** - Stripe integration docs
- **config/printful.config.js** - Printful integration docs

---

## 🎯 Launch Checklist

- [ ] Run `npm install`
- [ ] Run `npm run dev` locally
- [ ] Create `.env` with API keys
- [ ] Deploy to Netlify
- [ ] Test checkout with test card
- [ ] Verify Printful order submission
- [ ] Launch social media campaign

---

## ⚡ You're Ready

Your store is:
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ Payment ready (Stripe)
- ✅ Fulfillment ready (Printful)
- ✅ Production ready

**5…4…3…2…1… GO**

---

Need help? See full guides in README.md or SETUP_GUIDE.md
