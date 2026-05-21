// 앱 URL 설정 — Landing에서 comuboard-fe로 연결되는 모든 URL의 base
// 환경변수 VITE_APP_URL로 설정 가능 (dev: https://app.changju.dev/app/comuboard, prod: /app)
const APP_URL = (import.meta.env.VITE_APP_URL as string) || "";

export const appUrl = (path: string) => `${APP_URL}${path}`;

export const APP_ROUTES = {
  signup: appUrl("/register"),
  signupWithPlan: (plan: string) => appUrl(`/register?plan=${plan}`),
  createCommunity: appUrl("/communities/new"),
  explore: appUrl("/explore"),
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
