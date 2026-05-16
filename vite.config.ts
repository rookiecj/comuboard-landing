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
