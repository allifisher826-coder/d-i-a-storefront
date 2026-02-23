# 🛍️ Store Setup & Launch Guide

**Part of the D.I.A. system. See [COMPLETE_BUILD_SUMMARY.md](COMPLETE_BUILD_SUMMARY.md) for full system overview and unit economics.**

## What's Built

✅ **Full e-commerce store** (store.html)
✅ **Shopping cart** with size selection
✅ **Stripe payment integration** (serverless)
✅ **Order confirmation page**
✅ **Printful fulfillment automation**
✅ **Webhook system** for order handling

---

## Store Features

### Frontend (store.html)
- Product catalog from `data/products.json`
- Size/color selection per product
- Shopping cart with persistent state
- Stripe card checkout
- Order confirmation
- Mobile responsive

### Backend (Netlify Functions)
- **create-payment-intent.js** → Creates Stripe payment intents
- **stripe-webhook.js** → Handles payment success → Creates Printful orders

### Workflow
```
Customer browses → Adds to cart → Checkout
   ↓
Stripe charges card
   ↓
Webhook triggered
   ↓
Order sent to Printful
   ↓
Printful fulfills automatically
   ↓
Customer receives shipment
```

---

## One-Time Setup (First Time Only)

### 1. Get API Keys

**Stripe:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Secret Key" (starts with `sk_live_`)
3. Copy "Publishable Key" (starts with `pk_live_`)
4. Get webhook secret from https://dashboard.stripe.com/webhooks

**Printful:**
1. Go to https://www.printful.com/settings/api
2. Generate API token
3. Copy Store ID from dashboard

### 2. Set Environment Variables in Netlify

Go to: **Netlify Dashboard → Settings → Environment Variables**

Add these:
```
STRIPE_API_KEY              = sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY      = pk_live_your_public_key
STRIPE_WEBHOOK_SECRET       = whsec_your_webhook_secret
PRINTFUL_API_TOKEN          = your_api_token
PRINTFUL_STORE_ID           = your_store_id
```

### 3. Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://doitanyways.netlify.app/.netlify/functions/stripe-webhook`
3. Events to listen: `payment_intent.succeeded`
4. Copy signing secret and add to env vars as `STRIPE_WEBHOOK_SECRET`

### 4. Add Stripe Key to Store

Edit `store.html` - add to `<head>`:
```html
<meta name="stripe-key" content="pk_live_your_public_key">
```

---

## Deploy Store

```bash
# Commit all changes
git add -A
git commit -m "🛍️ Complete e-commerce store with Stripe + Printful"
git push origin main

# Netlify auto-deploys
# Check: https://app.netlify.com/sites/doitanyways/deploys
```

Store goes live at: https://doitanyways.netlify.app/store.html

---

## Files Created

| File | Purpose |
|------|---------|
| **store.html** | Full e-commerce storefront |
| **.netlify/functions/create-payment-intent.js** | Stripe payment API |
| **.netlify/functions/stripe-webhook.js** | Webhook for order fulfillment |
| **order-confirmation.html** | Order confirmation page |
| **netlify.toml** | Updated with function routes |

---

## Testing (Staging)

Before going live, test with Stripe test keys:

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

1. Use test API keys from https://dashboard.stripe.com/test/apikeys
2. Test checkout flow
3. Check Printful receives test order
4. Verify webhook triggers

---

## Product Management

### Add Product to Store

1. Edit `data/products.json`
2. Add new product (copy existing format)
3. Include `stripe_price_id` if available
4. Set `published: true`
5. Push to main → Auto-deploys

Example:
```json
{
  "sku": "DIA-TEE-002",
  "title": "New Product",
  "price": 65,
  "category": "tee",
  "description": "Product description",
  "sizes": ["XS", "S", "M", "L", "XL", "2XL"],
  "stripe_price_id": null,
  "published": true
}
```

### Update Product

1. Edit `data/products.json`
2. Change fields needed
3. Push → Auto-updates on store

### Publish/Unpublish

Set `"published": true` or `"published": false` in catalog.

---

## Live Operations

### Monitor Orders

**Stripe Dashboard:**
- https://dashboard.stripe.com/payments
- See all transactions
- Issue refunds if needed

**Printful Dashboard:**
- https://www.printful.com/orders
- See fulfillment status
- Track shipments

**Netlify Functions:**
- https://app.netlify.com/sites/doitanyways/functions
- Monitor API calls
- Check error logs

---

## Revenue Flow

```
Customer pays via Stripe
↓
$55.00 charged to card
↓
Stripe fee: ~1.5% ($0.83)
↓
Your net: $54.17 per sale
↓
Printful cost: $18.00
↓
Your profit: $36.17 per shirt
↓
$0 manual work
```

---

## Troubleshooting

### "Payment failed"
- Check STRIPE_API_KEY is set in Netlify
- Verify Stripe keys are correct
- Check Stripe dashboard for errors

### "Order not appearing in Printful"
- Check PRINTFUL_API_TOKEN is set
- Verify webhook is working: https://dashboard.stripe.com/webhooks
- Check Netlify function logs

### Store not showing products
- Verify `data/products.json` is valid JSON
- Check `published: true` on products
- Clear browser cache

### Payment intent endpoint 404
- Verify netlify.toml has function routes
- Check `.netlify/functions/` folder exists
- Redeploy: push to main

---

## Next Steps

1. ✅ Get API keys (Stripe, Printful)
2. ✅ Set environment variables in Netlify
3. ✅ Configure Stripe webhook
4. ✅ Test with test keys
5. ✅ Update to live keys
6. ✅ Promote on social media
7. ✅ Watch orders come in

---

## Live Store URLs

- **Store:** https://doitanyways.netlify.app/store.html
- **Order Confirmation:** https://doitanyways.netlify.app/order-confirmation.html
- **Git Repo:** https://github.com/allifisher826-coder/d-i-a-storefront

---

**Questions?** Check:
- Stripe docs: https://stripe.com/docs
- Printful API: https://www.printful.com/docs
- Netlify Functions: https://docs.netlify.com/functions/overview
