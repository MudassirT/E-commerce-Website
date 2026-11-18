# 🛍️ ShopZone — Modern E-Commerce Platform

A production-grade, full-featured e-commerce frontend built with **React 18**, **Vite 5**, **Tailwind CSS**, **Framer Motion**, and **Firebase Auth**.

---

## ✨ Features & Architecture

### 🎨 Design System & UI/UX
- **Custom Design Tokens**: Curated Indigo & Amber color palette with custom shadows and typography.
- **Dark Mode**: Seamless light/dark theme toggle with system preference detection and localStorage persistence.
- **Inter Typography**: Google Font Inter with responsive heading hierarchy.
- **Glassmorphism Header**: Sticky navigation with backdrop blur (`backdrop-blur-md`).
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Custom Shimmer Skeletons**: Replaced spinners with animated skeleton cards for product grids and detail views.
- **Framer Motion Micro-Interactions**: Smooth hover effects, animated mobile navigation drawer, and animated cart counters.

### 🔔 Toast System
- Built-in `ToastContext` providing non-blocking floating notifications (`toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`) with auto-dismiss and slide animations. Replaced all legacy `window.alert()` calls.

### 📦 Product Catalog & Discovery
- **Live Search**: Instant keyword filtering across titles and descriptions.
- **Category Chips**: Fast filtering by Electronics, Jewelery, Men's Clothing, Women's Clothing.
- **Multi-criteria Sorting**: Featured, Price: Low to High, Price: High to Low, Highest Rated.
- **Rating Filters**: Filter products by 3.0+, 4.0+, 4.5+ stars.
- **Recently Viewed**: Automatically tracks and displays the user's last viewed items.
- **Breadcrumbs**: Full hierarchical navigation on product pages.
- **Interactive Reviews**: Realistic customer reviews with star breakdowns and an interactive submission form.

### 🛒 Cart & Multi-Step Checkout
- **Persistent State**: Cart items synced with browser `localStorage`.
- **Free Shipping Progress Meter**: Dynamic calculation showing progress toward the $50 free shipping threshold.
- **Promo Codes**: Working discount vouchers (`SAVE10` for 10% off, `WELCOME20` for 20% off, `SUPER30` for 30% off, `FREESHIP` for free shipping).
- **Interactive Delivery Address**: Geolocation auto-detection via OpenStreetMap API with manual editing and validation.
- **Multi-Step Checkout Modal**:
  - Step 1: Review items & delivery details
  - Step 2: Payment method selection (Credit/Debit Card live mockup or Cash on Delivery)
  - Step 3: Simulated secure payment processing
  - Step 4: Full celebration with confetti (`canvas-confetti`) 🎉, generated Order ID, and delivery estimate.

### 💖 Wishlist & Order History
- **Wishlist**: Toggle heart buttons on any card or detail page, dedicated `/wishlist` management page, and 1-click "Move All to Cart".
- **Order History**: Dedicated `/orders` page tracking placed orders, dates, line items, and delivery status.

### 🔐 Authentication
- Real Firebase Auth support (Google, GitHub, Email/Password).
- **1-Click Instant Demo Login**: Built-in test drive for instant access to authenticated features without needing Firebase setup.

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run start
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
