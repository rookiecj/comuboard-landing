/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const basePath = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev: /app/comuboard/landing/, Prod: / (VITE_BASE_PATH 환경변수로 제어)
  base: basePath,
  build: {
    // prod comuboard.com 에서 FE(comuboard-web)가 /assets/ 를 소유하므로
    // 랜딩 번들을 /lp-assets/ 로 이전해 한 호스트 자산 충돌을 회피한다
    // (2026-07-13 v2 라우팅 완성, ADR 2026-07-13-prod-two-spa-single-host-routing).
    assetsDir: "lp-assets",
    // STORY-189-03: emit source maps but don't reference them in the bundle.
    // Manual `sentry-cli releases files upload-sourcemaps dist` for now;
    // GH Actions automation is a D+14 follow-up.
    sourcemap: "hidden",
  },
  server: {
    port: 3001,
    strictPort: true,
    // Landing의 API 호출은 VITE_API_URL(=FE dev server)을 경유하므로
    // Landing 자체 proxy는 불필요. FE vite.config.ts의 proxy가 BE로 전달.
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
