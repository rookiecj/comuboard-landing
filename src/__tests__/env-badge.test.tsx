// guards the Landing EnvBadge: a top-right DEV/LOCAL indicator that is hidden
// on production. Mirrors comuboard-fe's EnvBadge behaviour.
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { EnvBadge } from "../components/EnvBadge";
import { getAppEnv, isProductionEnv } from "../config";

const original = import.meta.env.VITE_APP_ENV;

afterEach(() => {
  cleanup();
  import.meta.env.VITE_APP_ENV = original;
});

describe("getAppEnv (Landing)", () => {
  function env(overrides: Record<string, unknown>): ImportMetaEnv {
    return {
      DEV: false,
      BASE_URL: "/",
      ...overrides,
    } as unknown as ImportMetaEnv;
  }

  it("honors explicit production / staging / development", () => {
    expect(getAppEnv(env({ VITE_APP_ENV: "production" }))).toBe("production");
    expect(getAppEnv(env({ VITE_APP_ENV: "STAGING" }))).toBe("staging");
    expect(getAppEnv(env({ VITE_APP_ENV: "development" }))).toBe("development");
  });

  it("falls back to development on the local dev server", () => {
    expect(getAppEnv(env({ DEV: true }))).toBe("development");
  });

  it("falls back to production on a deployed build without the var", () => {
    expect(getAppEnv(env({ DEV: false }))).toBe("production");
    expect(isProductionEnv(env({ DEV: false }))).toBe(true);
  });

  // guards SPRINT-271 Security R2: Landing has no base-path fallback, so a
  // deployed build without VITE_APP_ENV resolves to production (badge hidden)
  // even on a non-root base path. This is why homelab-staging MUST set
  // VITE_APP_ENV=staging for the dev badge to appear (R1).
  it("ignores base path and stays production when VITE_APP_ENV is unset", () => {
    expect(
      getAppEnv(env({ DEV: false, BASE_URL: "/app/comuboard/landing/" })),
    ).toBe("production");
  });

  // guards SPRINT-271 Security R2: explicit production wins over any base path.
  it("explicit production wins over a non-root base path", () => {
    expect(
      getAppEnv(
        env({
          VITE_APP_ENV: "production",
          BASE_URL: "/app/comuboard/landing/",
        }),
      ),
    ).toBe("production");
  });
});

describe("EnvBadge (Landing)", () => {
  it("renders a DEV badge on staging", () => {
    import.meta.env.VITE_APP_ENV = "staging";
    render(<EnvBadge />);
    expect(screen.getByTestId("env-badge")).toHaveTextContent("DEV");
  });

  it("renders a LOCAL badge on development", () => {
    import.meta.env.VITE_APP_ENV = "development";
    render(<EnvBadge />);
    expect(screen.getByTestId("env-badge")).toHaveTextContent("LOCAL");
  });

  it("renders nothing on production", () => {
    import.meta.env.VITE_APP_ENV = "production";
    render(<EnvBadge />);
    expect(screen.queryByTestId("env-badge")).not.toBeInTheDocument();
  });

  it("is decorative (pointer-events-none + aria-hidden)", () => {
    import.meta.env.VITE_APP_ENV = "staging";
    render(<EnvBadge />);
    const badge = screen.getByTestId("env-badge");
    expect(badge).toHaveAttribute("aria-hidden", "true");
    expect(badge.className).toContain("pointer-events-none");
  });
});
