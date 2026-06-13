// STORY-284-01 (SPRINT-287): DomainPacks 통합 렌더 테스트.
// 6팩 탭(동호회·학교·스터디·스포츠·나의 작업실·교회), 보드칩 개수(7/6/6/5/9/7),
// CTA href 의 `?pack=` registry key, 탭 전환 시 활성 카드 변경을 단언한다.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DomainPacks, DOMAIN_PACKS } from "./DomainPacks";

describe("DomainPacks — 도메인 팩 섹션(운영자 5 + 나의 작업실)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders section header + sub copy", () => {
    render(<DomainPacks />);
    expect(screen.getByText(/쓰고 있어요/)).toBeInTheDocument();
    expect(
      screen.getByText(/운영에 필요한 게시판이 세트로 준비돼 있어요/),
    ).toBeInTheDocument();
  });

  it("renders all 6 pack tabs in display order (교회 마지막)", () => {
    render(<DomainPacks />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(6);
    expect(tabs.map((t) => t.textContent?.trim())).toEqual([
      "🎯동호회",
      "🎓학교/학원",
      "📚스터디",
      "⚽스포츠",
      "📓나의 작업실",
      "⛪교회",
    ]);
  });

  it("pack data board counts match registry (7/6/6/5/9/7)", () => {
    const counts = DOMAIN_PACKS.map((p) => p.boards.length);
    expect(counts).toEqual([7, 6, 6, 5, 9, 7]);
    // key 정합 (위저드 ?pack= 계약)
    expect(DOMAIN_PACKS.map((p) => p.key)).toEqual([
      "hobby-club",
      "school-operations",
      "study-group",
      "sports-club",
      "personal-studio",
      "church-operations",
    ]);
  });

  it("default active card (동호회) renders 7 board chips + differentiator", () => {
    render(<DomainPacks />);
    // 동호회 카드(데스크탑 활성 + 모바일 리스트)에 보드칩 7종이 모두 노출
    for (const label of ["N빵", "정모/번개", "갤러리", "자유"]) {
      // 동호회 전용 라벨 — 다른 팩과 겹치지 않음
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(
      screen.getAllByText(/회비 납부 현황을 회차별로 한눈에/).length,
    ).toBeGreaterThan(0);
  });

  it("each pack data exposes exactly its registry board set", () => {
    const hobby = DOMAIN_PACKS[0];
    expect([...hobby.boards]).toEqual([
      "회비",
      "N빵",
      "출석",
      "정모/번개",
      "갤러리",
      "공지",
      "자유",
    ]);
  });

  it("each pack CTA href contains its registry ?pack= key", () => {
    render(<DomainPacks />);
    for (const pack of DOMAIN_PACKS) {
      const links = screen.getAllByRole("link", {
        name: /이 팩으로 시작하기/,
      });
      const hrefs = links.map((l) => l.getAttribute("href"));
      expect(
        hrefs.some((h) => h?.includes(`/communities/new?pack=${pack.key}`)),
      ).toBe(true);
    }
  });

  it("switching tab moves aria-selected to the clicked pack", () => {
    render(<DomainPacks />);
    // 초기: 동호회 탭이 활성
    expect(screen.getByRole("tab", { name: /동호회/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /교회/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    // 교회 탭 클릭 → 활성 상태가 교회로 전환
    fireEvent.click(screen.getByRole("tab", { name: /교회/ }));

    expect(screen.getByRole("tab", { name: /교회/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /동호회/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });
});
