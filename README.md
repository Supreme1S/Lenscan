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

Copy `.env.local.example` to `.env.local` and fill in values. Never commit `.env.local` (real secrets stay local or in Vercel env).

- **Sui RPC** — `NEXT_PUBLIC_SUI_RPC_URL`

## Supabase (Lenscan-only)

Use a **new Supabase project** dedicated to Lenscan. Do not reuse credentials from other apps (e.g. EventX).

1. In [Supabase](https://supabase.com), create a project for Lenscan.
2. Open **Project Settings → API**.
3. Copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
4. Copy the **anon public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
5. Create the `favorites` table by running the SQL in `supabase/migrations/20260426140000_lenscan_favorites.sql` in the **SQL Editor** (or via Supabase CLI against this project only).

The app exposes a browser client in `src/lib/supabase/client.ts` (`@supabase/supabase-js`). Call `assertSupabaseEnv()` before use if you want a hard fail when env is missing.

## Stack

Next.js 16, React 19, Tailwind CSS v4, ESLint.
