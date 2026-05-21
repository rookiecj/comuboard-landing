// guards STORY-178-01: Landing Footer 사업자정보 직접 표시 + fetch 제거 → "사업자정보" 링크로 대체
// 이전: /api/legal/business-info fetch + 10 필드 직접 렌더
// 이후: APP_ROUTES.businessInfo (=FE /business) 링크 1줄만 노출 — 페이지 진입 시 fetch
import { APP_ROUTES, appUrl } from "../config";

/** Letter colors aligned with `public/logo.png` (roof → pillars → base, left to right). */
const COMUBOARD_LOGO_LETTERS: readonly {
  readonly ch: string;
  readonly color: string;
}[] = [
  { ch: "C", color: "#48C0D4" },
  { ch: "o", color: "#97E7B0" },
  { ch: "m", color: "#97E7B0" },
  { ch: "u", color: "#97E7B0" },
  { ch: "B", color: "#FBA7BC" },
  { ch: "o", color: "#F17E5D" },
  { ch: "a", color: "#F17E5D" },
  { ch: "r", color: "#F17E5D" },
  { ch: "d", color: "#48C0D4" },
];

function ComuBoardWordmark({ className }: { readonly className?: string }) {
  return (
    <span
      className={`tracking-tight font-bold ${className ?? ""}`}
      translate="no"
    >
      {COMUBOARD_LOGO_LETTERS.map(({ ch, color }, i) => (
        <span
          key={`${ch}-${i}`}
          style={{ color }}
          className="[text-shadow:0_0_0.5px_rgba(15,23,42,0.06)] dark:[text-shadow:0_0_1px_rgba(0,0,0,0.35)]"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <ComuBoardWordmark className="text-xl" />
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              커뮤니티를 위한 올인원 SaaS 플랫폼
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 justify-center sm:justify-start">
            <a
              href={appUrl("/terms")}
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              이용약관
            </a>
            <a
              href={appUrl("/privacy")}
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              개인정보처리방침
            </a>
            <a
              href={appUrl("/refund")}
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              환불/해지 정책
            </a>
            <a
              href={APP_ROUTES.businessInfo}
              className="transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              사업자정보
            </a>
            <a
              href="mailto:admin@comuboard.com"
              className="font-medium transition hover:text-brand-500 dark:hover:text-brand-400"
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
