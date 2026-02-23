# D.I.A. Systems — Complete Setup & Deployment Guide

**Everything you need to go from development to production.**

---

## 📋 Table of Contents

1. [Pre-Launch Checklist](#pre-launch-checklist)
2. [Local Development Setup](#local-development-setup)
3. [API Integration Guide](#api-integration-guide)
4. [Deployment Options](#deployment-options)
5. [Payment Processing](#payment-processing)
6. [Order Fulfillment](#order-fulfillment)
7. [Marketing Automation](#marketing-automation)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Launch Checklist

### Phase 1: Foundation (Week 1)
- [ ] **Business Registration**
  - [ ] Register company (NZ Limited Company)
  - [ ] Get ABN/company number
  - [ ] Register for GST (if applicable)
  
- [ ] **Domain & Email**
  - [ ] Purchase domain (d-i-a-systems.com)
  - [ ] Set up business email (support@d-i-a-systems.com)
  - [ ] Configure DNS records

- [ ] **Legal Documents**
  - [ ] Add Terms of Service
  - [ ] Add Privacy Policy (GDPR compliant)
  - [ ] Add Returns Policy
  - [ ] Add Shipping Policy
  - [ ] Add Cookie Policy

### Phase 2: Payments (Week 2)
- [ ] **Stripe Setup**
  - [ ] Create Stripe account (stripe.com)
  - [ ] Verify business details
  - [ ] Get API keys
  - [ ] Configure webhook URLs
  - [ ] Set up payment methods

- [ ] **Testing**
  - [ ] Use Stripe test cards
  - [ ] Test full checkout flow
  - [ ] Verify webhook events

### Phase 3: Fulfillment (Week 3)
- [ ] **Printful Integration**
  - [ ] Create Printful account
  - [ ] Upload designs & configure products
  - [ ] Get API token
  - [ ] Map products to variants
  - [ ] Test order submission

- [ ] **Testing**
  - [ ] Submit test order
  - [ ] Track order status
  - [ ] Verify customer notifications

### Phase 4: Marketing (Week 4)
- [ ] **Email Marketing**
  - [ ] Set up Klaviyo account
  - [ ] Create automation flows
  - [ ] Configure order confirmation email
  - [ ] Set up abandoned cart recovery

- [ ] **Analytics**
  - [ ] Set up Google Analytics 4
  - [ ] Configure conversion tracking
  - [ ] Add event tracking

---

## 🛠 Local Development Setup

### Requirements
- Node.js 16+ (download from nodejs.org)
- Git
- A code editor (VS Code recommended)

### Installation

```bash
# 1. Clone or download the project
cd /Users/user/dia

# 2. Install dependencies
npm install

# 3. Create .env file (copy from config/.env.example)
cp config/.env.example .env

# 4. Add your API keys to .env
# Edit .env and fill in:
# - STRIPE_PUBLIC_KEY
# - STRIPE_SECRET_KEY
# - PRINTFUL_API_TOKEN
# - etc.

# 5. Start development server
npm run dev
```

Then open: **http://localhost:3000**

### File Structure

```
/dia
├── index.html              ← Main storefront
├── package.json            ← Dependencies
├── .env                    ← Your API keys (NEVER commit this)
├── .gitignore              ← Files to ignore in Git
│
├── config/
│   ├── .env.example        ← Template for .env
│   ├── stripe.config.js    ← Stripe integration
│   └── printful.config.js  ← Printful integration
│
├── js/
│   └── (modular JS modules)
│
└── api/
    ├── checkout.js         ← Stripe checkout endpoint
    └── webhooks.js         ← Webhook handlers
```

---

## 🔗 API Integration Guide

### Step 1: Get API Keys

#### Stripe
1. Go to **stripe.com** → Sign up
2. Navigate to **Developers** → **API Keys**
3. Copy **Publishable Key** (starts with `pk_`)
4. Copy **Secret Key** (starts with `sk_`)
5. Go to **Webhooks** → Add webhook
   - URL: `https://yoursite.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`

#### Printful
1. Go to **printful.com** → Sign up
2. Navigate to **Account** → **API**
3. Copy your API Token
4. Enable Webhooks for order updates

#### Klaviyo (Optional)
1. Go to **klaviyo.com** → Sign up
2. Navigate to **Account** → **API Keys**
3. Copy **Public API Key**

### Step 2: Configure .env

Create a `.env` file in your project root:

```bash
# Copy from config/.env.example
cp config/.env.example .env

# Edit .env and add your keys:
STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

PRINTFUL_API_TOKEN=YOUR_TOKEN

KLAVIYO_API_KEY=pk_YOUR_KEY

NODE_ENV=production
SITE_URL=https://d-i-a-systems.com
```

### Step 3: Test Integration

```bash
# Run test checkout
npm run test

# Check webhook delivery
# Go to Stripe dashboard → Webhooks → View endpoint
```

---

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Free)

**Best for**: Static site with serverless functions

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Create functions directory (for webhooks)
mkdir netlify/functions

# 3. Deploy
netlify deploy

# 4. Configure environment variables
# Go to Netlify dashboard → Site settings → Build & deploy → Environment
# Add your .env variables there
```

### Option 2: Vercel

**Best for**: Next.js or API-heavy projects

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
```

### Option 3: Shopify (Full Commerce)

**Best for**: Full e-commerce platform with advanced features

1. Create Shopify store at **shopify.com**
2. Use "Online Store 2.0" theme
3. Install apps:
   - Stripe payment processor
   - Printful fulfillment
   - Klaviyo email marketing
4. Upload products & collections

---

## 💳 Payment Processing

### Stripe Checkout Flow

```
1. Customer clicks "Checkout Now"
   ↓
2. Cart data sent to /api/create-checkout-session
   ↓
3. Server creates Stripe checkout session
   ↓
4. Customer redirected to Stripe Checkout page
   ↓
5. Payment captured (Stripe handles PCI compliance)
   ↓
6. Webhook sent to /api/webhooks/stripe
   ↓
7. Order submitted to Printful
   ↓
8. Confirmation email sent via Klaviyo
```

### Test Cards (Stripe)

| Card Number | Exp | CVC | Outcome |
|---|---|---|---|
| 4242 4242 4242 4242 | 12/25 | 123 | Success |
| 4000 0000 0000 0002 | 12/25 | 123 | Declined |
| 4000 0025 0000 3155 | 12/25 | 123 | 3D Secure |

---

## 📦 Order Fulfillment

### Printful Integration Flow

```
1. Order placed in D.I.A. store
   ↓
2. Stripe webhook confirms payment
   ↓
3. Order submitted to Printful API
   ↓
4. Printful receives order
   ↓
5. Product printed & quality checked
   ↓
6. Shipped to customer
   ↓
7. Tracking number sent to customer
```

### Product Mapping

Map your product IDs to Printful variant IDs:

```javascript
// In config/printful.config.js
productVariantMap: {
  "1": 4001,  // Signature Systems Tracksuit
  "2": 4002,  // Culture of Discipline Hoodie
  "3": 4003,  // Mineral Wash Performance Shorts
  "4": 4004   // Do It Anyway Oversized Tee
}
```

To find Printful variant IDs:
1. Log into Printful
2. Go to Products
3. Click each product
4. Find the variant ID in the URL or product details

---

## 📧 Marketing Automation

### Klaviyo Email Flows

#### 1. Order Confirmation
- **Trigger**: `checkout.session.completed`
- **Email**: Order summary, shipping info, tracking link
- **Delay**: Immediate

#### 2. Abandoned Cart Recovery
- **Trigger**: User starts checkout but doesn't complete
- **Email 1**: "You left something behind" (2 hours later)
- **Email 2**: "Final reminder" (24 hours later)
- **Discount**: Consider offering 10% off

#### 3. Post-Purchase Follow-up
- **Email 1**: "Your order is on the way" (2 days)
- **Email 2**: "Share your feedback" (7 days)
- **Email 3**: "Here's 10% off your next order" (14 days)

---

## 🔍 Monitoring & Maintenance

### Daily Checks
- [ ] Check sales dashboard
- [ ] Monitor Slack/email for errors
- [ ] Check Stripe for failed payments
- [ ] Verify Printful orders are submitted

### Weekly Checks
- [ ] Review customer feedback
- [ ] Check website performance (Google Lighthouse)
- [ ] Monitor email bounce rates
- [ ] Update inventory if needed

### Monthly Tasks
- [ ] Analyze sales data
- [ ] Review customer segments
- [ ] Update product descriptions
- [ ] Test checkout flow
- [ ] Review analytics

### Error Monitoring

Add error tracking (optional):

```bash
npm install @sentry/node
```

Then in your code:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## 📊 Performance Checklist

- [ ] **Lighthouse Score**: Aim for 90+
  - Run: Google Lighthouse in Chrome DevTools
  
- [ ] **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - INP (Interaction to Next Paint): < 200ms
  - CLS (Cumulative Layout Shift): < 0.1

- [ ] **Mobile Testing**:
  - Test on iPhone, Android
  - Test with 4G connection
  - Test buttons/links for touch

---

## 🐛 Troubleshooting

### Checkout Not Working
```
Check:
1. Stripe API keys are correct in .env
2. CORS is configured properly
3. Webhook URL is registered in Stripe
4. Browser console for errors (F12)
```

### Orders Not Submitting to Printful
```
Check:
1. Printful API token is valid
2. Product variant IDs match actual Printful IDs
3. Shipping address is complete
4. Printful webhooks are enabled
```

### Emails Not Sending
```
Check:
1. Klaviyo API key is correct
2. Email list is set up
3. Automation workflow is activated
4. Check spam folder
```

---

## 🎯 Next Steps

1. **Complete Phase 1-4** in Pre-Launch Checklist
2. **Deploy to Netlify** (or your chosen platform)
3. **Test full checkout** with real payment method
4. **Monitor for 48 hours** before major marketing push
5. **Launch social media campaign**

---

## 📞 Support

- **Stripe Support**: stripe.com/support
- **Printful Support**: printful.com/support
- **Klaviyo Support**: klaviyo.com/help
- **Your Email**: support@d-i-a-systems.com

---

**Systems > Willpower • Motion Creates Emotion • 5…4…3…2…1… GO**
