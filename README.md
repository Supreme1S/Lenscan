# Lenscan

A **Sui-native DeBank-light** portfolio scanner. Built with Next.js 16 (App Router), React 19, Tailwind v4, and Supabase.

Inspired by [DeBank](https://debank.com/) and [Nimbus](https://getnimbus.io/portfolio); focused exclusively on the Sui chain.

## Routes

| Path             | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `/`              | Home — explainer + central wallet input + Connect CTA |
| `/portfolio`     | Net worth, holdings, allocation, DeFi positions        |
| `/yields`        | Live Sui pools from DeFiLlama (APY, TVL, filters)      |
| `/nfts`          | NFT collections held by a wallet                       |
| `/transactions`  | Recent on-chain activity                               |
| `/favorites`     | Bookmarked Sui wallets (Supabase)                      |

## Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + publishable key
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

`.env.local` keys (never commit real values):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io
```

## Supabase

Use a **dedicated** Supabase project for Lenscan (do not reuse credentials from other apps).

1. Create the project in [Supabase](https://supabase.com).
2. Settings → API → copy **Project URL** + **anon (publishable) key** into `.env.local`.
3. Apply migrations from `supabase/migrations/` in order:
   - `20260426140000_lenscan_favorites.sql` — creates `public.favorites`.
   - `20260426150000_lenscan_favorites_rls.sql` — enables RLS + anon policies.

Server access goes through `src/lib/supabase/server.ts`; the browser client is `src/lib/supabase/client.ts`.

## Architecture

```
src/
├── app/
│   ├── layout.tsx                  Root layout + LayoutShell
│   ├── page.tsx                    Home route
│   └── (routes)/
│       ├── portfolio/page.tsx      Reads ?address= and renders mock portfolio
│       ├── yields/page.tsx         DeFiLlama-backed yields (ISR 10min)
│       ├── nfts/page.tsx
│       ├── transactions/page.tsx
│       └── favorites/{page,actions}.tsx
├── components/
│   ├── layout/{LayoutShell,Sidebar,TopBar}.tsx
│   ├── home/{HomePage,ScanWalletForm}.tsx
│   ├── portfolio/...
│   ├── yields/YieldsTable.tsx
│   ├── nfts/...
│   ├── transactions/...
│   ├── favorites/FavoritesPage.tsx
│   └── ui/{Card,Badge,Table,PillTabs,Skeleton}.tsx
├── lib/
│   ├── data/
│   │   ├── favorites.ts            Supabase CRUD
│   │   ├── yields.ts               DeFiLlama fetcher
│   │   └── mock/...
│   ├── defi/protocols.ts           Phase 3 adapter contract (Navi/Cetus/...)
│   ├── sui/{address,rpc}.ts        Address helpers + JSON-RPC client
│   ├── supabase/{client,server}.ts
│   ├── types/{portfolio,yields}.ts
│   └── wallet/suiWallet.ts         Phase 4 stub for @mysten/dapp-kit
```

## Phases

- **Phase 1 (current)** — Layout shell, Home, Portfolio (mock), Favorites (Supabase, RLS), NFTs, Transactions.
- **Phase 2 (live)** — Yields page wired to DeFiLlama.
- **Phase 3 (groundwork)** — `lib/defi/protocols.ts` adapter contract + `lib/sui/rpc.ts`. Real Navi/Cetus/Suilend/Scallop adapters land next.
- **Phase 4** — `@mysten/dapp-kit` connect, dark theme polish, AI summaries.

## Stack

Next.js 16 (Turbopack) · React 19 · Tailwind CSS v4 · Supabase · DeFiLlama API · Sui JSON-RPC.
