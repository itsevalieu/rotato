# Rotato

A cozy, low-pressure creative project rotation app for hobbyists and multidisciplinary creatives.

Creativity should feel like play, not productivity. Rotato helps you tend your creative projects like a garden — things can grow, rest, and bloom at their own pace.

## Philosophy

- **No deadlines.** Projects move at your pace.
- **No streaks or metrics.** There's nothing to optimize.
- **No guilt.** It's okay to put things down for months.
- **No giant backlogs.** Just four gentle sections.
- **Local-first.** Your data stays on your device.

## Sections

| Section | Purpose |
|---------|---------|
| **Currently Playing** | Projects you're actively excited about (1–5 recommended) |
| **Resting** | Dormant projects — not abandoned, just sleeping |
| **Seeds** | Tiny undeveloped ideas waiting to grow |
| **Finished Worlds** | Completed or retired projects — celebrate them |

## Features

- Drag-and-drop cards between sections
- Create, edit, and archive projects
- "Surprise Me" button to resurface resting projects
- Creative Weather mood indicator
- Ambient mode with soft gradients
- Search and filter by tags
- Timeline tracking for project journeys
- Gallery/board view toggle
- Keyboard-accessible drag-and-drop
- Responsive design
- Reduced motion support

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Framer Motion](https://www.framer.com/motion/)
- [@dnd-kit](https://dndkit.com/) for drag-and-drop
- [idb-keyval](https://github.com/nicedoc/idb-keyval) for IndexedDB persistence
- [Lucide React](https://lucide.dev/) icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, then navigate to `/garden` to start tending your projects.

On first launch, the app is populated with example projects to demonstrate the UX.

## Deployment

Rotato is a fully client-side Next.js app — no database, no environment variables, no backend. Every deployment option below works out of the box.

---

### Option 1 — Vercel (recommended, free tier available)

**Via GitHub (easiest)**

1. Push your repository to GitHub (or fork it).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project** and import your repository.
4. Leave all settings at their defaults — Vercel auto-detects Next.js.
5. Click **Deploy**. Your live URL appears in about 60 seconds.

Every push to `main` redeploys automatically.

**Via CLI**

```bash
npm i -g vercel
vercel        # follow the prompts — framework is auto-detected
```

Running `vercel --prod` after that deploys to your production URL.

---

### Option 2 — Netlify (free tier available)

**Via GitHub**

1. Push to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Choose your repository.
4. Set the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Click **Deploy site**.

> Netlify requires the Next.js runtime plugin. If it isn't installed automatically, add `@netlify/plugin-nextjs` under **Site settings → Build plugins**.

**Via CLI**

```bash
npm i -g netlify-cli
npm run build
netlify deploy --dir=.next --prod
```

---

### Option 3 — Self-hosted on any VPS / server

Use this if you want to run Rotato on your own machine (e.g. a DigitalOcean droplet, a Raspberry Pi, etc.).

**Build and start**

```bash
npm install
npm run build
npm start          # starts the production server on port 3000
```

To run on a custom port:

```bash
PORT=8080 npm start
```

**Keep it running with PM2**

```bash
npm i -g pm2
pm2 start "npm start" --name rotato
pm2 save           # auto-restart on reboot
```

**Reverse proxy with nginx** (optional, to serve on port 80/443)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Add HTTPS with Certbot: `sudo certbot --nginx -d your-domain.com`

---

### Option 4 — Static export (for simple file hosting)

> ⚠️ Static export loses some Next.js features. Only use this if you need to host on a plain file server (GitHub Pages, S3, etc.) that can't run Node.

Add `output: 'export'` to `next.config.ts`:

```ts
const nextConfig = {
  output: 'export',
};
export default nextConfig;
```

Then build:

```bash
npm run build      # generates an `out/` folder
```

Upload the contents of `out/` to any static host.

---

### Verify your build locally before deploying

```bash
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000) — if it works here it will work anywhere.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   └── garden/       # Main app board
├── components/
│   ├── ui/           # Reusable design primitives
│   ├── layout/       # Header, ambient background
│   ├── garden/       # Domain components (board, cards, forms)
│   └── landing/      # Landing page sections
├── context/          # React Context + useReducer state
├── hooks/            # Custom hooks
└── lib/              # Types, constants, storage, utilities
```

## License

MIT
