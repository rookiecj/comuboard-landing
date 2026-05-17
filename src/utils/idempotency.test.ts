// STORY-189-22: Landing idempotency fetch wrapper 단위 테스트.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateIdempotencyKey, idempotencyFetch } from "./idempotency";

describe("generateIdempotencyKey (landing)", () => {
  it("returns crypto.randomUUID when available", () => {
    const spy = vi
      .spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValue("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(generateIdempotencyKey()).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    );
    spy.mockRestore();
  });

  it("falls back to ik-<ts>-<rand> when crypto.randomUUID is unavailable", () => {
    const original = globalThis.crypto;
    vi.stubGlobal("crypto", { ...original, randomUUID: undefined });
    try {
      const key = generateIdempotencyKey();
      expect(key).toMatch(/^ik-[a-z0-9]+-[a-z0-9]+$/);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("produces distinct keys on successive calls", () => {
    expect(generateIdempotencyKey()).not.toBe(generateIdempotencyKey());
  });
});

describe("idempotencyFetch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }) as Response);
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function getHeaderFromCall(callIndex = 0): string | null {
    const init = fetchMock.mock.calls[callIndex]?.[1] as
      | RequestInit
      | undefined;
    const headers = new Headers(init?.headers ?? {});
    return headers.get("Idempotency-Key");
  }

  it("attaches Idempotency-Key on POST", async () => {
    await idempotencyFetch("/api/contact", { method: "POST" });
    expect(getHeaderFromCall()).toMatch(/^[A-Za-z0-9_-]{8,}$/);
  });

  it("attaches Idempotency-Key on PUT", async () => {
    await idempotencyFetch("/api/x", { method: "put" });
    expect(getHeaderFromCall()).toBeTruthy();
  });

  it("attaches Idempotency-Key on PATCH", async () => {
    await idempotencyFetch("/api/x", { method: "PATCH" });
    expect(getHeaderFromCall()).toBeTruthy();
  });

  it("does NOT attach on GET (guards method gate)", async () => {
    await idempotencyFetch("/api/x", { method: "GET" });
    expect(getHeaderFromCall()).toBeNull();
  });

  it("does NOT attach when method omitted (defaults to GET)", async () => {
    await idempotencyFetch("/api/x");
    expect(getHeaderFromCall()).toBeNull();
  });

  it("preserves caller-provided Idempotency-Key (override priority)", async () => {
    await idempotencyFetch("/api/x", {
      method: "POST",
      headers: { "Idempotency-Key": "landing-caller-key-7" },
    });
    expect(getHeaderFromCall()).toBe("landing-caller-key-7");
  });
});
