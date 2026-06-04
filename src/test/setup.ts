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
