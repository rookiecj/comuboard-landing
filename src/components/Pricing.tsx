import { Check, Star } from "lucide-react";

interface CapacityRow {
  readonly label: string;
  readonly free: string;
  readonly pro: string;
  readonly business: string;
}

const capacities: readonly CapacityRow[] = [
  { label: "커뮤니티", free: "1개", pro: "3개", business: "협의" },
  { label: "멤버", free: "30명", pro: "300명", business: "협의" },
  { label: "스토리지", free: "100 MiB", pro: "5 GiB", business: "협의" },
  { label: "AI 요약", free: "5회/일", pro: "50회/일", business: "협의" },
];

interface Plan {
  readonly name: string;
  readonly price: string | null;
  readonly originalPrice?: string;
  readonly priceUnit?: string;
  readonly description: string;
  readonly badge?: string;
  readonly cta: string;
  readonly href: string;
  readonly highlighted: boolean;
}

const plans: readonly Plan[] = [
  {
    name: "Free",
    price: "₩0",
    priceUnit: "",
    description: "개인 또는 소규모 커뮤니티",
    cta: "무료로 시작하기",
    href: "https://comuboard.com/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₩14,950",
    originalPrice: "₩29,900",
    priceUnit: "/월",
    description: "성장하는 커뮤니티를 위한 선택",
    badge: "추천",
    cta: "Pro 시작하기",
    href: "https://comuboard.com/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: null,
    description: "대규모 조직 맞춤 설계",
    cta: "문의하기",
    href: "mailto:contact@comuboard.com",
    highlighted: false,
  },
];

function PlanCard({ plan }: { readonly plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition ${
        plan.highlighted
          ? "scale-[1.02] border-indigo-600 shadow-xl ring-1 ring-indigo-600 lg:scale-105"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          <Star className="h-3 w-3" />
          {plan.badge}
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

      <div className="mt-6">
        {plan.price !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {plan.price}
            </span>
            {plan.priceUnit && (
              <span className="text-base text-gray-500">{plan.priceUnit}</span>
            )}
          </div>
        ) : (
          <span className="text-4xl font-bold text-gray-900">Contact</span>
        )}
        {plan.originalPrice && (
          <p className="mt-1 text-sm text-gray-400">
            <span className="line-through">{plan.originalPrice}</span>
            <span className="ml-2 font-medium text-rose-500">50% 할인</span>
          </p>
        )}
      </div>

      {/* Feature highlight: all features identical */}
      <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="font-medium text-gray-900">모든 기능 동일</span> —
        용량만 다릅니다
      </div>

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
  );
}

function CapacityTable() {
  return (
    <div className="mt-16">
      <h3 className="mb-6 text-center text-xl font-bold text-gray-900">
        용량 비교
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 pr-4 text-left font-medium text-gray-500">
                항목
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className={`px-4 py-3 text-center font-semibold ${
                    plan.highlighted ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capacities.map((row) => (
              <tr key={row.label} className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium text-gray-700">
                  {row.label}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {row.free}
                </td>
                <td className="px-4 py-3 text-center font-medium text-indigo-600">
                  {row.pro}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {row.business}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 pr-4 font-medium text-gray-700">기능</td>
              <td className="px-4 py-3 text-center">
                <Check className="mx-auto h-5 w-5 text-emerald-500" />
              </td>
              <td className="px-4 py-3 text-center">
                <Check className="mx-auto h-5 w-5 text-emerald-500" />
              </td>
              <td className="px-4 py-3 text-center">
                <Check className="mx-auto h-5 w-5 text-emerald-500" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          요금제
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          모든 플랜에서 동일한 기능을 제공합니다. 필요한 용량에 맞게 선택하세요.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <CapacityTable />
      </div>
    </section>
  );
}
