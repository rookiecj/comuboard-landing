// STORY-258-01 — Landing HelpAIByOAI 페이지 회귀 가드.
//
// guards STORY-258-01:
//   - 5 provider 섹션 모두 렌더링
//   - 외부 링크 tabnabbing 가드 (`rel=noopener noreferrer`)
//   - 사용자 입력 0 / PII 0 (정적 콘텐츠 알리바이)
//
// SPRINT-258 Sprint §6 A1 / A2 정합.

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { HelpAIByOAI } from "./HelpAIByOAI";

describe("HelpAIByOAI — STORY-258-01 BYOAI guide page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 5 provider sections", () => {
    render(<HelpAIByOAI />);

    // Each provider name should appear as a heading in its own section.
    expect(screen.getByText(/Anthropic Claude/)).toBeInTheDocument();
    expect(screen.getByText(/^OpenAI$/)).toBeInTheDocument();
    expect(screen.getByText(/Google Gemini/)).toBeInTheDocument();
    expect(screen.getByText(/OpenRouter/)).toBeInTheDocument();
    expect(screen.getByText(/Custom/)).toBeInTheDocument();
  });

  it("renders the BYOAI guide heading and intro", () => {
    render(<HelpAIByOAI />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /내 AI 키로 ComuBoard 사용하기/,
      }),
    ).toBeInTheDocument();
  });

  // A2 guard: 외부 링크는 모두 target=_blank + rel=noopener noreferrer.
  it("guards A2 tabnabbing: external links have rel=noopener noreferrer", () => {
    const { container } = render(<HelpAIByOAI />);

    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    expect(externalLinks.length).toBeGreaterThan(0);

    externalLinks.forEach((link) => {
      const rel = link.getAttribute("rel") ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    });
  });

  // A3 guard: external docs URLs whitelist (provider 공식 docs 만).
  it("guards A3 whitelist: external docs URLs are provider official docs only", () => {
    const { container } = render(<HelpAIByOAI />);

    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    const allowedHostSuffixes = [
      "docs.anthropic.com",
      "platform.openai.com",
      "ai.google.dev",
      "openrouter.ai",
    ];

    externalLinks.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const matched = allowedHostSuffixes.some((host) => href.includes(host));
      expect(matched, `unexpected external href: ${href}`).toBe(true);
    });
  });

  it("renders the ComuBoard registration guide section", () => {
    render(<HelpAIByOAI />);

    expect(
      screen.getByRole("heading", { name: /ComuBoard 에 등록하는 방법/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/설정 → AI/)).toBeInTheDocument();
  });

  // A1 guard: 정적 콘텐츠만 alive — 사용자 입력 form / textarea 0.
  it("guards A1 PII 0: no input form / user-supplied data", () => {
    const { container } = render(<HelpAIByOAI />);

    expect(container.querySelectorAll("input").length).toBe(0);
    expect(container.querySelectorAll("textarea").length).toBe(0);
    expect(container.querySelectorAll("form").length).toBe(0);
  });
});
