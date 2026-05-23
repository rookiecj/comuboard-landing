/**
 * STORY-186-01 — Sentry FE/Landing PII redaction sync guard.
 *
 * Security Agent §4.0 + §4.2 STORY-186-01 권고 #1: Landing 측 sentry.ts 는
 * comuboard-fe/src/sentry.ts 의 redactPii / SENSITIVE_QUERY_KEYS / REDACTED
 * 와 **동일한 PII 마스킹 로직**을 가져야 한다 (single source of truth).
 *
 * 두 파일은 chunk-load 알림 채널이 다르므로 전체 diff 는 불가:
 *   - FE: useToastStore (zustand) — toast 알림
 *   - Landing: DOM banner — toast store 없음
 *
 * 본 테스트는 **보안 critical 섹션** (REDACTED 상수 / SENSITIVE_QUERY_KEYS regex
 * / redactPii 함수 본문 / isChunkLoadFailure 함수 본문) 만 정확 일치 비교.
 * 향후 FE 측 PII 마스킹 강화 시 Landing 도 즉시 동기화되도록 강제.
 *
 * guards STORY-186-01 (Sentry FE/Landing sync) + Security S1 (beforeSend PII)
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Extract a function body by depth-counting `{` / `}` starting from the
 * signature. Returns raw source preserving newlines so the caller can strip
 * line comments before whitespace normalization.
 */
function extractFunction(source: string, signature: string): string {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(
      `signature not found: ${signature.slice(0, 80)} — sentry module may have drifted`,
    );
  }
  const openIdx = source.indexOf("{", start);
  if (openIdx === -1) {
    throw new Error(`no opening brace after signature: ${signature}`);
  }
  let depth = 1;
  let i = openIdx + 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  return source.slice(start, i);
}

/** Strip JS line + block comments and collapse whitespace. */
function normalize(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract a statement up to (and including) the terminating `;`. */
function extractStatement(source: string, signature: string): string {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(
      `signature not found: ${signature.slice(0, 80)} — sentry module may have drifted`,
    );
  }
  const semi = source.indexOf(";", start);
  if (semi === -1) {
    throw new Error(`no terminating semicolon for: ${signature}`);
  }
  return source.slice(start, semi + 1);
}

// Resolve the FE sentry source via the umbrella saas repo layout. When the
// landing submodule is checked out standalone (no sibling FE), the test is
// skipped — sync enforcement runs in the saas repo CI where both submodules
// are present.
const repoRoot = resolve(__dirname, "../../"); // comuboard-saas/
const fePath = resolve(repoRoot, "comuboard-fe/src/sentry.ts");
const landingPath = resolve(repoRoot, "comuboard-landing/src/sentry.ts");
const haveBoth = existsSync(fePath) && existsSync(landingPath);

const suite = haveBoth ? describe : describe.skip;

suite("sentry FE/Landing PII redaction sync guard", () => {
  const feSentry = haveBoth ? readFileSync(fePath, "utf-8") : "";
  const landingSentry = haveBoth ? readFileSync(landingPath, "utf-8") : "";

  it("REDACTED sentinel constant matches", () => {
    const fe = normalize(
      extractStatement(feSentry, 'export const REDACTED = "REDACTED"'),
    );
    const landing = normalize(
      extractStatement(landingSentry, 'export const REDACTED = "REDACTED"'),
    );
    expect(landing).toBe(fe);
  });

  it("SENSITIVE_QUERY_KEYS regex matches", () => {
    const fe = normalize(
      extractStatement(feSentry, "const SENSITIVE_QUERY_KEYS ="),
    );
    const landing = normalize(
      extractStatement(landingSentry, "const SENSITIVE_QUERY_KEYS ="),
    );
    expect(landing).toBe(fe);
  });

  it("redactPii function body matches (PII masking logic)", () => {
    const fe = normalize(
      extractFunction(
        feSentry,
        "export function redactPii<T extends SentryErrorEvent>",
      ),
    );
    const landing = normalize(
      extractFunction(
        landingSentry,
        "export function redactPii<T extends SentryErrorEvent>",
      ),
    );
    expect(landing).toBe(fe);
  });

  it("isChunkLoadFailure function body matches", () => {
    const fe = normalize(
      extractFunction(feSentry, "export function isChunkLoadFailure("),
    );
    const landing = normalize(
      extractFunction(landingSentry, "export function isChunkLoadFailure("),
    );
    expect(landing).toBe(fe);
  });
});
