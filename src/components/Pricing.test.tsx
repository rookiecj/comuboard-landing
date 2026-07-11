// BUG-286-07 회귀 가드 — plan_pro_yearly strikethrough 정가가 인앱 SSoT
// (migration 123 priceAmount=299000, service/promotion 50% → effective 149500)
// 와 랜딩 표시가 동일해야 한다. 이전에는 하드코딩 ₩358,800 으로 드리프트되어
// "정가×50% = 효과가" 산술이 깨져 있었다(358800*0.5=179400 ≠ 149500 로 소비자
// 오인 리스크).
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Pricing } from "./Pricing";

describe("Pricing — plan_pro_yearly 정가 인앱↔랜딩 정합 (guards BUG-286-07)", () => {
  afterEach(() => {
    cleanup();
  });

  it("연간 Pro 정가는 ₩299,000(SSoT) — 구 하드코딩 ₩358,800 이 아니다", () => {
    render(<Pricing />);

    // 기본은 월간 탭이므로 연간 탭을 클릭해 연간 카드로 전환한다.
    fireEvent.click(screen.getByRole("button", { name: /연간/ }));

    expect(screen.getByText("₩299,000")).toBeInTheDocument();
    expect(screen.queryByText("₩358,800")).toBeNull();
  });

  it("정가 × 50% 프로모션 = 효과가(₩149,500) 산술이 성립한다", () => {
    render(<Pricing />);
    fireEvent.click(screen.getByRole("button", { name: /연간/ }));

    const listPrice = 299000;
    const effectivePrice = 149500;
    expect(listPrice * 0.5).toBe(effectivePrice);
    expect(screen.getByText("₩149,500")).toBeInTheDocument();
  });
});
