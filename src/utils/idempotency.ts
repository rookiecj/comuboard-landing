// STORY-189-22: Landing 의 mutating fetch 호출에 Idempotency-Key 헤더를
// 부착하는 fetch wrapper. Landing 은 현재 GET 만 호출하지만 가입/문의 폼이
// 추가될 때 같은 패턴으로 보호받도록 사전 인프라를 준비한다.
//
// FE 와 동일한 인터페이스 (`Idempotency-Key` 헤더, POST/PUT/PATCH 게이트,
// caller override 우선) — server (STORY-189-21) 의 IdempotencyMiddleware 가
// 같은 키로 도달한 mutating 요청을 단일 처리한다.

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH"]);

/**
 * 새 Idempotency-Key 생성. 브라우저 native crypto.randomUUID() 우선,
 * 부재 시 timestamp+random fallback.
 */
export function generateIdempotencyKey(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 12);
  return `ik-${ts}-${rand}`;
}

/**
 * fetch wrapper. POST/PUT/PATCH 호출에 Idempotency-Key 자동 부착. GET/HEAD/DELETE
 * 는 부착하지 않는다. 호출자가 이미 헤더를 지정했으면 덮어쓰지 않는다.
 */
export function idempotencyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  if (!MUTATING_METHODS.has(method)) {
    return fetch(input, init);
  }
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Idempotency-Key")) {
    headers.set("Idempotency-Key", generateIdempotencyKey());
  }
  return fetch(input, { ...init, headers });
}
