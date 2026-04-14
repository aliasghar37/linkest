 # 🔗 Linkest - Intelligent URL Shortener

---
[🚀 Live Project Overview](https://linkest.vercel.app)

**Linkest** is a high-performance, ai powered URL shortening platform designed for speed, security, and scalability, Built on Serverless Architecture, it features real-time analytics, Preview Page with AI-powered content summaries and password protection, and a secure subscription model.

---

## 🌟 Key Features

### 🛠 Core Functionality
- **Custom Aliases:** Allow users to define branded back-halves (e.g., `linkest.vercel.app/abc`).
- **Password Protection:** Secure sensitive links with hashed password gates using **bcrypt**.
- **Auto-Expiry:** Set self-destruct timers on links to manage temporary access automatically.
- **QR Code Generation:** Automatically generate high-quality QR codes for every shortened URL.

### 📊 Professional Analytics
- **Real-time Tracking:** Click counts and visitor metadata are tracked instantly.
- **Analytics Dashboard:** Visualized data using **MUI X Charts** with daily and monthly granularity.
- **Performance:** Optimized data fetching using **SWR** (Stale-While-Revalidate) for a snappy UI.

### ⚡ Performance & AI
- **Redis Caching:** Sub-millisecond redirection speeds with **Upstash Redis**.
- **AI Summaries:** Intelligent document processing that generates automated page summaries for link previews using the **Groq SDK and Tavily API**.
- **Preview Pages:** Optional landing pages that display link metadata before redirection.

### 🔒 Security & Monetization
- **Clerk Authentication:** Secure, scalable user management with multi-tenant support.
- **Stripe Integration:** A recurring subscription model ("Pro Plan") with secure payment processing and webhook synchronization.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Caching** | [Upstash Redis](https://upstash.com/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Payments** | [Stripe](https://stripe.com/) |
| **Styling** | [Material UI (MUI)](https://mui.com/) & [Tailwind CSS](https://tailwindcss.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

**Developed with ❤️ by [Ali Asghar](https://linkedin.com/in/ali-asghar)** 