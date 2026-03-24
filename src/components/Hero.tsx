import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { APP_ROUTES } from "../config";

/**
 * Best-effort auth detection for the landing page.
 * The FE stores auth state in localStorage via zustand persist (key: "auth-storage").
 * When Landing and FE share the same origin (comuboard.com), this works directly.
 * Falls back to checking cookies for backwards compatibility.
 */
function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.token) return true;
    }
  } catch {
    // localStorage may be unavailable or data malformed
  }
  return document.cookie.split(";").some((c) => c.trim().startsWith("token="));
}

export function Hero() {
  const authenticated = isAuthenticated();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/hero-bg.webp"
          alt="Comuboard Hero Background"
          className="w-full h-full object-cover opacity-80 dark:opacity-70 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700"
        />
        {/* Blur overlay to make text readable, giving the image a 'slight transparency' feel */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-500" />

        {/* Vibrant color blobs matching the ComuBoard app theme (Blue, Purple, Orange, Pink) */}
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] sm:w-[120%] sm:h-[120%] bg-blue-500/10 dark:bg-blue-600/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-purple-500/10 dark:bg-purple-600/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-pink-500/10 dark:bg-pink-600/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-orange-400/10 dark:bg-orange-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />

        {/* Bottom gradient mask feeding into next section */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent transition-colors duration-500" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/40 px-5 py-2 text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all relative overflow-hidden"
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm z-10 text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="relative z-10">
            ComuBoard 런칭!{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 font-extrabold mx-1">
              Pro 플랜 50% 할인
            </span>{" "}
            🎉
          </span>
        </motion.div>

        {/* Text color emphasis on '이야기' */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 text-slate-900 dark:text-white drop-shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          {/* Main Logo Icon next to the title */}
          <img
            src="/logo.png"
            alt="ComuBoard Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-xl"
          />

          <span className="leading-tight">
            우리의{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 inline-block">
              이야기
            </span>
            가 <br className="hidden sm:block" />
            쌓이는 곳
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium"
        >
          링크 하나, 멘션 하나로 시작하세요.
          <br className="hidden sm:block" />
          AI와 자동화가 커뮤니티의 지식으로 다듬어 드립니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {authenticated ? (
            <a
              href={APP_ROUTES.createCommunity}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5"
            >
              내 커뮤니티 만들기
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <a
              href={APP_ROUTES.signup}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5"
            >
              무료로 시작하기
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-8 py-4 text-base font-bold text-slate-900 dark:text-white backdrop-blur-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-0.5"
          >
            기능 살펴보기
          </a>
        </motion.div>

        {!authenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-center"
          >
            <a
              href={APP_ROUTES.demo}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              데모 커뮤니티 둘러보기
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
