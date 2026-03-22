import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Showcase } from "./components/Showcase";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Showcase />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;
