import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a13]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 text-xs font-black text-slate-950">
            TP
          </span>
          <span className="text-lg font-bold tracking-tight">
            Test<span className="text-sky-400">Pulse</span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-300">
          <Link href="/" className="transition-colors hover:text-white">
            Latest
          </Link>
          <Link href="/#feed" className="transition-colors hover:text-white">
            Trends
          </Link>
          <Link href="/#sources" className="transition-colors hover:text-white">
            Sources
          </Link>
        </nav>
      </div>
    </header>
  );
}
