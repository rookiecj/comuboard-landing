// STORY-346-10: 랜딩 Showcase 재구성 — "게시판을 골라, 우리 공간을 완성해요".
// 좌: 게시판 타일 팔레트(고정 3종 + 순환 슬롯 + 넛지) / 우: "우리 공간" 프레임(sticky).
// 타일을 눌러 담으면 공간 프레임이 채워지고, 다시 눌러 뺀다. brand-positioning §7 정합:
// H1/슬로건은 Hero 불변, 컨테이너어="공간", 코드 식별자/라우트 불변.
import { useMemo, useState } from "react";
import { ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { APP_ROUTES } from "../config";
import {
  BOARD_BY_KEY,
  CYCLING_BOARDS,
  FIXED_BOARDS,
  type ShowcaseBoard,
} from "./showcase/boards";
import {
  useCyclingSlots,
  usePrefersReducedMotion,
} from "./showcase/useCyclingSlots";

const CYCLE_SLOT_COUNT = 3;
const CYCLE_INTERVAL_MS = 2300;

/** 담기/빼기 가능한 게시판 타일 (팔레트 항목). */
function BoardTile({
  board,
  added,
  onToggle,
}: {
  readonly board: ShowcaseBoard;
  readonly added: boolean;
  readonly onToggle: (key: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={`${board.name} 게시판 ${added ? "빼기" : "담기"}`}
      onClick={() => onToggle(board.key)}
      className={`group relative flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
        added
          ? "border-brand-500 bg-brand-50 dark:border-brand-400/60 dark:bg-brand-900/25"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50 dark:hover:border-slate-600"
      }`}
    >
      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl dark:bg-slate-700/60"
        aria-hidden
      >
        {board.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900 dark:text-white">
          {board.name}
        </span>
        <span className="mt-1.5 flex flex-wrap gap-1">
          {board.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                added
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
              }`}
            >
              {tag}
            </span>
          ))}
        </span>
      </span>
      <span
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
          added
            ? "bg-brand-500 text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
        }`}
        aria-hidden
      >
        {added ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Plus className="h-4 w-4" strokeWidth={3} />
        )}
      </span>
    </button>
  );
}

/** 우측 "우리 공간" 프레임 — 담긴 게시판으로 채워지는 정체성 카드. */
function SpaceFrame({ addedKeys }: { readonly addedKeys: readonly string[] }) {
  const addedBoards = useMemo(
    () =>
      addedKeys
        .map((k) => BOARD_BY_KEY.get(k))
        .filter((b): b is ShowcaseBoard => Boolean(b)),
    [addedKeys],
  );
  const first = addedBoards[0];
  const headerEmoji = first?.emoji ?? "🏠";
  const spaceTitle = first ? `우리 ${first.spaceLabel} 공간` : "우리 공간";
  const count = addedBoards.length;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 sm:p-8">
        <div className="flex items-center gap-3">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 text-3xl shadow-inner"
            aria-hidden
          >
            {headerEmoji}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-slate-900 dark:text-white">
              {spaceTitle}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {count > 0
                ? `${count}개 게시판으로 공간이 채워지고 있어요`
                : "게시판을 담아 공간을 채워보세요"}
            </p>
          </div>
        </div>

        {/* 진행 바 */}
        <div
          className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-label="담은 게시판 수"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
            initial={false}
            animate={{
              width: `${Math.min(100, count * 18 + (count ? 10 : 0))}%`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>

        {/* 담긴 게시판 리스트 */}
        <ul className="mt-5 space-y-2" aria-label="담은 게시판 목록">
          {addedBoards.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
              왼쪽에서 게시판을 눌러 담아보세요
            </li>
          ) : (
            addedBoards.map((board) => (
              <motion.li
                key={board.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60"
              >
                <span className="text-xl" aria-hidden>
                  {board.emoji}
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  {board.name}
                </span>
              </motion.li>
            ))
          )}
        </ul>

        {/* 양립 메시지 (AC6) */}
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Sparkles
            className="h-4 w-4 flex-shrink-0 text-brand-500"
            aria-hidden
          />
          게시판 하나로 시작해도 좋아요.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={APP_ROUTES.signup}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            무료로 시작하기
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={APP_ROUTES.createCommunity}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            내 공간 만들기
          </a>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [added, setAdded] = useState<readonly string[]>([]);
  const [paused, setPaused] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  const addedSet = useMemo(() => new Set(added), [added]);

  const cyclingBoards = useCyclingSlots({
    pool: CYCLING_BOARDS,
    excludeKeys: addedSet,
    slotCount: CYCLE_SLOT_COUNT,
    intervalMs: CYCLE_INTERVAL_MS,
    paused,
    enabled: !prefersReduced,
  });

  const toggle = (key: string) =>
    setAdded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 transition-colors duration-300 dark:bg-slate-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            게시판을 골라,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              우리 공간을 완성해요
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
            필요한 게시판을 하나씩 담으면 우리만의 공간이 완성돼요.{" "}
            <br className="hidden sm:block" />
            쓰다 보면 게시판이 모여 커뮤니티로 자라요.
          </p>
        </motion.div>

        {/* 조립 인터랙션: 좌 팔레트 / 우 공간 프레임 */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* 좌: 게시판 팔레트 — 호버/포커스 중 순환 정지 (AC3) */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              게시판 고르기
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* 고정 3종 (AC2) */}
              {FIXED_BOARDS.map((board) => (
                <BoardTile
                  key={board.key}
                  board={board}
                  added={addedSet.has(board.key)}
                  onToggle={toggle}
                />
              ))}
              {/* 순환 슬롯 (AC3) — 크로스페이드 교체 */}
              <AnimatePresence mode="popLayout" initial={false}>
                {cyclingBoards.map((board) => (
                  <motion.div
                    key={board.key}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                  >
                    <BoardTile
                      board={board}
                      added={addedSet.has(board.key)}
                      onToggle={toggle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* "더 많은 게시판" 넛지 (AC4) — 점선·비토글, 전체 카탈로그로 유도 */}
              <a
                href={APP_ROUTES.boards}
                className="group col-span-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-4 text-center text-sm font-semibold text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-400/60 dark:hover:text-brand-300 sm:col-span-2"
              >
                이 외에도 더 있어요 · 전체 둘러보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* 우: 우리 공간 프레임 */}
          <SpaceFrame addedKeys={added} />
        </div>
      </div>
    </section>
  );
}
