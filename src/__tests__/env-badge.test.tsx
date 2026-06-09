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
