// guards STORY-346-10: Showcase 재구성 — "게시판을 골라 우리 공간을 완성" 조립 컨셉.
// 항시 3종 노출 / 담기→공간 채움+수식어 / 빼기 / 넛지 존재 / H2 카피 / reduced-motion 분기.
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  within,
} from "@testing-library/react";
import { Showcase } from "./Showcase";
import { APP_ROUTES } from "../config";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe("Showcase — STORY-346-10 공간 완성 조립", () => {
  beforeEach(() => {
    // 기본: reduced-motion 아님 (자동 순환 활성)
    mockMatchMedia(false);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders H2 카피 '게시판을 골라, 우리 공간을 완성해요'", () => {
    render(<Showcase />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /게시판을 골라/,
    );
    expect(screen.getByText(/우리 공간을 완성해요/)).toBeInTheDocument();
  });

  it("항시 표시 3종(공지·필독 / 자유 게시판 / 스터디 Q&A) 노출 (AC2)", () => {
    render(<Showcase />);
    expect(
      screen.getByRole("button", { name: /공지·필독 게시판 담기/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /자유 게시판 게시판 담기/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /스터디 Q&A 게시판 담기/ }),
    ).toBeInTheDocument();
  });

  it("'더 많은 게시판' 넛지가 전체 카탈로그(/boards)로 연결 (AC4)", () => {
    render(<Showcase />);
    const nudge = screen.getByRole("link", { name: /전체 둘러보기/ });
    expect(nudge).toBeInTheDocument();
    expect(nudge.getAttribute("href")).toBe(APP_ROUTES.boards);
  });

  it("타일을 담으면 공간 프레임이 채워지고 용도 수식어가 파생됨 (AC1·AC5)", () => {
    render(<Showcase />);
    // 담기 전 기본 헤더
    expect(screen.getByText("우리 공간")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /스터디 Q&A 게시판 담기/ }),
    );

    // 첫 담은 게시판(스터디 Q&A)에서 수식어 파생
    expect(screen.getByText("우리 스터디 공간")).toBeInTheDocument();
    expect(
      screen.getByText(/1개 게시판으로 공간이 채워지고 있어요/),
    ).toBeInTheDocument();

    // 공간 프레임 리스트에 담긴 게시판 표시
    const list = screen.getByRole("list", { name: "담은 게시판 목록" });
    expect(within(list).getByText("스터디 Q&A")).toBeInTheDocument();
  });

  it("담은 타일을 다시 누르면 공간에서 빠짐 (AC1 toggle)", () => {
    render(<Showcase />);
    const tileName = /자유 게시판 게시판/;

    fireEvent.click(screen.getByRole("button", { name: tileName }));
    let list = screen.getByRole("list", { name: "담은 게시판 목록" });
    expect(within(list).getByText("자유 게시판")).toBeInTheDocument();

    // 담긴 상태에서 aria-pressed=true, aria-label 이 '빼기'
    fireEvent.click(
      screen.getByRole("button", { name: /자유 게시판 게시판 빼기/ }),
    );
    list = screen.getByRole("list", { name: "담은 게시판 목록" });
    expect(within(list).queryByText("자유 게시판")).not.toBeInTheDocument();
  });

  it("양립 메시지 '게시판 하나로 시작해도 좋아요' 노출 (AC6)", () => {
    render(<Showcase />);
    expect(
      screen.getByText(/게시판 하나로 시작해도 좋아요/),
    ).toBeInTheDocument();
  });

  it("CTA: 무료로 시작하기(1순위) + 내 공간 만들기", () => {
    render(<Showcase />);
    const primary = screen.getByRole("link", { name: /무료로 시작하기/ });
    expect(primary.getAttribute("href")).toBe(APP_ROUTES.signup);
    const secondary = screen.getByRole("link", { name: "내 공간 만들기" });
    expect(secondary.getAttribute("href")).toBe(APP_ROUTES.createCommunity);
  });

  it("prefers-reduced-motion 시에도 고정 3종 + 순환 슬롯이 정적으로 노출 (AC3)", () => {
    mockMatchMedia(true);
    render(<Showcase />);
    // 고정 3종은 항상 노출
    expect(
      screen.getByRole("button", { name: /공지·필독 게시판 담기/ }),
    ).toBeInTheDocument();
    // 순환 슬롯도 정적으로 채워져 게시판 타일이 3종을 초과해 존재
    const tiles = screen.getAllByRole("button");
    expect(tiles.length).toBeGreaterThan(3);
  });
});
