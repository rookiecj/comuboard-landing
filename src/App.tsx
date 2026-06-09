// STORY-258-01 (SPRINT-258): Landing 에 BrowserRouter 도입.
// 단일 페이지였던 Landing 이 `/help/ai-byoai` BYOAI 가이드 페이지를 새로
// alive 시키면서 path-based 분기가 필요해짐. react-router-dom@6 도입.
// 기존 `/` (LandingHome) + 신규 `/help/ai-byoai` 2 route alive.
//
// BUG-259-02 (SPRINT-260 dogfood 회수): dev 환경 `/app/comuboard` (또는
// `/app/comuboard/landing/`) 진입 시 흰 화면 — BrowserRouter basename 미설정
// 회귀. Vite 의 `base: VITE_BASE_PATH` 로 asset path 는 정합하나 React Router
// 는 vite base 를 모르므로 location.pathname (`/app/comuboard/landing/...`) 가
// Route path (`/`) 와 매칭 실패. `basename={import.meta.env.BASE_URL}` 로
// router 의 base 를 vite base 와 동기화 — dev: `/app/comuboard/landing/`,
// prod: `/`. SPA fallback (index.html) 은 nginx 가 처리하고 React Router 가
// basename 으로 stripping 한 path 를 매칭한다.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { AIAssist } from "./components/AIAssist";
import { Showcase } from "./components/Showcase";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import { EnvBadge } from "./components/EnvBadge";
import { HelpAIByOAI } from "./pages/HelpAIByOAI";

function LandingHome() {
  return (
    <>
      <Hero />
      <Showcase />
      <Features />
      <AIAssist />
      <Pricing />
      <Footer />
    </>
  );
}

function App() {
  // BUG-259-02: vite `base` 가 `/app/comuboard/landing/` 로 빌드된 dev 환경에서
  // React Router 는 같은 base 를 알아야 한다. `import.meta.env.BASE_URL` 는
  // Vite 가 빌드 시점 `base` 값을 자동 expose 한 것 (trailing slash 포함).
  // React Router 의 basename 은 trailing slash 없이 받아야 하므로 정규화.
  const rawBase = import.meta.env.BASE_URL || "/";
  const basename =
    rawBase.length > 1 && rawBase.endsWith("/")
      ? rawBase.slice(0, -1)
      : rawBase;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-200 transition-colors duration-300">
      <EnvBadge />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<LandingHome />} />
          <Route path="/help/ai-byoai" element={<HelpAIByOAI />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
