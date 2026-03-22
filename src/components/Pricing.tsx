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
    href: "mailto:admin@comuboard.com",
    highlighted: false,
  },
];

function PlanCard({ plan }: { readonly plan: Plan }) {
  const padding = plan.badge ? "px-8 pb-8 pt-12" : "p-8";

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl transition-all duration-300 ${padding} ${
        plan.highlighted
          ? "z-10 border-2 border-violet-400/90 bg-linear-to-br from-white via-violet-50/90 to-indigo-50/80 shadow-xl shadow-violet-500/20 ring-4 ring-violet-500/10 dark:border-violet-400/50 dark:from-slate-900 dark:via-violet-950/55 dark:to-indigo-950/45 dark:shadow-violet-500/25 dark:ring-violet-400/15 lg:scale-[1.04] lg:shadow-2xl lg:shadow-violet-500/20"
          : "border border-slate-200/90 bg-white/90 dark:border-slate-700/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/90 dark:hover:bg-slate-800/55 shadow-sm dark:shadow-none"
      }`}
    >
      {plan.highlighted && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-violet-500/4 to-indigo-600/6 dark:from-violet-400/6 dark:to-indigo-500/8" />
      )}

      {plan.badge && (
        <div
          className={`absolute -top-3 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-bold shadow-md backdrop-blur-md ${
            plan.highlighted
              ? "border-violet-300/80 bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/35 dark:border-violet-400/40"
              : "border-brand-200 dark:border-brand-400/30 bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 shrink-0 ${
              plan.highlighted
                ? "fill-amber-300 text-amber-200"
                : "fill-brand-500 dark:fill-brand-400 text-brand-500 dark:text-brand-400"
            }`}
          />
          {plan.badge}
        </div>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div>
          <h3
            className={`text-xl font-bold ${
              plan.highlighted
                ? "bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent dark:from-violet-300 dark:to-indigo-300"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {plan.name}
          </h3>
          <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
            {plan.description}
          </p>
        </div>

        <div className="relative mt-8">
          {plan.price !== null ? (
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-extrabold tracking-tight ${
                  plan.highlighted
                    ? "bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-violet-100"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {plan.price}
              </span>
              {plan.priceUnit && (
                <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                  {plan.priceUnit}
                </span>
              )}
            </div>
          ) : (
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact
            </span>
          )}
          {plan.originalPrice && (
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              <span className="line-through">{plan.originalPrice}</span>
            </p>
          )}
        </div>

        <div
          className={`relative mt-8 rounded-xl px-4 py-3 text-sm font-medium ${
            plan.highlighted
              ? "border border-violet-200/80 bg-violet-100/70 text-violet-900 dark:border-violet-500/25 dark:bg-violet-500/15 dark:text-violet-100"
              : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
          }`}
        >
          모든 기능 동일 — 용량만 다릅니다
        </div>

        <div className="min-h-0 flex-1" aria-hidden />

        <a
          href={plan.href}
          className={`group relative mt-8 flex items-center justify-center gap-2 rounded-xl py-4 text-center text-sm font-bold transition-all ${
            plan.highlighted
              ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/35 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              : "border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          {plan.cta}
          <ChevronRight
            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${plan.highlighted ? "text-white" : "text-slate-400"}`}
          />
        </a>
      </div>
    </div>
  );
}

function CapacityTable() {
  const proCol =
    "bg-violet-50/80 dark:bg-violet-950/35 text-violet-800 dark:text-violet-200 border-x border-violet-200/70 dark:border-violet-500/20";

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
                    plan.highlighted
                      ? `${proCol} bg-violet-100/90 dark:bg-violet-950/50 text-violet-800 dark:text-violet-100`
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {capacities.map((row) => (
              <tr
                key={row.label}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <td className="py-4 pl-8 pr-4 font-medium text-slate-700 dark:text-slate-300">
                  {row.label}
                </td>
                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                  {row.free}
                </td>
                <td className={`px-4 py-4 text-center font-bold ${proCol}`}>
                  {row.pro}
                </td>
                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                  {row.business}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50/50 dark:bg-slate-900/30">
              <td className="py-5 pl-8 pr-4 font-bold text-slate-900 dark:text-slate-200">
                핵심 기능 포함 여부
              </td>
              <td className="px-4 py-5 text-center">
                <Check className="mx-auto h-5 w-5 text-brand-500" />
              </td>
              <td className={`px-4 py-5 text-center ${proCol}`}>
                <Check className="mx-auto h-5 w-5 text-violet-600 dark:text-violet-400" />
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
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-slate-200 bg-linear-to-b from-slate-50 via-violet-50/40 to-indigo-50/30 py-24 transition-colors duration-300 dark:border-slate-800/50 dark:from-slate-950 dark:via-violet-950/25 dark:to-indigo-950/20 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            합리적인 요금제
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            모든 플랜에서 커뮤보드의 강력한 핵심 기능을 경험할 수 있습니다.
            <br className="hidden sm:block" />
            필요한 용량에 맞게 선택하세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <CapacityTable />
      </div>
    </section>
  );
}
