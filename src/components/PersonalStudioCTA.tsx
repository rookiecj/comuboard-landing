// STORY-284-02 (SPRINT-287): 개인 작업실 beat.
// 운영자 5팩(DomainPacks)과 청중이 다른 개인 1팩(personal-studio)을 디지털 가든
// 서사로 연결. "혼자 쓰다가, 공개하고 싶을 때" — 메모·할 일·가계부·습관을 나의
// 작업실에 모으고, 고른 글만 공개하면 작은 블로그가 되는 흐름을 한 비트로 전한다.
// Showcase 직후 삽입.
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { appUrl } from "../config";

/** CTA href — personal-studio 는 고정 registry key(injection 0). */
const PERSONAL_STUDIO_HREF = appUrl("/communities/new?pack=personal-studio");

export function PersonalStudioCTA() {
  return (
    <section
      id="personal-studio"
      className="relative overflow-hidden bg-white dark:bg-slate-900 py-20 sm:py-24 transition-colors duration-300"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 p-8 sm:p-12 text-center shadow-sm dark:shadow-none"
        >
          {/* Soft color blobs */}
          <div className="pointer-events-none absolute -top-1/3 -left-1/4 h-2/3 w-2/3 rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-2/3 w-2/3 rounded-full bg-pink-400/10 blur-[100px]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-500/40 bg-white/70 dark:bg-purple-900/30 px-4 py-1.5 text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              나의 작업실
            </span>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              혼자 쓰다가,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                공개하고 싶을 때
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              메모·할 일·가계부·습관을 나의 작업실에 모으고, 고른 글만 살며시
              공개하면 작은 블로그가 돼요.
            </p>

            <div className="mt-10">
              <a
                href={PERSONAL_STUDIO_HREF}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-base font-bold text-white shadow-[0_0_36px_-12px_rgba(59,130,246,0.5)] transition hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5"
              >
                나의 작업실 만들기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
