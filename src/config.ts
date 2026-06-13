// 앱 URL 설정 — Landing에서 comuboard-fe로 연결되는 모든 URL의 base
// 환경변수 VITE_APP_URL로 설정 가능 (dev: https://app.changju.dev/app/comuboard, prod: /app)
const APP_URL = (import.meta.env.VITE_APP_URL as string) || "";

export const appUrl = (path: string) => `${APP_URL}${path}`;

export const APP_ROUTES = {
  signup: appUrl("/register"),
  signupWithPlan: (plan: string) => appUrl(`/register?plan=${plan}`),
  createCommunity: appUrl("/communities/new"),
  explore: appUrl("/explore"),
  // STORY-285-02: "더 많은 게시판 둘러보기" → FE /boards 게시판 카탈로그 페이지
  boards: appUrl("/boards"),
  home: appUrl("/main"),
  demo: appUrl("/c/comuboard"),
  login: appUrl("/login"),
  pricing: appUrl("/pricing"),
  // STORY-178-01: Landing Footer "사업자정보" 링크 → FE /business 페이지 단일 재사용
  businessInfo: appUrl("/business"),
} as const;

// API base URL (same origin in prod, configurable for dev)
export const API_BASE =
  (import.meta.env.VITE_API_URL as string) || APP_URL || "";

/**
 * Runtime application environment.
 *
 * - "development": local Vite dev server (`npm run dev`).
 * - "staging": the dev cluster deployment.
 * - "production": the production deployment (comuboard.com).
 *
 * The primary signal is the build-time `VITE_APP_ENV` (injected per GitHub
 * environment: homelab-staging → staging, homelab-prod → production). When it
 * is absent we fall back to `import.meta.env.DEV` so the local dev server is
 * still flagged; deployed builds without the var resolve to "production".
 */
export type AppEnv = "development" | "staging" | "production";

export function getAppEnv(env: ImportMetaEnv = import.meta.env): AppEnv {
  const explicit = String(env.VITE_APP_ENV ?? "").toLowerCase();
  if (
    explicit === "development" ||
    explicit === "staging" ||
    explicit === "production"
  ) {
    return explicit;
  }
  if (env.DEV) return "development";
  return "production";
}

/** True only on the production deployment (comuboard.com). */
export function isProductionEnv(env?: ImportMetaEnv): boolean {
  return getAppEnv(env) === "production";
}
