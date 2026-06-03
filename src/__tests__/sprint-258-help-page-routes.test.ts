// STORY-258-01 (SPRINT-258): static lint guard — `/help/ai-byoai` route 가
// App.tsx 에 alive 한지 grep 으로 검증한다.
//
// 회귀 차단:
//   - 누군가 App.tsx 의 Routes 에서 `/help/ai-byoai` 를 실수로 지우면
//     BE ai_chat secondary "도움말 보기" action 이 404 로 떨어진다.
//   - 본 test 는 path-based static grep — runtime navigation 검증은
//     HelpAIByOAI.test.tsx 가 담당.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("SPRINT-258 — /help/ai-byoai route alive guard", () => {
  it("guards STORY-258-01: App.tsx registers /help/ai-byoai route", () => {
    const appPath = resolve(__dirname, "../App.tsx");
    const source = readFileSync(appPath, "utf-8");

    // BrowserRouter 도입 알리바이.
    expect(source).toContain("BrowserRouter");
    expect(source).toContain("Routes");
    expect(source).toContain("Route");

    // 신규 도움말 페이지 route 알리바이.
    expect(source).toContain("/help/ai-byoai");
    expect(source).toContain("HelpAIByOAI");
  });

  it("guards STORY-258-01: HelpAIByOAI page module exists", () => {
    const pagePath = resolve(__dirname, "../pages/HelpAIByOAI.tsx");
    const source = readFileSync(pagePath, "utf-8");

    expect(source).toContain("export function HelpAIByOAI");
    // A2: tabnabbing 가드 코드 알리바이 (외부 링크 rel=noopener noreferrer).
    expect(source).toContain('rel="noopener noreferrer"');
  });
});
