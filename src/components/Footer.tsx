export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ComuBoard</span>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              커뮤니티를 위한 올인원 SaaS 플랫폼
            </p>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com/rookiecj/comuboard-be"
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@comuboard.com"
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              Contact
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
          &copy; {year} ComuBoard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
