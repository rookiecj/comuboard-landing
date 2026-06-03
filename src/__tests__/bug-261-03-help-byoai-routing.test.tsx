// guards BUG-261-03: Landing BYOAI 도움말 경로 정합. SPRINT-258 시점 alive
// 한 `/help/ai-byoai` Route 가 SPRINT-260 BUG-259-02 BrowserRouter basename
// fix 이후에도 dev sub-path mount 환경에서 정상 routing 된다는 점을 회귀
// 가드로 박제한다.
//
// 검증 axis:
//   (1) MemoryRouter initialEntries={["/help/ai-byoai"]} 에서 HelpAIByOAI
//       컴포넌트가 mount 되고 핵심 콘텐츠 ("BYOAI 가이드" 등) 가 가시화된다.
//   (2) MemoryRouter initialEntries={["/"]} 에서는 LandingHome 만 mount
//       되고 HelpAIByOAI 는 mount 되지 않는다 (Route 분리 정합).

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelpAIByOAI } from "../pages/HelpAIByOAI";

function LandingHome() {
  return <div data-testid="landing-home">Landing Home</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingHome />} />
      <Route path="/help/ai-byoai" element={<HelpAIByOAI />} />
    </Routes>
  );
}

describe("BUG-261-03 — Landing BYOAI 도움말 routing 정합", () => {
  it("guards BUG-261-03: /help/ai-byoai under MemoryRouter routes to HelpAIByOAI", () => {
    // initialEntries 가 `/help/ai-byoai` 일 때 HelpAIByOAI 가 mount 된다.
    // dev 환경에서는 React Router 가 BASE_URL stripping 후 동일한 path 를
    // 매칭하므로 본 test 가 회귀 가드.
    render(
      <MemoryRouter initialEntries={["/help/ai-byoai"]}>
        <App />
      </MemoryRouter>,
    );
    // HelpAIByOAI 의 핵심 콘텐츠 — header 텍스트.
    expect(
      screen.getByText(/내 AI 키로 ComuBoard 사용하기/),
    ).toBeInTheDocument();
    // BYOAI 가이드 라벨.
    expect(screen.getByText(/BYOAI 가이드/)).toBeInTheDocument();
    // LandingHome 은 mount 되지 않는다.
    expect(screen.queryByTestId("landing-home")).not.toBeInTheDocument();
  });

  it("guards BUG-261-03: / under MemoryRouter routes to LandingHome (not HelpAIByOAI)", () => {
    // 분리 정합 — root path 가 HelpAIByOAI 를 mount 하지 않음.
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("landing-home")).toBeInTheDocument();
    expect(
      screen.queryByText(/내 AI 키로 ComuBoard 사용하기/),
    ).not.toBeInTheDocument();
  });
});
