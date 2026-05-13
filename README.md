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

This app is ready to deploy on [Vercel](https://vercel.com). No environment variables or backend configuration needed — everything runs client-side with local storage.

```bash
npm run build
```

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
