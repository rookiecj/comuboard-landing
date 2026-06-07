// 전용 AI 도우미 섹션 (v3.108.0 / SPRINT-270 AI Assist 화면 컨텍스트):
// AI 어시스턴트가 "지금 보고 있는 화면(공간/게시판/글) + 로그인 맥락"을
// 이해해 더 알맞게 답하는 라이브 역량을 사용자 친화 카피로 노출한다.
// 미출시 AI 액션(공간생성 banner 자동 등)은 약속하지 않으며, BYOAI/PII 는
// 사실 그대로만 표현한다(내 AI 키 연결까지만, "내 데이터로 학습" 단정 X).
// CTA 는 이미 alive 한 /help/ai-byoai 가이드로 연결해 사실·법적 안전 유지.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Eye,
  MousePointerClick,
  KeyRound,
  ChevronRight,
} from "lucide-react";
import { APP_ROUTES } from "../config";

interface AIPoint {
  readonly title: string;
  readonly icon: typeof Eye;
  readonly color: string;
}

const aiPoints: readonly AIPoint[] = [
  {
    title: "지금 화면을 이해해요",
    icon: Eye,
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    title: "도움 되는 곳에만 나타나요",
    icon: MousePointerClick,
    color: "text-purple-500 dark:text-purple-400",
  },
  {
    title: "내 AI 키(BYOAI) 그대로",
    icon: KeyRound,
    color: "text-pink-500 dark:text-pink-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AIAssist() {
  return (
    <section
      id="ai-assist"
      className="relative overflow-hidden border-t border-slate-200 bg-slate-50 py-24 transition-colors duration-300 dark:border-slate-800/50 dark:bg-slate-950 sm:py-32"
    >
      {/* Soft color blobs matching the app theme */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -top-1/4 left-1/4 h-3/4 w-3/4 rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/10" />
        <div className="absolute bottom-0 right-1/4 h-1/2 w-1/2 rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-600/10" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          AI 도우미
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
        >
          화면을 이해하는{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 font-extrabold">
            AI 도우미
          </span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400"
        >
          지금 보고 있는 공간과 게시판, 작성 중인 글을 AI가 함께 봐요. 그래서
          같은 질문에도 지금 맥락에 더 알맞게 답해요. 도움이 되는 화면에서만
          살짝 나타나니 흐름을 방해하지 않아요. 내 AI 키를 연결하는 BYOAI로
          원하는 모델을 그대로 쓸 수도 있어요.
        </motion.p>

        {/* 보조점 3 */}
        <motion.ul
          variants={itemVariants}
          className="mx-auto mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row"
        >
          {aiPoints.map((point) => {
            const Icon = point.icon;
            return (
              <li
                key={point.title}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:shadow-none"
              >
                <Icon className={`h-5 w-5 shrink-0 ${point.color}`} />
                {point.title}
              </li>
            );
          })}
        </motion.ul>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/help/ai-byoai"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700"
          >
            BYOAI 연결 방법 보기
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={APP_ROUTES.home}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-8 py-4 text-base font-bold text-slate-900 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:hover:border-blue-600 dark:hover:bg-slate-700"
          >
            무료로 시작하기
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
