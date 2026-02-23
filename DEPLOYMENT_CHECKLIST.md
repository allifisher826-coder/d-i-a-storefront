# PRE-DEPLOYMENT CHECKLIST

Use this before going live on Netlify.

---

## ✅ CODE QUALITY

- [ ] No console errors (`npm run dev` → F12 → Console)
- [ ] No warnings in build
- [ ] All links functional
- [ ] Images load correctly
- [ ] Cart add/remove works
- [ ] Checkout flow completes

---

## ✅ MOBILE & RESPONSIVE

- [ ] iPhone: Homepage responsive
- [ ] Android: All features work
- [ ] Tablet: Layout correct
- [ ] Touch targets > 44px
- [ ] No horizontal scrolling

---

## ✅ SECURITY

- [ ] `.env` created locally
- [ ] `.gitignore` includes `.env`
- [ ] No API keys in code
- [ ] All links use HTTPS
- [ ] No insecure mixed content

---

## ✅ PERFORMANCE

- [ ] Run Google Lighthouse
- [ ] Aim for 90+ score
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1

---

## ✅ SEO & META

- [ ] Page title correct
- [ ] Meta description present
- [ ] Open Graph tags valid
- [ ] Favicon appears
- [ ] Canonical URL set

---

## ✅ API KEYS READY

- [ ] Stripe Public Key obtained
- [ ] Stripe Secret Key obtained
- [ ] Stripe Webhook Secret obtained
- [ ] Printful API Token obtained
- [ ] Keys NOT in version control

---

## ✅ GIT SETUP

- [ ] Git initialized (`git init`)
- [ ] `.gitignore` configured
- [ ] Initial commit made
- [ ] GitHub repo created (optional but recommended)
- [ ] Remote added (if using GitHub)

---

## ✅ NETLIFY ACCOUNT

- [ ] Netlify account created
- [ ] Email verified
- [ ] Logged into Netlify dashboard

---

## ✅ DEPLOYMENT READY

- [ ] `netlify.toml` created
- [ ] `package.json` configured
- [ ] All files committed to Git
- [ ] No uncommitted changes

---

## ✅ POST-DEPLOYMENT

- [ ] Site loads at Netlify URL
- [ ] HTTPS works (lock icon)
- [ ] Environment variables added to Netlify
- [ ] Test functionality works
- [ ] Google Analytics configured (optional)
- [ ] Monitoring enabled

---

## 🎯 READY TO DEPLOY?

If all boxes checked:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Then add environment variables in Netlify dashboard:
- STRIPE_PUBLIC_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- PRINTFUL_API_TOKEN

Your site goes live! 🚀
