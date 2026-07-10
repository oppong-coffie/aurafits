# AuraFitGh - Premium Clothing Storefront & Admin Hub

AuraFitGh is a premium, highly responsive e-commerce web application for luxury clothing and apparel. Built using Next.js 16 (App Router) and Tailwind CSS 4, the platform integrates real-time shopping cart events, visual order tracking, customized animated registration, SMS notifications, and an admin inventory management board.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16.2.10 (App Router, Turbopack enabled)
- **Frontend library**: React 19.2.4
- **Database Layer**: MongoDB via Mongoose
- **Storage**: Supabase (for product image assets)
- **Styling**: Tailwind CSS 4 & Custom CSS (featuring theme-tailored HSL colors, dark modes, and modern gradients)
- **Animations**: Framer Motion (leveraging spring-based transition micro-animations)
- **Icons**: Lucide React

---

## ✨ Features & Architecture

### 1. Splash Page Animation
- Spawns a custom-animated cart that moves across the viewport and docks smoothly into the official brand logo.
- Custom deceleration curves are programmed into the transition for a high-fidelity first impression.

### 2. Navigation & User Session
- **Dark Mode Toggle**: LocalStorage-persisted light/dark mode theme selection.
- **Dynamic Session Handling**:
  - Unauthenticated users see a highlighted, brand-pink **Sign In** button.
  - Logged-in users see their initials inside a styled profile circle containing a dropdown menu.
- **Live Cart Counter**: A notification badge sits on top of the shopping cart icon showing the count of items in the cart. It synchronizes automatically across tabs and actions using a custom window event handler (`cart-updated`).

### 3. Auth System (Login & Register)
- **Aesthetic Customizations**: Employs Framer Motion cards with dynamic spring entry scales.
- **Eye Icon password toggle**: Toggles password characters' visibility using Lucide `Eye`/`EyeOff`.
- **Contact Details**: The register layout asks for the user's **Full Name**, **Phone Number**, **Email**, and **Password**. It uses Zod constraints to enforce phone syntax and minimum lengths.

### 4. Interactive Shopping Cart & Wishlist
- **Action Triggers**: Add to cart, adjust quantities, delete items, or move items to a wishlist.
- **Global Toast Alerts**: Replaced all native browser alert dialogs with a unified React `<Toast />` system that listens to window-level events (`show-toast`).

### 5. Horizontal Order Tracker
- Rendered inside the user's Order History page.
- Features a **Track Package** button opening a modal with a horizontal progress line connecting 4 milestones:
  1. **Order Placed** (Completed upon checkout)
  2. **Processing** (Active for pending items)
  3. **In Transit** (Active once the admin accepts the order)
  4. **Delivered** (Completed once status is fulfilled)
- Displays contextual text descriptions reflecting the state of the order.

### 6. SMS API Gateway
- Implements a dedicated POST route at `/api/sms` to process text notifications.
- Connects directly to the SMSNotifyGH gateway:
  `https://sms.smsnotifygh.com/smsapi?key=...&to=...&msg=...&sender_id=...`
- Reads parameters from the body payload (`to` and `msg`) and reads private credentials from the environment.

### 7. Administrative Portal
- Located at `/adminhome` and `/adminproducts`.
- **Inventory Overview**: Lists products alongside thumbnail previews of images.
- **Add Product Board**:
  - Features file drag-and-drop boxes displaying selected file names.
  - Replaced checkboxes with colored pill-shaped toggle status buttons.
  - Dynamic sliding animation panels for inputting flash sales dates and old prices.
  - No legacy icon selects or placeholder promo listings.

---

## 📁 Folder Structure

```
├── app/
│   ├── (admin)/                 # Administrative dashboards & layout
│   │   ├── adminhome/           # Order monitor
│   │   └── adminproducts/       # Product list & add product form
│   ├── (pages)/                 # Standard client pages
│   │   ├── cart/                # Cart page & quantity handlers
│   │   ├── home/                # Main home sections
│   │   ├── orders/              # Orders lists & horizontal package tracker
│   │   └── wishlist/            # User wishlist
│   ├── api/                     # Serverless backend functions
│   │   ├── auth/                # Login, Logout, and Register controllers
│   │   ├── cart/                # Cart database updates
│   │   ├── products/            # Product listings and uploads
│   │   └── sms/                 # SMSNotifyGH endpoint
│   ├── components/              # Global UI elements
│   │   ├── home/                # Frontpage widgets (Flash, topsale, Hero, Sponsored)
│   │   ├── Navbar.tsx           # Global header navigation
│   │   └── Toast.tsx            # Modern event-driven toast notifications
│   ├── lib/                     # Database connect routines and session helpers
│   ├── globals.css              # Main global stylesheets & theme definitions
│   └── layout.tsx               # Root HTML structure
├── controllers/                 # MVC logic modules for Auth and Products
├── models/                      # MongoDB Schemas (User, Product, Cart)
└── public/                      # Static logos and graphic assets
```

---

## 🔧 Environment Configuration

To run this application locally, configure a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://...

# Session Security Configuration
SESSION_SECRET=your_jwt_session_secret

# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...

# SMS Notification Configuration
SMS_API_KEY=your_smsnotifygh_key
SMS_SENDER_ID=your_sender_id
```

---

## 🛠️ Development & Production

To run the dev server locally:
```bash
npm run dev
```

To run a production-ready optimization build:
```bash
npm run build
```

To start the built production bundle:
```bash
npm start
```
