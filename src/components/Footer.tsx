import { useEffect, useState, useRef } from "react";
import { appUrl, API_BASE } from "../config";

interface BusinessInfo {
  companyName: string;
  representative: string;
  address: string;
  businessNumber: string;
  ecommerceNumber: string;
  email: string;
  phone: string;
}

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
  const [info, setInfo] = useState<BusinessInfo | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch(`${API_BASE}/api/legal/business-info`)
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {});
  }, []);

  const hasBusinessInfo =
    info && (info.companyName || info.representative || info.address);

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
          <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
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
              href="mailto:admin@comuboard.com"
              className="font-medium transition hover:text-brand-500 dark:hover:text-brand-400"
            >
              Contact
            </a>
          </div>
        </div>

        {hasBusinessInfo && (
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 space-y-0.5">
            <p>
              {info.companyName && <span>{info.companyName}</span>}
              {info.representative && (
                <span> | 대표: {info.representative}</span>
              )}
            </p>
            {info.address && <p>{info.address}</p>}
            <p>
              {info.businessNumber && (
                <span>사업자등록번호: {info.businessNumber}</span>
              )}
              {info.ecommerceNumber && (
                <span> | 통신판매업: {info.ecommerceNumber}</span>
              )}
            </p>
            {info.email && <p>고객센터: {info.email}</p>}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
          &copy; {year} ComuBoard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
