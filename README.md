# 🛡️ Stellar Way — Admin Panel

The official admin dashboard for the **Stellar Way** e-commerce & delivery platform. Built with **Next.js 16** and deployed on Vercel, it gives administrators full control over orders, riders, users, and platform analytics.

---

## 🌐 Live URL

> [https://stellar-way-admin.vercel.app](https://stellar-way-admin.vercel.app)

---

## ✨ Admin Features

- 📦 **Order Management** — View, update, and manage all customer orders
- 🛵 **Rider Management** — Review rider applications, approve/reject, monitor active riders
- 👤 **User Management** — Manage customer accounts and access
- 📊 **Analytics Dashboard** — Charts and reports on orders, revenue, and deliveries
- 🗺️ **Live Delivery Tracking** — Monitor real-time rider locations on map
- 🔔 **Notifications** — Instant alerts for new orders and rider activity
- 🔐 **Secure Auth** — Admin-only access via NextAuth.js

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js |
| Data Fetching | TanStack React Query + Axios |
| Real-time | Socket.IO Client |
| Maps | Leaflet + React Leaflet |
| Charts | Recharts |
| Animations | Framer Motion, GSAP |
| Notifications | React Hot Toast, SweetAlert2 |
| UI | Lucide React, React Icons, Swiper |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/your-username/stellar-way-admin.git
cd stellar-way-admin
npm install
```

### Environment Variables

Create a `.env.local` file in the project root and add the following:

```env
NEXT_PUBLIC_API_URL=https://stellar-way-server.onrender.com/api/v1
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://stellar-way-admin.vercel.app
```

> ⚠️ **Never commit your `.env.local` file to version control.** Make sure `.env.local` is listed in your `.gitignore`.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** When running locally, set `NEXTAUTH_URL=http://localhost:3000` in your `.env.local`.

---

## 📁 Project Structure

```
stellar-way-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Admin login page
│   ├── dashboard/          # Main dashboard
│   ├── orders/             # Order management
│   ├── riders/             # Rider management & applications
│   ├── users/              # User management
│   └── analytics/          # Reports & charts
├── components/             # Reusable UI components
├── lib/                    # API client, utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── public/                 # Static assets
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔌 API & Real-Time

- **REST API** — All data is fetched from `https://stellar-way-server.onrender.com/api/v1`
- **Socket.IO** — Real-time order and rider status updates streamed to the dashboard

---

## 🚢 Deployment

This admin panel is deployed on **Vercel**.

### Steps to Deploy

1. Push your repository to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard:

| Key | Value |
|---|---|
| `NEXTAUTH_SECRET` | `your_nextauth_secret` |
| `NEXTAUTH_URL` | `https://stellar-way-admin.vercel.app` |

4. Click **Deploy**

---

## 🔐 Security Notes

- This panel is restricted to authorized admin accounts only
- All API requests are authenticated via session tokens managed by NextAuth.js
- Keep `NEXTAUTH_SECRET` long, random, and private — never expose it publicly
- Regularly rotate your `NEXTAUTH_SECRET` in production

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

> Part of the [Stellar Way](https://github.com/imamhossenbu/stellar-way) platform · Powered by [Next.js](https://nextjs.org)
