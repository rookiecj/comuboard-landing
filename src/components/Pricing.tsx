import { useState } from "react";
import { Check, Star, ChevronRight } from "lucide-react";
import { APP_ROUTES } from "../config";

type BillingCycle = "monthly" | "yearly";

interface CapacityRow {
  readonly label: string;
  readonly free: string;
  readonly starter: string;
  readonly pro: string;
  readonly business: string;
}

const capacities: readonly CapacityRow[] = [
  {
    label: "공간 만들기",
    free: "참여 전용",
    starter: "3개",
    pro: "10개",
    business: "협의",
  },
  {
    label: "게시판 수",
    free: "—",
    starter: "10개",
    pro: "50개",
    business: "협의",
  },
  {
    label: "공간당 멤버",
    free: "—",
    starter: "30명",
    pro: "500명",
    business: "협의",
  },
  {
    label: "공간 참여",
    free: "5개",
    starter: "무제한",
    pro: "무제한",
    business: "무제한",
  },
  {
    label: "글 작성·댓글·투표",
    free: "무제한",
    starter: "무제한",
    pro: "무제한",
    business: "무제한",
  },
  {
    label: "스토리지",
    free: "100 MiB",
    starter: "500 MiB",
    pro: "5 GiB",
    business: "협의",
  },
  {
    label: "AI 사용",
    free: "내 키 연결 시 무제한",
    starter: "20회/일",
    pro: "100회/일",
    business: "협의",
  },
];

interface PlanPrice {
  readonly price: string | null;
  readonly originalPrice?: string;
  readonly unit: string;
}

interface Plan {
  readonly name: string;
  readonly getPrice: (cycle: BillingCycle) => PlanPrice;
  readonly description: string;
  readonly getBadge?: (cycle: BillingCycle) => string | undefined;
  readonly cta: string;
  readonly getHref: (cycle: BillingCycle) => string;
  readonly highlighted: boolean;
}

const plans: readonly Plan[] = [
  {
    name: "Free",
    getPrice: () => ({ price: "₩0", unit: "" }),
    description: "커뮤니티에 참여하며 시작해요",
    cta: "무료로 시작하기",
    getHref: () => APP_ROUTES.signup,
    highlighted: false,
  },
  {
    name: "Starter",
    getPrice: (cycle) =>
      cycle === "yearly"
        ? { price: "₩49,000", originalPrice: "₩117,600", unit: "/년" }
        : { price: "₩4,900", originalPrice: "₩9,800", unit: "/월" },
    description: "개인·소규모 커뮤니티 운영",
    getBadge: (cycle) =>
      cycle === "yearly" ? "50% + 2개월 무료" : "50% 프로모션",
    cta: "Starter 시작하기",
    getHref: (cycle) =>
      APP_ROUTES.signupWithPlan(
        cycle === "yearly" ? "starter-yearly" : "starter",
      ),
    highlighted: false,
  },
  {
    name: "Pro",
    getPrice: (cycle) =>
      cycle === "yearly"
        ? { price: "₩149,500", originalPrice: "₩299,000", unit: "/년" }
        : { price: "₩14,950", originalPrice: "₩29,900", unit: "/월" },
    description: "성장하는 커뮤니티를 위한 최적의 선택",
    getBadge: (cycle) =>
      cycle === "yearly" ? "50% + 2개월 무료" : "50% 프로모션",
    cta: "Pro 시작하기",
    getHref: (cycle) =>
      APP_ROUTES.signupWithPlan(cycle === "yearly" ? "pro-yearly" : "pro"),
    highlighted: true,
  },
  {
    name: "Business",
    getPrice: () => ({ price: null, unit: "" }),
    description: "대규모 조직 맞춤 설계 및 도메인",
    cta: "문의하기",
    getHref: () => "mailto:admin@comuboard.com",
    highlighted: false,
  },
];

function BillingToggle({
  cycle,
  onChange,
}: {
  readonly cycle: BillingCycle;
  readonly onChange: (cycle: BillingCycle) => void;
}) {
  const base =
    "relative rounded-full px-5 py-2 text-sm font-bold transition-colors";
  const active =
    "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-sm";
  const inactive =
    "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";

  return (
    <div className="mb-12 flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={`${base} ${cycle === "monthly" ? active : inactive}`}
        >
          월간
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={`${base} inline-flex items-center gap-1.5 ${
            cycle === "yearly" ? active : inactive
          }`}
        >
          연간
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              cycle === "yearly"
                ? "bg-white/20 text-white"
                : "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
            }`}
          >
            2개월 무료
          </span>
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  cycle,
}: {
  readonly plan: Plan;
  readonly cycle: BillingCycle;
}) {
  const { price, originalPrice, unit } = plan.getPrice(cycle);
  const badge = plan.getBadge?.(cycle);
  const padding = badge ? "px-6 pb-6 pt-12" : "p-6";

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl transition-all duration-300 ${padding} ${
        plan.highlighted
          ? "z-10 border-2 border-violet-400/90 bg-linear-to-br from-white via-violet-50/90 to-indigo-50/80 shadow-xl shadow-violet-500/20 ring-4 ring-violet-500/10 dark:border-violet-400/50 dark:from-slate-900 dark:via-violet-950/55 dark:to-indigo-950/45 dark:shadow-violet-500/25 dark:ring-violet-400/15"
          : "border border-slate-200/90 bg-white/90 dark:border-slate-700/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/90 dark:hover:bg-slate-800/55 shadow-sm dark:shadow-none"
      }`}
    >
      {plan.highlighted && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-violet-500/4 to-indigo-600/6 dark:from-violet-400/6 dark:to-indigo-500/8" />
      )}

      {badge && (
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
          {badge}
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
          {price !== null ? (
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span
                className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
                  plan.highlighted
                    ? "bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-violet-100"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {price}
              </span>
              {unit && (
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {unit}
                </span>
              )}
            </div>
          ) : (
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact
            </span>
          )}
          {originalPrice && (
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              <span className="line-through">{originalPrice}</span>
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
          핵심 기능은 그대로, 용량이 달라요
        </div>

        <div className="min-h-0 flex-1" aria-hidden />

        <a
          href={plan.getHref(cycle)}
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
      <h3 className="mb-3 text-center text-xl font-bold text-slate-900 dark:text-white sm:mb-8">
        요금제별 상세 용량 비교
      </h3>
      {/* 모바일: 가로 스크롤 안내 (표가 뷰포트보다 넓어 Starter/Pro/Business 열이 화면 밖) */}
      <p className="mb-5 text-center text-xs text-slate-400 dark:text-slate-500 sm:hidden">
        표를 좌우로 넘겨 모든 플랜을 확인하세요
      </p>
      <div className="relative">
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm dark:shadow-none">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <th className="py-5 pl-8 pr-4 text-left font-semibold text-slate-500 dark:text-slate-400">
                  지원 항목
                </th>
                <th className="px-4 py-5 text-center font-bold text-lg text-slate-900 dark:text-white">
                  Free
                </th>
                <th className="px-4 py-5 text-center font-bold text-lg text-slate-900 dark:text-white">
                  Starter
                </th>
                <th
                  className={`px-4 py-5 text-center font-bold text-lg ${proCol} bg-violet-100/90 dark:bg-violet-950/50 text-violet-800 dark:text-violet-100`}
                >
                  Pro
                </th>
                <th className="px-4 py-5 text-center font-bold text-lg text-slate-900 dark:text-white">
                  Business
                </th>
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
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400">
                    {row.starter}
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
        {/* 모바일: 우측 그라데이션 페이드 — 가로 스크롤 여지 표시 */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-3xl bg-gradient-to-l from-white to-transparent dark:from-slate-900 sm:hidden"
          aria-hidden
        />
      </div>
    </div>
  );
}

export function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

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
            모든 플랜에서 커뮤보드의 강력한 핵심 기능을 경험할 수 있어요.{" "}
            <br className="hidden sm:block" />
            필요한 용량에 맞게 골라보세요.
          </p>
        </div>

        <BillingToggle cycle={cycle} onChange={setCycle} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} cycle={cycle} />
          ))}
        </div>

        <CapacityTable />
      </div>
    </section>
  );
}
