# 🎵 Adab Live — Premier Live Music & Sound Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_Service-black?style=for-the-badge&logo=resend)](https://resend.com/)

**Adab Live** is a full-stack, enterprise-grade web application and booking engine for live musical performances and professional concert sound system rentals. Designed with a sleek, dark-mode visual aesthetic, smooth dynamic animations, real-time pricing computation, and an admin management dashboard, Adab Live connects event planners, venues, and private hosts directly with professional live music services.

---

## 🌟 Key Features

### 🎛️ 1. Multi-Step Interactive Booking Engine
- **Service Selection**: Choose between **Live Band Performance**, **Sound Setup**, or a combined **Full Package**.
- **Customizable Band Lineups**: Pick from acoustic solos, duos, trios, or full band performance packages.
- **Sound System Configurations**: Scalable audio gear configurations tailored for intimate indoor setups up to large outdoor concert stages.
- **Event & Logistics Builder**: Configure date, venue location, estimated guest count, performance duration, and custom setlist requests.
- **Step-by-step Modal**: Smooth multi-step wizard guided by real-time validation (powered by React Hook Form & Zod).

### ⚡ 2. Real-Time Dynamic Pricing Engine
- Instant calculation of performance fees based on band size, sound system requirements, event duration, and logistical factors.
- Live price summaries updated automatically at every step of the booking flow.

### 📊 3. Band Owner & Admin Management Dashboard (`/admin`)
- **Secure Authentication**: Protected admin portal for band managers and owners.
- **Real-Time Booking Pipeline**: View, track, filter, and search bookings across statuses (**Pending**, **Confirmed**, **Completed**, **Cancelled**).
- **Status Lifecycle Actions**: Single-click status updates with real-time sync to Firebase Firestore.
- **Metrics & Overview**: Quick statistics on total bookings, pending requests, and upcoming performance schedules.
- **Non-Technical Visual CMS**: Complete, zero-code management system for updating phone, WhatsApp, email, social links, about bio, and YouTube clips.
- **Full Photo & Media Manager**: One-click photo upload, cover selection, and deletion across live band lineups, sound setups, and site banners.
- **Client Handover Manual**: Dedicated in-app guide and standalone [`CLIENT_HANDOVER_GUIDE.md`](./CLIENT_HANDOVER_GUIDE.md) designed specifically for non-coders.

### 📧 4. Dual-Party Transactional Email System
- Integrated with **Resend API** for automated email notifications.
- **Customer Confirmation**: Instant branded booking confirmation sent to the client upon form submission.
- **Owner Notification**: Instant notification dispatched to the band owner with comprehensive event parameters for rapid follow-up.

### 🎨 5. Modern Dark Aesthetic UI & Showcase
- Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.
- Fluid micro-interactions and transitions powered by **Framer Motion**.
- Interactive audio/video performance clips, high-resolution media gallery, sound package specifications, and social proof trust metrics.

---

## 🏗️ Architecture & Project Structure

The repository is structured as a monorepo containing both the Next.js frontend application and shared backend services.

```
ADAB LIVE/
├── frontend/                   # Next.js 16 Client & App Router
│   ├── app/                    # Next.js App Router Pages & API Routes
│   │   ├── page.tsx            # Main Landing Page (Hero, Lineups, Gallery, Clips)
│   │   ├── about/              # Band History & Mission Page
│   │   ├── contact/            # Direct Contact & Inquiries
│   │   ├── live-band/          # Live Band Performance Packages
│   │   ├── sound-setup/        # Sound System Gear Specifications
│   │   ├── product/            # Individual Service Detail Views
│   │   ├── admin/              # Band Owner Admin Dashboard & Login
│   │   └── api/                # API Endpoints (Bookings, Email Dispatch)
│   ├── components/             # Reusable UI Components
│   │   ├── booking/            # Multi-step Booking Wizard & Step Components
│   │   ├── Header.tsx          # Navigation Bar & Mobile Drawer
│   │   ├── Footer.tsx          # Footer with Links & Contact Details
│   │   ├── Gallery.tsx         # Performance Photo Showcase
│   │   ├── ClipsSection.tsx    # Live Performance Audio/Video Snippets
│   │   ├── LineupCard.tsx      # Band Package Cards
│   │   ├── SoundCard.tsx       # Sound Equipment Package Cards
│   │   └── TrustStats.tsx      # Social Proof & Metrics Showcase
│   ├── context/                # React Context Providers (Booking State, Modals)
│   ├── lib/                    # Frontend Helper Utilities & Firebase Client
│   └── public/                 # Static Assets (Images, Icons, Audio Clips)
│
└── backend/                    # Core Backend Services & Schemas
    ├── lib/
    │   ├── firebase.ts         # Firebase Client SDK Config
    │   ├── firebaseAdmin.ts    # Firebase Admin SDK Setup
    │   ├── bookingsService.ts  # Firestore CRUD Operations & Booking Logic
    │   ├── pricing.ts          # Pricing Engine Algorithms
    │   ├── schemas.ts          # Zod Validation Schemas
    │   └── email.ts            # Resend Email Notification Dispatchers
    └── package.json            # Backend TypeScript Build Dependencies
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod Schema Validation](https://zod.dev/)
- **Database & Auth**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Transactional Emails**: [Resend](https://resend.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm** or **pnpm** / **yarn** / **bun**

### 1. Clone the Repository

```bash
git clone https://github.com/Vanshk0012/adab-live.git
cd adab-live
```

### 2. Configure Environment Variables

Create `.env.local` inside the `frontend/` directory (you can copy `.env.example`):

```bash
cp frontend/.env.example frontend/.env.local
```

Populate `frontend/.env.local` with your credentials:

```env
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=adab-live.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=adab-live
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=adab-live.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@adab-live.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_RSA_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Transactional Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
OWNER_EMAIL=owner@adablive.com
FROM_EMAIL=bookings@adablive.com

# Band Owner Admin Portal
ADMIN_EMAIL=owner@adablive.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Install Dependencies

Install dependencies for the frontend application:

```bash
cd frontend
npm install
```

Install backend dependencies (if working on backend services):

```bash
cd ../backend
npm install
```

### 4. Run Development Server

Launch the Next.js development server:

```bash
cd ../frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

In the `frontend` folder:

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Starts local development server on port 3000 |
| `npm run build` | `next build` | Builds the production bundle |
| `npm run start` | `next start` | Starts production server |
| `npm run lint` | `eslint` | Runs ESLint analysis across codebase |

In the `backend` folder:

| Script | Command | Description |
|---|---|---|
| `npm run build` | `tsc` | Compiles TypeScript backend files |
| `npm run typecheck` | `tsc --noEmit` | Runs static type check |

---

## 🔒 Security & Best Practices

- **Environment Isolation**: Private keys (Firebase Admin RSA key, Resend API key) are strictly isolated to server-side code execution.
- **Form & Input Validation**: Strict client-side and server-side runtime schema validation using Zod.
- **Admin Access Control**: Authentication checks protect the `/admin` portal routes to ensure unauthorized users cannot view client bookings.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Adab Live:

1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p center align="center">
  Crafted with ❤️ for live music enthusiasts and performers.
</p>
