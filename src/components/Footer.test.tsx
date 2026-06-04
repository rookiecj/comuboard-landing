// guards STORY-178-01: Landing Footer 가 사업자정보를 직접 표시하지 않고
// APP_ROUTES.businessInfo (=FE /business) 링크로 대체. fetch 도 제거됨.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer — STORY-178-01 business info link", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders legal links and 사업자정보 link", () => {
    render(<Footer />);

    expect(screen.getByText("이용약관")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("환불/해지 정책")).toBeInTheDocument();
    expect(screen.getByText("사업자정보")).toBeInTheDocument();
  });

  // guards STORY-178-01: 사업자정보 링크는 appUrl("/business") 경유
  it("사업자정보 link points to /business under appUrl base", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: "사업자정보" });
    expect(link).toBeInTheDocument();
    // VITE_APP_URL 미설정 시 base 가 "" 라서 href="/business"
    expect(link.getAttribute("href")).toMatch(/\/business$/);
  });

  // guards STORY-178-01: Landing Footer 가 사업자정보 9 필드를 직접 표시하지 않음
  it("does NOT render business info fields inline", () => {
    render(<Footer />);

    expect(screen.queryByText(/사업자등록번호:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/통신판매업:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/호스팅:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/개인정보 보호책임자:/)).not.toBeInTheDocument();
  });

  // guards STORY-178-01: Landing Footer 가 /api/legal/business-info 를 더 이상 fetch 하지 않음
  // (fetch mock 없이 렌더해도 에러 없이 동작)
  it("renders without fetching /api/legal/business-info", () => {
    // fetch 가 mocking 안 됐을 때 호출되면 vitest 환경에서는 throw — 부재 자체가 가드
    render(<Footer />);
    // tagline 가 살아있음을 부재 가드로 사용 (board-first 리포지셔닝 슬로건)
    expect(
      screen.getByText(/게시판이 필요할 땐, 커뮤보드/),
    ).toBeInTheDocument();
  });
});
