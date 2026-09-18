/**
 * Sentry SDK initialization (Landing).
 *
 * Goals:
 *   - Empty DSN => silent no-op (dev builds work without Sentry credentials).
 *   - Capture uncaught errors and Promise rejections (Sentry auto-wires the
 *     global `error` / `unhandledrejection` listeners — we only add chunk-load
 *     special handling here).
 *   - PII masking via `beforeSend`:
 *       * `(token|code|magic|access_token)=...` query params in URLs are
 *         replaced with `REDACTED`.
 *       * `event.contexts.input.password` is deleted.
 *       * `Authorization` request header values are masked.
 *   - Vite chunk-load failure detection: when a deploy invalidates lazy
 *     chunks for a tab that's still open, show a minimal in-page banner
 *     nudging the user to refresh (Landing has no toast store).
 *
 * STORY-189-03 (Sentry FE/Landing SDK).
 */

import * as Sentry from "@sentry/react";
import type { ErrorEvent as SentryErrorEvent, EventHint } from "@sentry/react";

/** Sentinel string used by tests + dashboards to confirm the redactor ran. */
export const REDACTED = "REDACTED";

const SENSITIVE_QUERY_KEYS =
  /(token|code|magic|access_token|refresh_token|X-Amz-Signature|X-Amz-Credential|X-Amz-Security-Token)=[^&#]*/gi;

/**
 * Replace credential-bearing query params anywhere in a string.
 *
 * presigned URL 은 **URL 안에 담긴 자격증명**이다. 업로드가 실패하면 그 URL 이
 * 에러 메시지·breadcrumb 에 실려 제3자(Sentry)에게 그대로 간다 — 서명은 TTL
 * 동안 유효하므로 로그에 남는 순간 재사용 가능한 credential 이 유출된다.
 */
function redactUrlLike(value: string): string {
  return value.replace(SENSITIVE_QUERY_KEYS, (_m, key) => `${key}=${REDACTED}`);
}

/**
 * Scrub a breadcrumb in place.
 *
 * **breadcrumb 가 진짜 유출 경로다.** `beforeSend` 의 `event.request.url` 은
 * 페이지 URL 이고, fetch/XHR 대상 URL 은 breadcrumb 의 `data.url` 에 담긴다.
 * presigned PUT 이 실패하면 그게 바로 여기에 들어온다.
 */
export function redactBreadcrumb<
  T extends { message?: string; data?: Record<string, unknown> },
>(crumb: T): T {
  if (typeof crumb.message === "string") {
    crumb.message = redactUrlLike(crumb.message);
  }
  if (crumb.data && typeof crumb.data === "object") {
    for (const key of Object.keys(crumb.data)) {
      const v = crumb.data[key];
      if (typeof v === "string") {
        crumb.data[key] = redactUrlLike(v);
      }
    }
  }
  return crumb;
}

/**
 * Mutates `event.request.url` in place to strip credentials from the URL
 * query string. Exported for unit-testing the redaction logic without
 * needing a full Sentry hub.
 */
export function redactPii<T extends SentryErrorEvent>(
  event: T,
  _hint?: EventHint,
): T {
  // 1. URL query string sensitive params
  if (event.request?.url) {
    event.request.url = redactUrlLike(event.request.url);
  }

  // 1b. Breadcrumbs — fetch/XHR 대상 URL 이 여기 담긴다. presigned PUT 이
  //     실패하면 서명이 통째로 실려 오므로 request.url 만 지우는 것으로는
  //     부족하다.
  if (Array.isArray(event.breadcrumbs)) {
    for (const crumb of event.breadcrumbs) {
      if (crumb) redactBreadcrumb(crumb);
    }
  }

  // 1c. 예외 메시지 — "Failed to PUT https://...?X-Amz-Signature=..." 처럼
  //     URL 이 문자열에 박혀 오는 경우.
  for (const ex of event.exception?.values ?? []) {
    if (typeof ex.value === "string") ex.value = redactUrlLike(ex.value);
  }
  if (typeof event.message === "string") {
    event.message = redactUrlLike(event.message);
  }

  // 2. Authorization header value
  if (event.request?.headers && typeof event.request.headers === "object") {
    const headers = event.request.headers as Record<string, string>;
    for (const k of Object.keys(headers)) {
      if (/^authorization$/i.test(k) || /^cookie$/i.test(k)) {
        headers[k] = REDACTED;
      }
    }
  }

  // 3. Form input password — Sentry sometimes stashes form payloads under
  //    `contexts.input` (e.g. via the captureconsole/integrations layer).
  const contexts = event.contexts as
    | Record<string, Record<string, unknown> | undefined>
    | undefined;
  if (contexts?.input && typeof contexts.input === "object") {
    delete contexts.input.password;
  }
  return event;
}

export function isChunkLoadFailure(message: string | undefined): boolean {
  if (!message) return false;
  return (
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

/**
 * Minimal "new version" banner — Landing has no toast store, so we inject a
 * fixed-position div directly into the DOM. Idempotent via element id.
 */
function showRefreshBanner(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("comuboard-chunk-fail-banner")) return;

  const banner = document.createElement("div");
  banner.id = "comuboard-chunk-fail-banner";
  banner.setAttribute("role", "alert");
  banner.style.cssText = [
    "position:fixed",
    "left:50%",
    "bottom:1rem",
    "transform:translateX(-50%)",
    "z-index:9999",
    "background:#2563eb",
    "color:white",
    "padding:0.75rem 1.25rem",
    "border-radius:0.5rem",
    "box-shadow:0 10px 30px rgba(0,0,0,0.2)",
    "font:14px/1.4 system-ui,sans-serif",
    "display:flex",
    "gap:0.75rem",
    "align-items:center",
    "max-width:90vw",
  ].join(";");

  const msg = document.createElement("span");
  msg.textContent =
    "새 버전이 배포되었어요. 새로고침하면 계속 이용할 수 있어요!";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "새로고침";
  btn.style.cssText = [
    "background:white",
    "color:#2563eb",
    "border:none",
    "border-radius:0.375rem",
    "padding:0.375rem 0.75rem",
    "font-weight:600",
    "cursor:pointer",
  ].join(";");
  btn.addEventListener("click", () => window.location.reload());

  banner.appendChild(msg);
  banner.appendChild(btn);
  document.body.appendChild(banner);
}

export function installChunkLoadHandler(
  target: Window = window,
  capture: (msg: string, extra: Record<string, unknown>) => void = (
    msg,
    extra,
  ) => {
    Sentry.captureMessage(msg, { level: "warning", extra });
  },
  notify: () => void = showRefreshBanner,
): void {
  let alreadyNotified = false;

  target.addEventListener("error", (event: Event) => {
    const errEvent = event as unknown as {
      message?: string;
      filename?: string;
    };
    const msg = errEvent.message ?? "";
    if (!isChunkLoadFailure(msg)) return;

    capture("Vite chunk load failed", {
      url: errEvent.filename,
      message: msg,
    });

    if (alreadyNotified) return;
    alreadyNotified = true;
    try {
      notify();
    } catch {
      // Notification side-effects can't be allowed to break error capture.
    }
  });
}

export function initSentry(env: ImportMetaEnv = import.meta.env): void {
  const dsn = env.VITE_SENTRY_DSN?.trim();
  if (!dsn) return;

  const tracesSampleRate = Number(env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0.1");
  const sampleRate = Number(env.VITE_SENTRY_SAMPLE_RATE ?? "1.0");

  Sentry.init({
    dsn,
    environment: env.VITE_SENTRY_ENV ?? env.MODE ?? "development",
    release: env.VITE_SENTRY_RELEASE ?? undefined,
    sampleRate: Number.isFinite(sampleRate) ? sampleRate : 1.0,
    tracesSampleRate: Number.isFinite(tracesSampleRate)
      ? tracesSampleRate
      : 0.1,
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend: redactPii,
  });

  installChunkLoadHandler();
}

initSentry();
