# D.I.A. (Culture of Discipline) - Complete Build Specification
## Master Implementation Roadmap (2026)

**Single Source of Truth:** This repository contains the complete D.I.A. brand operating system — visual identity, product engineering, e-commerce, and the mobile app that makes discipline the path of least resistance.

---

## 🎯 Project Scope

**What We're Building:**
- ✅ Visual Identity System (logos, typography, color palette)
- ✅ Shopify Hydrogen Storefront (brutalist dark commerce)
- ✅ React Native Mobile App (iOS/Android unified)
- ✅ Habit Engine (Uniform Activation Tracker)
- ✅ Community & Philosophy Core
- ✅ AR Try-On Integration
- ✅ Printful POD Integration

**Philosophy:** Not selling clothing. Selling Environmental Design + Choice Architecture. The uniform triggers the 5-Second Rule to override Biological Mutiny.

---

## 📐 Phase 1: Visual Identity System (Foundation)

### Color Palette
```
--dia-black: #0A0A0A (Deep Black)
--dia-charcoal: #1C1C1C (Charcoal)
--dia-red: #E30613 (Signal Red - Accent Only)
--dia-white: #FFFFFF (Stark White)
```

### Typography System
```
Aggression Layer: Old English / Blackletter
  - Font: Old English Text / Cloister Black
  - Color: Signal Red (#E30613)
  - Use: "D.I.A." logo, primary brand mark

Philosophy Layer: Flowing Script
  - Font: Bodoni / Copperplate
  - Color: Stark White (#FFFFFF)
  - Use: "DISCIPLINE", "CULTURE OF DISCIPLINE", "PATH OF MOST RESISTANCE"

UI Layer: Brutalist Condensed
  - Font: Bebas Neue / Druk Wide
  - Color: White with red accents
  - Use: All UI, navigation, CTAs
```

### Logo Lockups (3 Primary)

1. **Primary Wordmark**
   - Signal Red Old English "D.I.A." (stamped metal texture, rivets on periods)
   - Intersecting Stark White script "DISCIPLINE" below
   - Use: Header logo, hero section

2. **Monogram Emblem**
   - Interlocking geometric "DIA" in red Old English
   - Inside brutalist hexagon with rivets
   - Small white script "CULTURE OF DISCIPLINE"
   - Use: Left chest embroidery, favicon, app icon

3. **Anchor Symbol**
   - Heavy industrial anchor fused with red "D.I.A."
   - Chain links, white script "5-SECOND OVERRIDE"
   - Use: Back print, activation trigger, app UI accent

### Logo Sizing (Printful-Ready)
- Left Chest Embroidery: 3–3.5 inches
- Center Chest: 5–7 inches
- Full Back Print: 11 inches
- Sleeve Hit: 2–3 inches
- Inside Neck Label: 2 inches

---

## 👕 Phase 2: Product Engineering (Drop 001)

### Fabric & Fit Specifications

**Tees (DIA-TEE Series)**
- Weight: 250+ GSM 100% cotton
- Fit: Oversized boxy, dropped shoulders (Industrial)
- Base Colors: Garment-dyed vintage blacks & charcoals (acid-wash/shadow)
- Graphics: Stark White script + Signal Red Old English
- Sizes: XS–3XL
- Price: $55–$85

**Hoodies (DIA-HOODIE Series)**
- Weight: 450+ GSM ultra-heavyweight fleece
- Fit: Boxy high-mobility (same as tees)
- Base Colors: Garment-dyed vintage blacks
- Graphics: Stark White + Signal Red only
- Sizes: XS–3XL
- Price: $155–$185

**Tracksuits (DIA-TRACKSUIT Series)**
- Weight: 400+ GSM Japanese fleece blend
- Fit: Oversized, true to size
- Colors: Black with red/white stripes (architectural)
- Sizes: XS–2XL
- Price: $299–$349

### Signature Drop 001 SKUs

1. **DIA-TEE-001: Biological Mutiny Tee**
   - Front: Center red "BIOLOGICAL MUTINY" with crossed brain
   - Back: White "PATH OF MOST RESISTANCE"
   - Sleeve: Red "NO EXCUSES"
   - Price: $55

2. **DIA-HOODIE-001: Core Activator**
   - Front: Small left-chest red "D.I.A." monogram
   - Back: Large white "CULTURE OF DISCIPLINE"
   - Price: $165

3. **DIA-SYSTEM-000: Foundational Vintage Tee** (Ready)
   - Front: Small left-chest red "D.I.A." embroidery
   - Back: White "DO IT ANYWAY" + red Old English "D.I.A."
   - Acid-wash charcoal
   - Price: $55

### Photography Standards (6–8 images per SKU)
- Cinematic lifestyle: Athlete in warehouse/gym putting on garment
- Studio flat lays on concrete
- Extreme close-ups (fabric, embroidery stitches)
- On-body back views
- 360 spin + fit video
- Warehouse/minimalist environment only

---

## 🛒 Phase 3: Shopify Hydrogen Storefront (Web)

### Tech Stack
```
Frontend: Hydrogen (React) + Tailwind CSS
Backend: Shopify Storefront GraphQL API
Payments: Stripe
Fulfillment: Printful API (zero inventory)
Hosting: Netlify / Vercel
```

### Store Architecture

**Homepage Flow**
1. Sticky Navigation (DIA monogram logo left, cart right)
2. Cinematic Hero ("Activate in 5 seconds" + warehouse athlete video)
3. Featured Uniforms 4-column grid
4. The Doctrine Section (Philosophy cards)
5. Engineered Specs Badges (450 GSM, Boxy Fit, No Excuses Policy)
6. Community Activation Feed (UGC preview)
7. Footer (Philosophy statement, links, newsletter)

**Product Page**
- High-res images (6–8 per product)
- "Activation Ritual" tab linking garment to 5-Second Rule
- Size guide + fit selector
- AR Try-On button
- Testimonials from early adopters
- Philosophy narrative
- Price + Add to Cart (red CTA)

**Policies**
- No returns/exchanges for buyer's remorse or sizing errors
- Replacements only for verified defects within 5 days of delivery
- 7–14 day standard shipping
- Statement descriptor: "DIA* DISCIPLINE" (appears on all charges)

**Design System**
- Dark brutalist concrete texture background
- Red CTAs only (never blue)
- Philosophy-first storytelling
- 1400px max width container
- Mobile-optimized (stacked 1 column)
- Font: Bebas Neue (UI), Copperplate (philosophy), monospace (specs)

---

## 📱 Phase 4: React Native Mobile App (iOS/Android)

### Core Architecture
```
Frontend: React Native (Expo/React Native CLI)
Shared Components: React components (web + app)
Backend: Firebase / Supabase
Shop Integration: Shopify Storefront API
Notifications: Firebase Cloud Messaging
Database: Firestore
```

### Must-Have Features (MVP → Full)

#### 1. Uniform Activation Tracker (THE CORE)
- Daily "Activate" button: "I put on my D.I.A. uniform"
- 5-second timer animation (countdown)
- Automatic streak counter (consecutive days)
- Haptic feedback on completion
- Visual celebration (confetti, red flash)
- Ties to physical product (NFC/label scan in Phase 2)
- Persistence: Saves to Firestore with timestamp

**Data Model:**
```javascript
activations: {
  userId: {
    dailyActivations: [
      { date: "2026-02-23", timestamp: 1708614000 },
      { date: "2026-02-22", timestamp: 1708527600 },
    ],
    currentStreak: 47,
    longestStreak: 127,
  }
}
```

#### 2. Discipline Vault (Philosophy + Progress)
- Private journal: "What resistance did I override today?"
- Philosophy feed: Daily 60-second manifesto excerpts
- Progress dashboard:
  - Heatmap (calendar view of activations)
  - 5-Second Rule completion % (weekly/monthly)
  - Identity statements ("I am someone who...")
  - Personal wins gallery

**Screen Layout:**
```
Top: Navigation (Vault | Shop | Community | Profile)
Main: Heatmap calendar + stats
Actions: + New Entry (journal)
Philosophy Card: Daily manifesto excerpt (rotates)
Bottom: Tab bar navigation
```

#### 3. Shop Uniforms (Seamless Integration)
- Full Shopify catalog inside app
- AR Try-On button on every product (Wearfits/GlamAR)
- "Add to Uniform" bundles (pre-configured sets)
- Cart persists across web/app
- Stripe checkout native flow
- Order history + tracking

#### 4. Culture Community
- Anonymous or named activation moments feed
- "30-Day No Excuses" group challenges
- Leaderboards (opt-in, weekly/monthly)
- Share activation to social (Instagram Stories template)
- Community guidelines (no excuses policy enforced)

#### 5. The Doctrine (Philosophy Hub)
- Full Whitepaper + audio versions (text-to-speech)
- Interactive 5-Second Rule simulator
- Video manifesto series
- Downloadable PDF + phone wallpapers
- Philosophy bookmarks

#### 6. Loyalty & Membership
- "Vault Member" tier:
  - Early drops (5-day advance)
  - Custom embroidery configurator
  - Physical uniform care kit (shipped quarterly)
  - Exclusive philosophy content
  - Tier badge in community

### UI/UX Direction (Identical to Web)
- Dark brutalist theme (#0A0A0A background)
- Heavy tactile feedback (haptic on every interaction)
- Red accent ONLY on primary actions (Activate, Buy, Submit)
- Concrete texture subtle backgrounds
- Font system identical to web (Bebas Neue UI, Copperplate philosophy)
- Bottom tab navigation: Activate | Vault | Shop | Community | Profile
- Smooth transitions, no jank

### App Navigation Structure
```
AuthStack
├─ Onboarding (3 screens: Philosophy, Activation, Activation Ritual)
├─ Login / Sign Up
└─ SignUp Form (email, password, name)

MainStack (After Auth)
├─ ActivateTab
│  ├─ Activation Tracker (main)
│  ├─ Streak History
│  └─ Daily Manifesto
├─ VaultTab
│  ├─ Dashboard (heatmap + stats)
│  ├─ Journal Entries
│  └─ Philosophy Library
├─ ShopTab
│  ├─ Product Catalog
│  ├─ Product Detail (AR Try-On)
│  ├─ Cart
│  └─ Checkout
├─ CommunityTab
│  ├─ Feed (activations + challenges)
│  ├─ Leaderboards
│  └─ Group Challenges
└─ ProfileTab
   ├─ Profile Settings
   ├─ Order History
   ├─ Membership Tier
   └─ Settings / Logout
```

### Key Screens to Build (MVP)

1. **Activation Screen (Hero)**
   ```
   [HEADER: "ACTIVATE IN 5 SECONDS"]
   [Large Red Button: "I PUT ON MY D.I.A. UNIFORM"]
   [Timer Animation: 5 ← 4 ← 3 ← 2 ← 1]
   [Celebration: Haptic + Confetti]
   [Streak Counter: "47 Days No Excuses"]
   [Today's Philosophy: "The path of most resistance..."]
   [Bottom Nav]
   ```

2. **Vault Dashboard**
   ```
   [Stats Row: Streak | Activations | Identity %]
   [Heatmap Calendar]
   [Daily Philosophy Excerpt]
   [Recent Journal Entries]
   [+ New Entry Button]
   ```

3. **Shop Product Detail**
   ```
   [Product Images (carousel)]
   [AR Try-On Button (red CTA)]
   [Name + Price]
   [Size Selector]
   [Activation Ritual Tab]
   [Add to Cart (red)]
   ```

4. **Community Feed**
   ```
   [New Challenge Card]
   [Activation Moments (User Name, Time, Streak)]
   [Share Button]
   [Leaderboard Tab]
   ```

---

## 🔧 Phase 5: Backend & Infrastructure

### Firebase Setup
```
Authentication: Email/Password + Google Auth
Firestore Collections:
  - users (profile data, membership tier)
  - activations (daily activation records)
  - journal_entries (vault entries)
  - community_challenges (group challenges)
  - leaderboards (weekly/monthly scores)
Storage: Profile images, user uploads
Cloud Messaging: Daily 5-second reminders + philosophy drops
```

### Shopify Integration
```
Storefront API: Product catalog, cart, checkout
Custom App: Printful sync (automated)
Webhooks: Order → Printful fulfillment
```

### Third-Party Integrations
```
Stripe: Payment processing
Printful: On-demand manufacturing + fulfillment
Wearfits / GlamAR: AR Try-On
Firebase Cloud Messaging: Push notifications
Sentry: Error tracking
```

---

## 🚀 Phase 6: Deployment & Launch

### Pre-Launch Checklist
- [ ] All logo lockups finalized (vector + embroidery specs)
- [ ] Shopify Hydrogen storefront live + tested
- [ ] React Native app built & tested (TestFlight/Android Beta)
- [ ] Firebase production environment configured
- [ ] Stripe live keys + webhook configured
- [ ] Printful store linked + test orders flowing
- [ ] AR Try-On integrated & tested
- [ ] 5-Second Rule activation fully functional
- [ ] Community guidelines + moderation in place
- [ ] Philosophy content + manifesto recorded

### Launch Order
1. **Week 1:** Shopify storefront live (web.doitanyways.com)
2. **Week 2:** iOS/Android app beta (TestFlight + Play Store beta)
3. **Week 3:** Full app launch + community activation
4. **Week 4+:** Drop 001 expansion, membership tier rollout

---

## 📊 Success Metrics

**Activation Tracker (Core KPI)**
- Day-1 activation rate: >80%
- Day-7 retention: >70%
- Day-30 retention: >40%
- Average streak: >25 days

**Commerce**
- App → Purchase conversion: >5%
- Repeat purchase rate: >25% (30 days)
- Average order value: >$90
- Chargeback rate: <0.1%

**Community**
- UGC volume: >100 activations/day (Week 4+)
- Challenge participation: >30%
- Referral rate: >10%

**Retention**
- 90-day app retention: >35%
- Vault member conversion: >10%
- NPS score: >60

---

## 📦 Deliverables Summary

| Component | Status | Location |
|-----------|--------|----------|
| Visual Identity System | Ready | `/design/brand-system.figma` |
| Shopify Hydrogen Storefront | Live | `web.doitanyways.com` |
| React Native App (iOS) | TestFlight | App Store (beta) |
| React Native App (Android) | Beta | Play Store (beta) |
| Firebase Backend | Live | `Firebase console` |
| Documentation | Complete | `/docs/` |

---

## 🎯 Next Immediate Steps

1. **Export all logos to vector** (SVG + AI) + embroidery specs
2. **Deploy Shopify Hydrogen** to production
3. **Launch React Native app** to TestFlight + Play Store Beta
4. **Configure Firebase** (Firestore + Auth + Messaging)
5. **Run closed beta** (internal team + 50 early adopters)
6. **Iterate on 5-Second activation UX** (haptic, animation, streak logic)
7. **Integrate AR Try-On** (Wearfits)
8. **Go live to all users** (Week 4)

---

## 📝 This Is The System

Everything here is **closed-loop, non-negotiable, and engineered to make discipline automatic:**

- Philosophy → Physical Uniform → App Activation → Community → Identity Shift
- Every touchpoint reinforces: "I am someone who chooses the path of most resistance."
- Zero friction from purchase to daily activation to social proof.
- No excuses. The uniform is ready.

**Build. Launch. Make discipline the path of least resistance.**

---

**Master Document Version:** 1.0  
**Last Updated:** 2026-02-23  
**Status:** Ready for Development  
**Questions?** Refer back to the D.I.A. Brand Bible — everything is in there.
