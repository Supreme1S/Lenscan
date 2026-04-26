export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="shrink-0 px-6 pt-6">
        <span className="text-sm font-semibold tracking-tight">Lenscan</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        <p className="max-w-md text-center text-base text-zinc-600 dark:text-zinc-400">
          Lenscan – Sui portfolio viewer (MVP scaffold ready).
        </p>
      </main>
    </div>
  );
}
