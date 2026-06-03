// BUG-259-02 (SPRINT-260 dogfood 회수): dev 환경 `/app/comuboard` 진입 시
// 흰 화면. 원인 — BrowserRouter basename 미설정. vite `base: VITE_BASE_PATH`
// 로 asset path 는 정합하나 React Router 는 vite base 를 모르므로
// location.pathname (`/app/comuboard/landing/...`) 가 Route path (`/`) 와
// 매칭 실패.
//
// 회귀 가드:
//   1. App.tsx 가 BrowserRouter 에 basename prop 을 명시한다.
//   2. basename 은 vite 가 자동 expose 하는 `import.meta.env.BASE_URL` 에서
//      유도한다 (빌드 시점 base 동기화). 하드코딩된 path 금지 — dev/prod 가
//      각자 다른 base 를 가지므로 환경변수 경유 필수.
//   3. trailing slash 정규화 — Vite BASE_URL 은 `/foo/` 형태로 노출되지만
//      React Router basename 은 `/foo` 를 받아야 함.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("BUG-259-02 — BrowserRouter basename guard", () => {
  it("guards BUG-259-02: App.tsx sets BrowserRouter basename prop", () => {
    const appPath = resolve(__dirname, "../App.tsx");
    const source = readFileSync(appPath, "utf-8");

    // BrowserRouter 가 basename prop 을 넘긴다.
    expect(source).toMatch(/<BrowserRouter\s+basename=/);
  });

  it("guards BUG-259-02: basename derives from import.meta.env.BASE_URL (vite-synced)", () => {
    const appPath = resolve(__dirname, "../App.tsx");
    const source = readFileSync(appPath, "utf-8");

    // 하드코딩된 path 금지 — dev (`/app/comuboard/landing`) / prod (`/`) 가
    // 다른 base 를 가지므로 vite 자동 환경변수 경유.
    expect(source).toContain("import.meta.env.BASE_URL");

    // 하드코딩 회귀 차단 — 누군가 `/app/comuboard/landing` 을 직접
    // basename 으로 박으면 prod 빌드 (base=/) 에서 404.
    expect(source).not.toMatch(/basename=["']\/app\/comuboard/);
  });

  it("guards BUG-259-02: trailing slash normalization in basename", () => {
    // Vite 의 BASE_URL 은 trailing slash 를 포함하지만 React Router
    // basename 은 trailing slash 가 없는 형태를 받아야 한다 (있으면 매칭
    // 실패). App.tsx 는 normalize 로직을 포함해야 한다.
    const appPath = resolve(__dirname, "../App.tsx");
    const source = readFileSync(appPath, "utf-8");

    // normalize 로직 알리바이 — slice(0,-1) 또는 replace(/\/$/, '') 등
    // trailing slash 제거 패턴이 존재해야 함.
    const hasNormalize =
      /\.slice\(0,\s*-1\)/.test(source) ||
      /replace\(\/\\?\/\$\//.test(source) ||
      /endsWith\(["']\/["']\)/.test(source);
    expect(hasNormalize).toBe(true);
  });
});
