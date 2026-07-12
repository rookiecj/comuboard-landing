// 게시판 중심 리브랜딩 후속 — Features 섹션 통합:
// 3가지 축(pillar) 섹션을 삭제하고 모든 기능을 "몰입을 돕는 강력한 도구들"
// 단일 섹션에 통합. 모으다 첫 메시지 "글 작성이 편해요"는 마크다운 에디터→
// 미리보기 쇼케이스로 상단에 노출.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Features } from "./Features";

describe("Features — 통합 도구 섹션 + 마크다운 글쓰기 쇼케이스", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the '글 작성이 편해요' markdown editor → preview showcase", () => {
    render(<Features />);
    expect(screen.getByText(/글 작성이 편해요/)).toBeInTheDocument();
    expect(screen.getByText(/확장 마크다운/)).toBeInTheDocument();
    expect(screen.getByText("post.md")).toBeInTheDocument();
    expect(screen.getByText("미리보기")).toBeInTheDocument();
  });

  it("consolidates all features into the single 도구들 section", () => {
    render(<Features />);
    expect(screen.getByText(/몰입을 돕는 강력한/)).toBeInTheDocument();
    // 모으다/다듬다/나누다 + 몰입 도구가 한 섹션에 공존
    expect(screen.getByText("RSS 피드 수집")).toBeInTheDocument();
    expect(screen.getByText("투표 & 스레드")).toBeInTheDocument();
    expect(screen.getByText("QR코드 보드 접속")).toBeInTheDocument();
    expect(screen.getByText("완벽한 몰입, Zen 모드")).toBeInTheDocument();
  });

  it("moves AI features out to the AI 도우미 section", () => {
    render(<Features />);
    // AI 관련 기능(요약·자동분류·화면 이해 도우미)은 AIAssist 섹션으로 이관됨.
    expect(screen.queryByText("AI 요약 파이프라인")).toBeNull();
    expect(screen.queryByText("AI 자동 분류")).toBeNull();
    expect(screen.queryByText("화면을 이해하는 AI 도우미")).toBeNull();
  });

  it("removes the standalone 3-축 pillar section", () => {
    render(<Features />);
    // 구 pillar tagline / 라벨은 더 이상 존재하지 않음
    expect(screen.queryByText("글이 쉽게 올라오는 게시판")).toBeNull();
    expect(screen.queryByText("좋은 게시판이 하는")).toBeNull();
    expect(screen.queryByText(/이렇게 자동으로도 모여요/)).toBeNull();
  });
});
