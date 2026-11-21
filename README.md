# BC ACCESSORIES – B2B Wholesale Platform 📱⚡

A modern, high-performance **B2B Wholesale & Distribution Portal** for smartphone accessories, screen protection, GaN charging tech, and gadgets. Built specifically for telecommunication retailers, smartphone repair shops, and online resellers across Germany and Europe.

---

## 🎨 Brand Identity & Architecture

- **Visual Identity:** Tailored around the official BC Accessories logo — Deep Navy (`#0B1E3F`), Electric Cyan/Teal (`#00D2C4`), Crisp White, and Slate Gray.
- **Frontend:** React.js (Vite), Tailwind CSS v4, Lucide React, i18next (Instant Bilingual DE / EN).
- **Backend:** Node.js, Express.js REST API, JWT Authentication, bcrypt password hashing.
- **Database:** MongoDB Atlas (M0 Free Tier compatible) with Mongoose.
- **Media Delivery:** Optimized for Cloudinary CDN (`f_auto,q_auto`) to keep the database feather-light.
- **Deployment:** Vercel (Frontend & Serverless API) + Custom Domain ready.

---

## 🚀 Key B2B Features (Modeled on Obizzone, Talksky & Faro)

1. **Bilingual Support (🇩🇪 German & 🇬🇧 English):**
   - Instant language switcher in the navbar with zero page reload.
   - Comprehensive dictionary covering German B2B terminology (*Staffelpreise, Mindestbestellwert, USt-IdNr., zzgl. 19% MwSt., RMA*).

2. **Gated Wholesale Pricing & Access Control:**
   - Public visitors browse catalog specifications; net prices are locked behind verified B2B dealer logins.
   - 3 User Roles: `Visitor` (masked prices), `Approved Dealer` (unlocked wholesale tiers), `Admin` (account approvals & catalog management).

3. **Tiered Quantity Pricing Engine (Staffelpreise):**
   - Real-time price breaks (e.g. 10+, 50+, 100+ units) recalculated automatically in the product page, cart, and quick order pad.
   - Enforcement of MOQ (Minimum Order Quantity per SKU) and MOV (Minimum Order Value €150 net).

4. **B2B Quick Order Pad (Schnellbestellung):**
   - Spreadsheet-style rapid ordering interface where shop owners can select multiple SKUs, enter bulk quantities, and add all items to the cart in seconds.

5. **Wholesale Checkout & Invoicing:**
   - Purchase Order (PO) / Commission reference field.
   - Payment options: Prepayment (Vorkasse) and Purchase on Invoice (Rechnungskauf 14 Tage).
   - German 19% VAT calculation and free shipping threshold (€500 net).

---

## 🔑 Demo Review Accounts

Quick-fill demo buttons are built directly into the Login screen for instant testing:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bc-accessories.de` | `admin123Password!` | Admin portal, dealer approvals, order metrics |
| **Approved Dealer** | `dealer@smartrepair-gmbh.de` | `dealer123Password!` | Full wholesale net pricing, tiered discounts, checkout |
| **Pending Dealer** | `pending@phonehub-retail.de` | `pending123Password!` | Gated view awaiting admin verification |

---

## 🛠️ Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ installed
- (Optional) MongoDB Atlas free cluster URI

### 2. Install & Start Backend
```bash
cd server
npm install
npm run seed     # Populates catalog with realistic dummy products from reference sites
npm run dev      # Runs Express API on http://localhost:5000
```

### 3. Install & Start Frontend
```bash
cd client
npm install
npm run dev      # Runs Vite React app on http://localhost:5173
```

---

## 🌐 Deploying to Vercel & Free MongoDB Atlas

### 1. Free Database (MongoDB Atlas M0)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) (Free Forever, no credit card required).
2. Create an **M0 Free Cluster**.
3. Under **Database Access**, create a user & password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Copy your connection string into `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bc_accessories?retryWrites=true&w=majority
   ```

### 2. Deploy to Vercel
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Add the following Environment Variables in Vercel:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret string
   - `MINIMUM_ORDER_VALUE`: `150`
4. Click **Deploy**.

### 3. Connect Your Domain
1. In Vercel, navigate to **Project Settings → Domains**.
2. Add your client's custom domain (e.g. `bc-accessories.de` or `shop.bc-accessories.com`).
3. Follow the DNS instructions to add the `A` / `CNAME` records at your domain registrar.
4. Vercel automatically generates and renews free SSL certificates (HTTPS).
