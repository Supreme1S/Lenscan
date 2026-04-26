# Lenscan

Minimal [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS scaffold for **Lenscan**, a Sui-native DeBank-light portfolio viewer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Development server       |
| `npm run build`    | Production build         |
| `npm run start`    | Start production server  |
| `npm run lint`     | ESLint                   |

## Environment

Copy `.env.local.example` to `.env.local` and fill in values. Planned integrations:

- **Supabase** — `NEXT_PUBLIC_SUPABASE_*`
- **Sui RPC** — `NEXT_PUBLIC_SUI_RPC_URL`

## Stack

Next.js 16, React 19, Tailwind CSS v4, ESLint.
