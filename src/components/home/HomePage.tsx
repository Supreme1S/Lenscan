import { ScanWalletForm } from "@/components/home/ScanWalletForm";

export function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6">
      {/* Soft color blobs behind the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.30), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-[-10%] h-[36rem] w-[36rem] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,197,94,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-[-10%] h-[30rem] w-[30rem] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.20), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          See any Sui wallet,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(110deg, var(--brand) 0%, #22c55e 100%)",
            }}
          >
            clearly.
          </span>
        </h1>
        <p className="mt-3 text-balance text-base text-[var(--muted)]">
          Tokens, DeFi, NFTs and transactions for any Sui wallet — in one place.
        </p>

        <div className="liquid-surface mt-8 w-full rounded-3xl p-3 sm:p-4">
          <div className="relative z-10">
            <ScanWalletForm />
          </div>
        </div>
      </div>
    </div>
  );
}
