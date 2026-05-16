/**
 * STORY-189-03 — Unit tests for Sentry SDK bootstrap (Landing).
 *
 * Same shape as comuboard-fe/src/sentry.test.ts; Landing has no toast store,
 * so the chunk-fail "notify" callback is injected explicitly in tests.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ErrorEvent as SentryErrorEvent } from "@sentry/react";

vi.mock("@sentry/react", async () => {
  const actual =
    await vi.importActual<typeof import("@sentry/react")>("@sentry/react");
  return {
    ...actual,
    init: vi.fn(),
    captureMessage: vi.fn(),
    browserTracingIntegration: vi.fn(() => ({ name: "BrowserTracing" })),
  };
});

import * as Sentry from "@sentry/react";
import {
  REDACTED,
  initSentry,
  installChunkLoadHandler,
  isChunkLoadFailure,
  redactPii,
} from "./sentry";

describe("redactPii", () => {
  it("masks token / code / magic / access_token query params", () => {
    const event = {
      request: {
        url: "https://comuboard.com/auth/callback?token=abc123&state=ok&code=xyz&magic=mmm&access_token=jjj",
      },
    } as unknown as SentryErrorEvent;

    const out = redactPii(event);
    expect(out.request?.url).not.toContain("abc123");
    expect(out.request?.url).not.toContain("xyz");
    expect(out.request?.url).not.toContain("mmm");
    expect(out.request?.url).not.toContain("jjj");
    expect(out.request?.url).toContain(`token=${REDACTED}`);
    expect(out.request?.url).toContain(`code=${REDACTED}`);
    expect(out.request?.url).toContain(`magic=${REDACTED}`);
    expect(out.request?.url).toContain(`access_token=${REDACTED}`);
    expect(out.request?.url).toContain("state=ok");
  });

  it("masks Authorization + Cookie request headers", () => {
    const event = {
      request: {
        headers: {
          Authorization: "Bearer secret-jwt",
          cookie: "session=hunter2",
          "X-Trace-Id": "keep-me",
        },
      },
    } as unknown as SentryErrorEvent;

    const out = redactPii(event);
    const headers = out.request?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(REDACTED);
    expect(headers.cookie).toBe(REDACTED);
    expect(headers["X-Trace-Id"]).toBe("keep-me");
  });

  it("removes form input password from contexts", () => {
    const event = {
      contexts: {
        input: { password: "p@ssw0rd", username: "alice" },
      },
    } as unknown as SentryErrorEvent;

    const out = redactPii(event);
    const input = (out.contexts as Record<string, Record<string, unknown>>)
      .input;
    expect(input.password).toBeUndefined();
    expect(input.username).toBe("alice");
  });

  it("is a no-op for events with no request / contexts", () => {
    const event = { event_id: "abc" } as unknown as SentryErrorEvent;
    expect(() => redactPii(event)).not.toThrow();
  });
});

describe("isChunkLoadFailure", () => {
  it("detects Vite + browser chunk failure shapes", () => {
    expect(isChunkLoadFailure("Loading chunk 42 failed.")).toBe(true);
    expect(
      isChunkLoadFailure(
        "Failed to fetch dynamically imported module: https://x/y.js",
      ),
    ).toBe(true);
    expect(isChunkLoadFailure("Importing a module script failed.")).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isChunkLoadFailure("TypeError: undefined is not a function")).toBe(
      false,
    );
    expect(isChunkLoadFailure(undefined)).toBe(false);
    expect(isChunkLoadFailure("")).toBe(false);
  });
});

describe("installChunkLoadHandler", () => {
  let handlers: Array<(e: Event) => void>;
  let fakeWindow: Window;

  beforeEach(() => {
    handlers = [];
    fakeWindow = {
      addEventListener: (_type: string, cb: (e: Event) => void) => {
        handlers.push(cb);
      },
    } as unknown as Window;
  });

  it("captures every chunk error but notifies the user only once", () => {
    const capture = vi.fn();
    const notify = vi.fn();
    installChunkLoadHandler(fakeWindow, capture, notify);

    expect(handlers).toHaveLength(1);

    handlers[0]({
      message: "Loading chunk 7 failed.",
      filename: "https://landing/assets/chunk-7.js",
    } as unknown as Event);
    handlers[0]({
      message: "Failed to fetch dynamically imported module: chunk-8",
      filename: "https://landing/assets/chunk-8.js",
    } as unknown as Event);

    expect(capture).toHaveBeenCalledTimes(2);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("ignores non-chunk error events", () => {
    const capture = vi.fn();
    const notify = vi.fn();
    installChunkLoadHandler(fakeWindow, capture, notify);

    handlers[0]({
      message: "ReferenceError: foo is not defined",
    } as unknown as Event);

    expect(capture).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});

describe("initSentry", () => {
  beforeEach(() => {
    vi.mocked(Sentry.init).mockClear();
  });

  afterEach(() => {
    vi.mocked(Sentry.init).mockClear();
  });

  it("is a no-op when DSN is empty / missing / whitespace", () => {
    initSentry({} as unknown as ImportMetaEnv);
    initSentry({ VITE_SENTRY_DSN: "" } as unknown as ImportMetaEnv);
    initSentry({ VITE_SENTRY_DSN: "   " } as unknown as ImportMetaEnv);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("calls Sentry.init with redactor + tracing when DSN is set", () => {
    initSentry({
      VITE_SENTRY_DSN: "https://abc@o0.ingest.sentry.io/1",
      VITE_SENTRY_ENV: "test",
      VITE_SENTRY_RELEASE: "v1.0.0",
      VITE_SENTRY_TRACES_SAMPLE_RATE: "0.2",
      VITE_SENTRY_SAMPLE_RATE: "0.5",
    } as unknown as ImportMetaEnv);

    expect(Sentry.init).toHaveBeenCalledTimes(1);
    const cfg = vi.mocked(Sentry.init).mock.calls[0][0]!;
    expect(cfg.dsn).toContain("ingest.sentry.io");
    expect(cfg.environment).toBe("test");
    expect(cfg.release).toBe("v1.0.0");
    expect(cfg.sampleRate).toBe(0.5);
    expect(cfg.tracesSampleRate).toBe(0.2);
    expect(typeof cfg.beforeSend).toBe("function");
  });
});
