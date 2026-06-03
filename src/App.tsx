// STORY-258-01 (SPRINT-258): Landing 에 BrowserRouter 도입.
// 단일 페이지였던 Landing 이 `/help/ai-byoai` BYOAI 가이드 페이지를 새로
// alive 시키면서 path-based 분기가 필요해짐. react-router-dom@6 도입.
// 기존 `/` (LandingHome) + 신규 `/help/ai-byoai` 2 route alive.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Showcase } from "./components/Showcase";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import { HelpAIByOAI } from "./pages/HelpAIByOAI";

function LandingHome() {
  return (
    <>
      <Hero />
      <Showcase />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-200 transition-colors duration-300">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingHome />} />
          <Route path="/help/ai-byoai" element={<HelpAIByOAI />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
