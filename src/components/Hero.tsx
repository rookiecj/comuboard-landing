export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          커뮤니티를 위한
          <br />
          올인원 플랫폼
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100 sm:text-xl">
          게시판, 댓글, 이모지 반응, 마크다운 에디터까지.
          <br />
          ComuBoard 하나로 커뮤니티 운영에 필요한 모든 것을 시작하세요.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 shadow-md transition hover:bg-indigo-50"
          >
            시작하기
          </a>
          <a
            href="#features"
            className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            기능 살펴보기
          </a>
        </div>
      </div>
    </section>
  );
}
