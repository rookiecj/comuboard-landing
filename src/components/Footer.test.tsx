// guards STORY-170-03: Landing Footer 사업자정보 확장 + 통판번호 placeholder
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { Footer } from "./Footer";

interface BusinessInfoFixture {
  companyName: string;
  representative: string;
  address: string;
  businessNumber: string;
  ecommerceNumber: string;
  email: string;
  phone: string;
  hosting?: string;
  privacyOfficerName?: string;
  privacyOfficerEmail?: string;
}

const fullBusinessInfo: BusinessInfoFixture = {
  companyName: "주식회사 컴유보드",
  representative: "홍길동",
  address: "서울시 강남구 테헤란로 1",
  businessNumber: "123-45-67890",
  ecommerceNumber: "2026-서울강남-0123",
  email: "support@comuboard.com",
  phone: "02-1234-5678",
  hosting: "Amazon Web Services",
  privacyOfficerName: "김보호",
  privacyOfficerEmail: "privacy@comuboard.com",
};

function mockFetchSuccess(payload: BusinessInfoFixture) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => payload,
  } as Response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function mockFetchFailure() {
  const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("Footer — STORY-170-03 business info", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders all business info fields when API returns full payload", async () => {
    mockFetchSuccess(fullBusinessInfo);

    render(<Footer />);

    expect(await screen.findByText(/주식회사 컴유보드/)).toBeInTheDocument();
    expect(screen.getByText(/대표: 홍길동/)).toBeInTheDocument();
    expect(screen.getByText(/서울시 강남구 테헤란로 1/)).toBeInTheDocument();
    expect(
      screen.getByText(/사업자등록번호: 123-45-67890/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/통신판매업: 2026-서울강남-0123/),
    ).toBeInTheDocument();
    expect(screen.getByText(/호스팅: Amazon Web Services/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /개인정보 보호책임자: 김보호 \(privacy@comuboard\.com\)/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/고객센터: support@comuboard\.com/),
    ).toBeInTheDocument();
  });

  it("shows '통신판매업: 준비 중' placeholder when ecommerceNumber is empty", async () => {
    mockFetchSuccess({
      ...fullBusinessInfo,
      ecommerceNumber: "",
    });

    render(<Footer />);

    expect(await screen.findByText(/통신판매업: 준비 중/)).toBeInTheDocument();
    // sanity: 다른 항목은 정상 노출
    expect(
      screen.getByText(/사업자등록번호: 123-45-67890/),
    ).toBeInTheDocument();
  });

  it("hides business info block when API fetch fails but keeps legal links", async () => {
    mockFetchFailure();

    render(<Footer />);

    // 약관 링크는 항상 유지 (fetch와 무관)
    expect(screen.getByText("이용약관")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("환불/해지 정책")).toBeInTheDocument();

    // 사업자정보 블록 미렌더 (fetch 끝난 뒤에도 노출 안 됨)
    await waitFor(() => {
      expect(screen.queryByText(/사업자등록번호:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/통신판매업:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/호스팅:/)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/개인정보 보호책임자:/),
      ).not.toBeInTheDocument();
    });
  });
});
