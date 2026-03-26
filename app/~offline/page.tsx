'use client';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <div className="mb-6 text-6xl">📡</div>
      <h1 className="mb-2 text-2xl font-bold text-white">You&apos;re offline</h1>
      <p className="mb-8 max-w-sm text-zinc-400">
        FlowDay needs an internet connection to sync your schedule. Your cached
        data is still available once you reconnect.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
      >
        Try again
      </button>
      <p className="mt-12 text-sm text-zinc-600">
        FlowDay &mdash; Smart Student Scheduler
      </p>
    </div>
  );
}
