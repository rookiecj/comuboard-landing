import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // localhost에서도 Dev 환경과 동일한 base path 사용 (환경 간 차이 최소화)
  base: "/app/comuboard/",
  server: {
    port: 3001,
    strictPort: true,
    // Landing의 API 호출은 VITE_API_URL(=FE dev server)을 경유하므로
    // Landing 자체 proxy는 불필요. FE vite.config.ts의 proxy가 BE로 전달.
  },
});
