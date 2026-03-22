export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xl font-bold text-gray-900">ComuBoard</span>
            <p className="mt-1 text-sm text-gray-500">
              커뮤니티를 위한 올인원 플랫폼
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a
              href="https://github.com/rookiecj/comuboard-be"
              className="transition hover:text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@comuboard.com"
              className="transition hover:text-gray-900"
            >
              Contact
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          &copy; {year} ComuBoard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
