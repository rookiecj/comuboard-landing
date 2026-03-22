import { Check, Star, ChevronRight } from "lucide-react";

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
    description: "성장하는 커뮤니티를 위한 최적의 선택",
    badge: "50% 프로모션",
    cta: "Pro 시작하기",
    href: "https://comuboard.com/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: null,
    description: "대규모 조직 맞춤 설계 및 도메인",
    cta: "문의하기",
    href: "mailto:contact@comuboard.com",
    highlighted: false,
  },
];

function PlanCard({ plan }: { readonly plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
        plan.highlighted
          ? "scale-[1.02] border-brand-500 bg-white dark:bg-slate-900 shadow-[0_0_40px_-10px_rgba(3,199,90,0.15)] dark:shadow-[0_0_40px_-10px_rgba(3,199,90,0.3)] ring-1 ring-brand-500 lg:scale-105 z-10"
          : "border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm dark:shadow-none"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full border border-brand-200 dark:border-brand-400/30 bg-brand-50 dark:bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-brand-500 dark:fill-brand-400 text-brand-500 dark:text-brand-400" />
          {plan.badge}
        </div>
      )}

      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>

      <div className="mt-8">
        {plan.price !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {plan.price}
            </span>
            {plan.priceUnit && (
              <span className="text-base font-medium text-slate-500">{plan.priceUnit}</span>
            )}
          </div>
        ) : (
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact</span>
        )}
        {plan.originalPrice && (
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            <span className="line-through">{plan.originalPrice}</span>
          </p>
        )}
      </div>

      <div className={`mt-8 rounded-xl px-4 py-3 text-sm font-medium ${plan.highlighted ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300" : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"}`}>
        모든 기능 동일 — 용량만 다릅니다
      </div>

      <a
        href={plan.href}
        className={`group mt-8 flex items-center justify-center gap-2 rounded-xl py-4 text-center text-sm font-bold transition-all ${
          plan.highlighted
            ? "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_0_20px_-5px_rgba(3,199,90,0.4)]"
            : "border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        {plan.cta}
        <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${plan.highlighted ? "text-white" : "text-slate-400"}`} />
      </a>
    </div>
  );
}

function CapacityTable() {
  return (
    <div className="mt-20">
      <h3 className="mb-8 text-center text-xl font-bold text-slate-900 dark:text-white">
        요금제별 상세 용량 비교
      </h3>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm dark:shadow-none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <th className="py-5 pl-8 pr-4 text-left font-semibold text-slate-500 dark:text-slate-400">
                지원 항목
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className={`px-4 py-5 text-center font-bold text-lg ${
                    plan.highlighted ? "text-brand-600 dark:text-brand-400" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {capacities.map((row) => (
              <tr key={row.label} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-4 pl-8 pr-4 font-medium text-slate-700 dark:text-slate-300">
                  {row.label}
                </td>
                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                  {row.free}
                </td>
                <td className="px-4 py-4 text-center font-bold text-brand-600 dark:text-brand-400">
                  {row.pro}
                </td>
                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                  {row.business}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50/50 dark:bg-slate-900/30">
              <td className="py-5 pl-8 pr-4 font-bold text-slate-900 dark:text-slate-200">핵심 기능 포함 여부</td>
              <td className="px-4 py-5 text-center">
                <Check className="mx-auto h-5 w-5 text-brand-500" />
              </td>
              <td className="px-4 py-5 text-center">
                <Check className="mx-auto h-5 w-5 text-brand-500" />
              </td>
              <td className="px-4 py-5 text-center">
                <Check className="mx-auto h-5 w-5 text-brand-500" />
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
    <section id="pricing" className="bg-slate-50 dark:bg-slate-950 py-24 sm:py-32 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            합리적인 요금제
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            모든 플랜에서 커뮤보드의 강력한 핵심 기능을 경험할 수 있습니다. 
            <br className="hidden sm:block" />필요한 용량에 맞게 선택하세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 md:items-center">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <CapacityTable />
      </div>
    </section>
  );
}
