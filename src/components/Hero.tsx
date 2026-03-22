import { Sparkles } from "lucide-react";

/**
 * Check if the user is authenticated by looking for a JWT token cookie.
 * In the landing page context, this is a best-effort check — the actual
 * auth state lives on comuboard.com.
 */
function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("token="));
}

export function Hero() {
  const authenticated = isAuthenticated();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      {/* Decorative background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-40">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          <span>런칭 프로모션 — Pro 50% 할인</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          우리의 이야기가 쌓이는 곳
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-indigo-100 sm:text-xl">
          게시판, 댓글, AI 요약, 뉴스레터까지.
          <br className="hidden sm:block" />
          ComuBoard 하나로 커뮤니티 운영에 필요한 모든 것을 시작하세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {authenticated ? (
            <a
              href="https://comuboard.com/create-community"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
            >
              내 커뮤니티 만들기
            </a>
          ) : (
            <a
              href="https://comuboard.com/signup"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
            >
              무료로 시작하기
            </a>
          )}
          <a
            href="#features"
            className="inline-flex items-center rounded-lg border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            기능 살펴보기
          </a>
        </div>
      </div>
    </section>
  );
}
