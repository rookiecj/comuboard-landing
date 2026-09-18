import "@testing-library/jest-dom/vitest";

// jsdom 에는 IntersectionObserver 가 없다. framer-motion 의 whileInView(viewport)
// 가 이를 사용하므로, 컴포넌트 렌더 테스트(Features 등)에서 필요한 no-op 스텁을 둔다.
class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
if (!("IntersectionObserver" in globalThis)) {
  (
    globalThis as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = IntersectionObserverStub;
}

// jsdom 에는 Element.prototype.scrollIntoView 가 없다. DomainPacks 탭 선택
// (b1f52c4, 2026-06-13)이 이를 호출해 테스트 2건이 uncaught TypeError 로
// 3개월간 빨간 상태였다 — FAST=1 이 게이트를 꺼 아무도 못 봤다.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
