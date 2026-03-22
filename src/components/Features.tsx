const features = [
  {
    title: "마크다운 에디터",
    description:
      "GFM, 수식, Mermaid 다이어그램까지 지원하는 강력한 마크다운 에디터로 풍부한 콘텐츠를 작성하세요.",
    icon: "✏️",
  },
  {
    title: "이모지 반응",
    description:
      "게시글과 댓글에 이모지로 반응하세요. 커뮤니티 참여를 자연스럽게 높여줍니다.",
    icon: "👍",
  },
  {
    title: "멀티 커뮤니티",
    description:
      "하나의 플랫폼에서 여러 커뮤니티를 운영하세요. 각 커뮤니티는 독립적인 설정과 멤버를 가집니다.",
    icon: "🏘️",
  },
  {
    title: "관리자 대시보드",
    description:
      "커뮤니티 통계, 사용자 관리, 콘텐츠 관리를 한눈에. 직관적인 관리 도구를 제공합니다.",
    icon: "📊",
  },
  {
    title: "SEO 최적화",
    description:
      "OG 태그, 사이트맵, 구조화된 데이터로 검색 엔진에서 커뮤니티 콘텐츠가 잘 노출됩니다.",
    icon: "🔍",
  },
  {
    title: "셀프 호스팅 가능",
    description:
      "오픈소스 CE 에디션으로 직접 서버에 설치하여 운영할 수 있습니다. 데이터 주권을 지키세요.",
    icon: "🏠",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          커뮤니티 운영에 필요한 모든 것
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          ComuBoard는 모으다 · 다듬다 · 나누다, 세 가지 축으로 커뮤니티를
          성장시킵니다.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
