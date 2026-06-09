import { getAppEnv, type AppEnv } from "../config";

/**
 * EnvBadge — non-production environment indicator for the Landing site.
 *
 * Renders a small pill in the top-right corner so it is obvious you are on the
 * dev (staging) or local Landing build, never on production (comuboard.com)
 * where it returns null. Mirrors comuboard-fe's EnvBadge.
 *
 * Decorative only: `pointer-events-none` never blocks clicks, `aria-hidden`
 * keeps it out of the accessibility tree.
 */
const BADGE: Partial<Record<AppEnv, { text: string; className: string }>> = {
  development: { text: "LOCAL", className: "bg-emerald-500 text-white" },
  staging: { text: "DEV", className: "bg-amber-500 text-white" },
};

export function EnvBadge() {
  const env = getAppEnv();
  const badge = BADGE[env];
  if (!badge) return null; // production → no badge

  return (
    <div
      aria-hidden="true"
      data-testid="env-badge"
      className="pointer-events-none fixed right-0 top-0 z-[9999] select-none"
    >
      <span
        className={`inline-flex items-center rounded-bl-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide shadow-md ${badge.className}`}
      >
        {badge.text}
      </span>
    </div>
  );
}

export default EnvBadge;
