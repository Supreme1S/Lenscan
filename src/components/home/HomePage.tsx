import { ScanWalletForm } from "@/components/home/ScanWalletForm";

export function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6">
      {/* Subtle Sui-blue ambient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(77,162,255,0.35), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center anim-fade-up">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          See any Sui wallet,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(110deg, #4DA2FF 0%, #6FBEFF 60%, #1FCFE0 100%)",
            }}
          >
            clearly.
          </span>
        </h1>
        <p className="mt-3 text-balance text-base text-[var(--muted)]">
          Tokens, DeFi, NFTs and transactions for any Sui wallet — in one place.
        </p>

        <div className="surface-card mt-8 w-full p-3 sm:p-4">
          <ScanWalletForm />
        </div>
      </div>
    </div>
  );
}
