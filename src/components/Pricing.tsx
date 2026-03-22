const plans = [
  {
    name: "Community (CE)",
    price: "무료",
    description: "오픈소스 셀프 호스팅",
    features: [
      "무제한 게시글",
      "마크다운 에디터",
      "이모지 반응",
      "기본 관리 도구",
      "커뮤니티 지원",
    ],
    cta: "GitHub에서 받기",
    href: "https://github.com/rookiecj/comuboard-be",
    highlighted: false,
  },
  {
    name: "SaaS",
    price: "문의",
    description: "관리형 호스팅",
    features: [
      "CE 모든 기능 포함",
      "멀티 커뮤니티",
      "고급 분석 대시보드",
      "자동 백업",
      "우선 지원",
    ],
    cta: "문의하기",
    href: "mailto:contact@comuboard.com",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          요금제
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          오픈소스로 시작하고, 필요할 때 SaaS로 확장하세요.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              <p className="mt-6 text-4xl font-bold text-gray-900">
                {plan.price}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-indigo-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`mt-8 block rounded-lg py-3 text-center font-semibold transition ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
