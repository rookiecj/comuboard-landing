import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Showcase } from "./components/Showcase";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-200 transition-colors duration-300">
      <Hero />
      <Showcase />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;
