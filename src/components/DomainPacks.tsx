// STORY-284-01 (SPRINT-287): Landing 도메인 팩 섹션.
// vertical-saas-strategy.md §6 의 "팩별 랜딩 메시지(○○ 운영? → ○○ 팩)" 전환
// 레버를 landing 에 적용. 운영자 5팩(동호회/교회/학교/스터디/스포츠)을 탭으로
// 전환하며, 각 팩 카드에 페르소나 후크 + 보드칩(registry 정합) + 차별화 한 줄 +
// `?pack={registry-key}` 딥링크 CTA 를 노출한다. Hero 직후 삽입.
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Church,
  GraduationCap,
  BookOpen,
  Dumbbell,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import { appUrl } from "../config";

/**
 * 도메인 팩 데이터 — landing 정적 매핑(전략 결정: API 동기화 과함).
 * boards[] 개수는 출시 6팩 registry 와 정합해야 한다(테스트가 보드칩 개수를 단언).
 * key 는 위저드 `?pack=` 계약과 공유하는 registry key.
 */
export interface DomainPack {
  readonly key: string;
  readonly emoji: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly persona: string;
  readonly value: string;
  readonly boards: readonly string[];
  readonly differentiator: string;
}

// 표시 순서: 동호회 → 교회 → 학교 → 스터디 → 스포츠 → 나의 작업실(개인)
export const DOMAIN_PACKS: readonly DomainPack[] = [
  {
    key: "hobby-club",
    emoji: "🎯",
    icon: Users,
    label: "동호회",
    persona: "동호회 총무세요?",
    value: "회비·출석·정모 신청을 한곳에 모아 모임 운영이 한결 가벼워져요.",
    boards: ["회비", "N빵", "출석", "정모/번개", "갤러리", "공지", "자유"],
    differentiator: "회비 납부 현황을 회차별로 한눈에 · 번개는 1탭 참석",
  },
  {
    key: "church-operations",
    emoji: "⛪",
    icon: Church,
    label: "교회",
    persona: "교회 운영, 흩어진 일을 한곳에",
    value: "출석·헌금·주보·봉사 편성까지 교회 살림을 한 공간에서 챙겨요.",
    boards: [
      "출석",
      "헌금장부",
      "공지",
      "행사",
      "주보",
      "중보기도",
      "봉사편성",
    ],
    differentiator: "주보 발행부터 봉사 편성·중보기도까지",
  },
  {
    key: "school-operations",
    emoji: "🎓",
    icon: GraduationCap,
    label: "학교/학원",
    persona: "수업 운영하세요?",
    value: "과제 제출·채점부터 성적·학부모 안내까지 수업 살림이 깔끔해져요.",
    boards: ["과제", "출석", "수업료", "가정통신문", "시간표", "성적"],
    differentiator: "과제 제출·채점부터 성적·학부모 안내까지",
  },
  {
    key: "study-group",
    emoji: "📚",
    icon: BookOpen,
    label: "스터디",
    persona: "스터디 운영하세요?",
    value: "진도·과제·Q&A·자료실을 한 공간에 모아 스터디가 끊기지 않아요.",
    boards: ["진도", "과제", "출석", "Q&A", "자료실", "회비"],
    differentiator: "진도·자료실·Q&A를 한 공간에",
  },
  {
    key: "sports-club",
    emoji: "⚽",
    icon: Dumbbell,
    label: "스포츠",
    persona: "운동 모임 매니저세요?",
    value: "출석·회비·경기 기록·라인업 편성을 한 번에 챙겨요.",
    boards: ["출석", "회비", "경기", "라인업", "공지"],
    differentiator: "경기 기록·라인업 편성까지",
  },
  {
    key: "personal-studio",
    emoji: "📓",
    icon: NotebookPen,
    label: "나의 작업실",
    persona: "혼자 쓰세요?",
    value:
      "메모·할 일·가계부·습관을 나만의 작업실에 모으고, 고른 글만 살며시 공개하면 작은 블로그가 돼요.",
    boards: [
      "메모",
      "할 일",
      "저널",
      "북마크",
      "자료실",
      "컬렉션",
      "위시리스트",
      "가계부",
      "습관",
    ],
    differentiator: "고른 글만 공개하는 디지털 가든 — 개인 블로그·포트폴리오로",
  },
] as const;

/** CTA href — key 는 고정 상수(injection 0). appUrl 헬퍼로 base 정합. */
function packCtaHref(key: string): string {
  return appUrl(`/communities/new?pack=${key}`);
}

function BoardChip({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
    </span>
  );
}

function PackCard({ pack }: { readonly pack: DomainPack }) {
  const Icon = pack.icon;
  return (
    <div className="relative flex w-full flex-col gap-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 backdrop-blur-md p-7 sm:p-8 shadow-sm dark:shadow-none">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-2xl shadow-inner ring-1 ring-slate-900/5 dark:ring-white/10"
          aria-hidden
        >
          <span>{pack.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {pack.persona}
          </h3>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {pack.value}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pack.boards.map((board) => (
          <BoardChip key={board} label={board} />
        ))}
      </div>

      <p className="flex items-start gap-2 text-sm font-medium text-brand-600 dark:text-brand-400">
        <span aria-hidden>✦</span>
        <span>{pack.differentiator}</span>
      </p>

      <div>
        <a
          href={packCtaHref(pack.key)}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_-12px_rgba(59,130,246,0.5)] transition hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5"
        >
          <Icon className="h-4 w-4" aria-hidden />
          이 팩으로 시작하기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export function DomainPacks() {
  const [activeKey, setActiveKey] = useState<string>(DOMAIN_PACKS[0].key);
  const activePack =
    DOMAIN_PACKS.find((p) => p.key === activeKey) ?? DOMAIN_PACKS[0];

  // 모바일 가로 스크롤 카드 ref — 탭 선택 시 해당 카드를 보이도록 스크롤.
  // 데스크탑은 카드 리스트가 `sm:hidden`(display:none)이라 scrollIntoView no-op
  // (데스크탑은 AnimatePresence 활성 카드가 제자리에 항상 노출).
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelect = (key: string) => {
    setActiveKey(key);
    cardRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section
      id="domain-packs"
      className="relative overflow-hidden bg-white dark:bg-slate-900 py-24 sm:py-32 transition-colors duration-300"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            이런 곳에서{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
              쓰고 있어요
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            운영에 필요한 게시판이 세트로 준비돼 있어요. 1분이면 시작.
          </p>
        </motion.div>

        {/* Tab/filter row (5 packs) */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {DOMAIN_PACKS.map((pack) => {
            const isActive = pack.key === activeKey;
            return (
              <button
                key={pack.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelect(pack.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_24px_-10px_rgba(59,130,246,0.6)]"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <span aria-hidden>{pack.emoji}</span>
                {pack.label}
              </button>
            );
          })}
        </div>

        {/* Desktop/tablet: animated selected-pack card */}
        <div className="mt-10 hidden sm:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePack.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-2xl"
            >
              <PackCard pack={activePack} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: horizontal scroll of all pack cards */}
        <div className="mt-10 sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
            {DOMAIN_PACKS.map((pack) => (
              <div
                key={pack.key}
                ref={(el) => {
                  cardRefs.current[pack.key] = el;
                }}
                className="w-[85vw] max-w-xs flex-shrink-0 snap-center"
              >
                <PackCard pack={pack} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
