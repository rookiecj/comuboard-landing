// STORY-346-10: 순환 슬롯 훅 + prefers-reduced-motion 훅.
// 순환 슬롯은 큰 게시판 풀에서 slotCount 개를 부드럽게 교체하며, 호버/포커스 중
// 정지하고, reduced-motion 시 자동 순환을 멈춘다 (정적 노출). useEffect deps 무한루프
// 방지를 위해 매 틱에서 참조하는 값은 ref 로 안정화한다 (coding-style.md 규칙).
import { useEffect, useMemo, useRef, useState } from "react";
import type { ShowcaseBoard } from "./boards";

/** OS 의 prefers-reduced-motion 설정을 반영 (jsdom 등 matchMedia 부재 시 false). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
}

interface CyclingSlotsOptions {
  /** 순환 대상 전체 풀 (고정 게시판 제외). */
  readonly pool: readonly ShowcaseBoard[];
  /** 이미 담겨 순환에서 제외할 키들 (AC3: 담은 게시판은 순환 제외). */
  readonly excludeKeys: ReadonlySet<string>;
  /** 동시에 보여줄 순환 슬롯 개수. */
  readonly slotCount: number;
  /** 교체 주기(ms). */
  readonly intervalMs: number;
  /** 호버/포커스 중 정지 (AC3). */
  readonly paused: boolean;
  /** reduced-motion 이면 false — 자동 순환 없이 정적 노출 (AC3). */
  readonly enabled: boolean;
}

/**
 * 순환 슬롯의 현재 게시판 목록을 반환한다. 담긴 게시판(excludeKeys)은 제외되며,
 * 담기는 즉시 해당 슬롯이 다른 게시판으로 대체된다.
 */
export function useCyclingSlots({
  pool,
  excludeKeys,
  slotCount,
  intervalMs,
  paused,
  enabled,
}: CyclingSlotsOptions): readonly ShowcaseBoard[] {
  // 담긴 키를 제외한 순환 가능 목록. 키 집합이 바뀔 때만 재계산.
  const excludeToken = useMemo(
    () => Array.from(excludeKeys).sort().join(","),
    [excludeKeys],
  );
  const available = useMemo(
    () => pool.filter((b) => !excludeKeys.has(b.key)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, excludeToken],
  );

  const [slotKeys, setSlotKeys] = useState<readonly (string | null)[]>(() =>
    Array.from({ length: slotCount }, () => null),
  );

  // 틱 클로저에서 참조할 최신 available 을 ref 로 안정화 (interval 재생성 방지).
  const availableRef = useRef(available);
  availableRef.current = available;
  const tickRef = useRef(0);

  // available 변경(담기/빼기) 시 슬롯 정합: 제외된 슬롯을 비우고 빈 슬롯을 채운다.
  useEffect(() => {
    setSlotKeys((prev) => reconcile(prev, available, slotCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeToken, available, slotCount]);

  // 자동 순환 틱: enabled && !paused 일 때만. deps 는 안정 값만.
  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => {
      setSlotKeys((prev) => advance(prev, availableRef.current, tickRef));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, paused, intervalMs]);

  return useMemo(() => {
    const map = new Map(available.map((b) => [b.key, b]));
    return slotKeys
      .map((k) => (k ? map.get(k) : undefined))
      .filter((b): b is ShowcaseBoard => Boolean(b));
  }, [slotKeys, available]);
}

/** 제외된 슬롯을 비우고 미사용 게시판으로 빈 슬롯을 채운다. */
function reconcile(
  prev: readonly (string | null)[],
  available: readonly ShowcaseBoard[],
  slotCount: number,
): (string | null)[] {
  const availKeys = available.map((b) => b.key);
  const availSet = new Set(availKeys);
  const used = new Set<string>();
  const next: (string | null)[] = Array.from({ length: slotCount }, (_, i) => {
    const k = prev[i] ?? null;
    if (k && availSet.has(k) && !used.has(k)) {
      used.add(k);
      return k;
    }
    return null;
  });
  let cursor = 0;
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== null) continue;
    while (cursor < availKeys.length && used.has(availKeys[cursor])) cursor++;
    if (cursor < availKeys.length) {
      next[i] = availKeys[cursor];
      used.add(availKeys[cursor]);
      cursor++;
    }
  }
  return next;
}

/** 한 슬롯을 현재 보이지 않는 다른 게시판으로 교체 (round-robin). */
function advance(
  prev: readonly (string | null)[],
  available: readonly ShowcaseBoard[],
  tickRef: { current: number },
): (string | null)[] {
  const availKeys = available.map((b) => b.key);
  const shown = new Set(prev.filter((k): k is string => Boolean(k)));
  // 보여줄 새 게시판이 더 없으면 교체할 게 없다.
  if (availKeys.length <= shown.size) return [...prev];
  const candidate = availKeys.find((k) => !shown.has(k));
  if (!candidate) return [...prev];
  const slot = tickRef.current % prev.length;
  tickRef.current += 1;
  const next = [...prev];
  next[slot] = candidate;
  return next;
}
