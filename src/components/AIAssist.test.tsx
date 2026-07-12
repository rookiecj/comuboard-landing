// 전용 AI 도우미 섹션 (v3.108.0 / SPRINT-270) 렌더 가드.
// 사실 기반 카피 + BYOAI CTA(/help/ai-byoai) 노출을 검증한다.
// 미출시 AI 액션을 약속하지 않음을 확인하는 네거티브 단언도 포함.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AIAssist } from "./AIAssist";

function renderAIAssist() {
  return render(
    <MemoryRouter>
      <AIAssist />
    </MemoryRouter>,
  );
}

describe("AIAssist — 화면을 이해하는 AI 도우미 섹션", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the AI 도우미 heading and 맥락 인식 본문", () => {
    renderAIAssist();
    expect(
      screen.getByRole("heading", { name: /화면을 이해하는/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/지금 보고 있는 공간과 게시판/),
    ).toBeInTheDocument();
  });

  it("renders the 3 보조점", () => {
    renderAIAssist();
    expect(screen.getByText("지금 화면을 이해해요")).toBeInTheDocument();
    expect(screen.getByText("도움 되는 곳에만 나타나요")).toBeInTheDocument();
    expect(screen.getByText("내 AI 키(BYOAI) 그대로")).toBeInTheDocument();
  });

  it("renders the AI 역량 카드 이관 (요약·분류)", () => {
    renderAIAssist();
    // Features 섹션에서 옮겨온 AI 기능이 AI 도우미 섹션에 모여 있어야 한다.
    expect(screen.getByText("AI 요약 파이프라인")).toBeInTheDocument();
    expect(screen.getByText("AI 자동 분류·태깅")).toBeInTheDocument();
  });

  it("links BYOAI CTA to the alive /help/ai-byoai guide", () => {
    renderAIAssist();
    const cta = screen.getByRole("link", { name: /BYOAI 연결 방법 보기/ });
    expect(cta).toHaveAttribute("href", "/help/ai-byoai");
  });

  it("renders the 무료로 시작하기 secondary CTA", () => {
    renderAIAssist();
    expect(
      screen.getByRole("link", { name: /무료로 시작하기/ }),
    ).toBeInTheDocument();
  });

  it("does not promise unshipped AI actions (사실 경계)", () => {
    renderAIAssist();
    // 후속 로드맵 액션은 약속하지 않는다.
    expect(screen.queryByText(/자동으로 만들어/)).toBeNull();
    expect(screen.queryByText(/대신 작성/)).toBeNull();
    expect(screen.queryByText(/학습해/)).toBeNull();
  });
});
