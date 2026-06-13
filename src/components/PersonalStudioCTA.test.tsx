// STORY-284-02 (SPRINT-287): PersonalStudioCTA 통합 렌더 테스트.
// 헤드라인 + 디지털 가든 value + personal-studio 딥링크 CTA 를 단언한다.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { PersonalStudioCTA } from "./PersonalStudioCTA";

describe("PersonalStudioCTA — 개인 작업실 beat", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders headline + 디지털 가든 value copy", () => {
    render(<PersonalStudioCTA />);
    expect(screen.getByText(/혼자 쓰다가/)).toBeInTheDocument();
    expect(screen.getByText(/공개하고 싶을 때/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /메모·할 일·가계부·습관을 나의 작업실에 모으고, 고른 글만 살며시 공개하면 작은 블로그가 돼요/,
      ),
    ).toBeInTheDocument();
  });

  it("CTA links to /communities/new?pack=personal-studio", () => {
    render(<PersonalStudioCTA />);
    const cta = screen.getByRole("link", { name: /나의 작업실 만들기/ });
    expect(cta.getAttribute("href")).toContain(
      "/communities/new?pack=personal-studio",
    );
  });
});
