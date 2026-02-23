# 🚀 NETLIFY DEPLOYMENT GUIDE — D.I.A. STOREFRONT

**Get your site live in 15 minutes**

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` works locally
- [ ] No console errors (F12 → Console)
- [ ] Cart functionality works
- [ ] Mobile view looks correct
- [ ] `.env` file is created (with your API keys)
- [ ] `.gitignore` excludes `.env` (keep API keys safe)

---

## 🔑 Step 1: Get Your API Keys (5 min)

You need these before deploying:

### Stripe
1. Go to: **https://stripe.com**
2. Sign up (or login)
3. Navigate to: **Developers** → **API Keys**
4. Copy these keys:
   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)
   - **Webhook Secret** (from Webhooks section)

### Printful
1. Go to: **https://printful.com**
2. Sign up (or login)
3. Navigate to: **Account** → **API**
4. Copy: **API Token**

### Klaviyo (Optional)
1. Go to: **https://klaviyo.com**
2. Sign up (or login)
3. Navigate to: **Account** → **API Keys**
4. Copy: **Public API Key**

---

## 🏗️ Step 2: Configure Local Environment (2 min)

Create your `.env` file:

```bash
# In /Users/user/dia/
cp config/.env.example .env
```

Edit `.env` and add your keys:

```
STRIPE_PUBLIC_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

PRINTFUL_API_TOKEN=YOUR_TOKEN_HERE

KLAVIYO_API_KEY=pk_YOUR_KEY_HERE

NODE_ENV=production
SITE_URL=https://your-site.netlify.app
```

**⚠️ NEVER commit `.env` to Git.** It's already in `.gitignore`.

---

## 🔐 Step 3: Create Netlify Account (2 min)

1. Go to: **https://app.netlify.com**
2. Click: **Sign up**
3. Choose: **GitHub** (recommended) or **Email**
4. Verify email
5. Log in

---

## 🌐 Step 4: Deploy Site (3 min)

### Option A: Drag & Drop (Easiest)

1. In Netlify dashboard, drag the `/Users/user/dia` folder to the deploy area
2. Your site goes live instantly at a temporary URL
3. Skip to **Step 5** below

### Option B: Connect GitHub (Recommended)

1. Push code to GitHub:
   ```bash
   cd /Users/user/dia
   git init
   git add .
   git commit -m "Initial commit: D.I.A. storefront"
   git remote add origin https://github.com/YOUR_USERNAME/d-i-a-storefront
   git push -u origin main
   ```

2. In Netlify dashboard:
   - Click: **Add new site** → **Import an existing project**
   - Choose: **GitHub**
   - Select: **YOUR_USERNAME/d-i-a-storefront**
   - Click: **Deploy**

3. Netlify automatically deploys on every Git push

### Option C: Netlify CLI (For Developers)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# For production:
netlify deploy --prod
```

---

## 🔧 Step 5: Configure Environment Variables (3 min)

Your site is live but needs your API keys. Add them in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to: **Site settings** → **Build & deploy** → **Environment**
4. Click: **Add environment variable**
5. Add each key:

| Key | Value |
|-----|-------|
| STRIPE_PUBLIC_KEY | pk_live_... |
| STRIPE_SECRET_KEY | sk_live_... |
| STRIPE_WEBHOOK_SECRET | whsec_... |
| PRINTFUL_API_TOKEN | ... |
| KLAVIYO_API_KEY | pk_... |

6. Click: **Deploy site** (to apply changes)

---

## 🎯 Step 6: Test Live Site (2 min)

1. Go to your site URL: `https://your-site.netlify.app`
2. Test functionality:
   - [ ] Homepage loads
   - [ ] Products display
   - [ ] Cart works (add item)
   - [ ] Mobile view responsive
   - [ ] No console errors (F12)

---

## 🌍 Step 7: Custom Domain (Optional - 2 min)

Want `https://d-i-a-systems.com` instead of `.netlify.app`?

1. Purchase domain from:
   - GoDaddy, Namecheap, Google Domains, or similar

2. In Netlify dashboard:
   - **Site settings** → **Domain management**
   - Click: **Add custom domain**
   - Enter: `d-i-a-systems.com`
   - Netlify will guide you to update DNS records
   - SSL certificate automatically installed ✅

3. DNS setup typically takes 5-30 minutes

---

## ✅ Deployment Verification

After deployment, verify everything:

### Checklist
- [ ] Site loads at URL
- [ ] HTTPS works (lock icon in browser)
- [ ] Homepage displays correctly
- [ ] Products show with images
- [ ] Cart add/remove works
- [ ] Mobile view responsive
- [ ] No console errors
- [ ] Lighthouse score > 90 (optional but recommended)

### Run Lighthouse Audit
1. Open your site in Chrome
2. Press `F12` → **Lighthouse** tab
3. Click: **Analyze page load**
4. Aim for 90+ score

---

## 🔄 Continuous Deployment

Every time you push to GitHub, Netlify automatically deploys:

```bash
# Make changes locally
# Test with: npm run dev

# Commit and push
git add .
git commit -m "Update storefront"
git push origin main

# Netlify automatically deploys (watch dashboard)
```

---

## 🚨 Troubleshooting

### Site Shows "Page Not Found"
```
Solution:
1. Check netlify.toml exists in root
2. Verify index.html is in root directory
3. Netlify dashboard → Deploy logs (check for errors)
4. Try redeploying: netlify deploy --prod
```

### Styles Not Loading
```
Solution:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check Chrome DevTools → Network tab (any 404s?)
3. Verify Tailwind CSS CDN is accessible
4. Check netlify.toml cache headers
```

### API Not Working on Live Site
```
Solution:
1. Check environment variables are set in Netlify
2. Verify API keys are correct (copy-paste from Stripe/Printful)
3. Check CORS settings (may need to configure API endpoints)
4. View Netlify deploy logs for errors
```

### Deploy Fails
```
Solution:
1. View Netlify deploy logs (Dashboard → Deploys → click failed)
2. Check .env is in .gitignore (shouldn't commit secrets)
3. Verify all files are committed to Git
4. Check for missing dependencies in package.json
```

---

## 📊 Monitoring Your Site

After deployment, monitor:

### Daily
- [ ] Site is loading
- [ ] Check Netlify dashboard for errors
- [ ] Monitor Stripe dashboard for payments

### Weekly
- [ ] Review Netlify analytics
- [ ] Check Google Analytics (if set up)
- [ ] Monitor email logs (Klaviyo)
- [ ] Test checkout flow

### Monthly
- [ ] Run Lighthouse audit
- [ ] Review Core Web Vitals
- [ ] Check error logs
- [ ] Analyze sales data

---

## 🔄 Redeploy if Needed

To redeploy your site:

```bash
# Using GitHub (automatic on push)
git push origin main

# Using Netlify CLI
netlify deploy --prod

# Using Netlify dashboard
Dashboard → Deploys → Trigger deploy
```

---

## 🎯 Next Steps After Launch

1. **Set up analytics**
   - Google Analytics 4 (free)
   - Netlify Analytics (paid, optional)

2. **Configure email marketing**
   - Klaviyo abandoned cart recovery
   - Order confirmation emails
   - Customer feedback requests

3. **Launch social campaign**
   - Instagram (5-7 posts per week)
   - TikTok (3-4 videos per week)
   - Email list (warm outreach)

4. **Monitor performance**
   - Track conversion rate
   - Monitor site speed
   - Gather customer feedback

---

## 📞 Support

**Netlify Support**: https://support.netlify.com
**Stripe Dashboard**: https://dashboard.stripe.com
**Printful Dashboard**: https://printful.com/dashboard

---

## ✨ You're Live!

Your D.I.A. storefront is now on the internet.

**Website**: https://your-site.netlify.app
**Admin**: https://app.netlify.com

Share your link with the world.

**Systems > Willpower • Motion Creates Emotion • 5…4…3…2…1… GO**
