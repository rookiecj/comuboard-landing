// STORY-258-01 — Landing BYOAI 도움말 페이지.
//
// SPRINT-252 BUG-252-02 follow-up 회수 (1st): ai_chat secondary action
// "도움말 보기" 가 가리킬 정적 가이드 페이지. SPRINT-252 시점에는 페이지 자체
// 가 미alive 였기 때문에 secondary action 을 임시 제거했었고, SPRINT-258 이
// 본 페이지를 신규 alive 시키면서 secondary action 을 복원한다.
//
// 보안 가드 (Sprint §6):
//   A1 PII 0  — 정적 콘텐츠만 alive (사용자 입력 / 식별자 / 이메일 합성 0).
//   A2 Tabnabbing 가드 — 모든 외부 `<a>` 에 target=_blank rel=noopener noreferrer.
//   A3 외부 URL whitelist — provider 공식 docs URL 만 alive.
//   A6 XSS — React JSX escape 알리바이 (dangerouslySetInnerHTML 0).

import { Footer } from "../components/Footer";
import { APP_ROUTES, appUrl } from "../config";

interface ProviderInfo {
  readonly name: string;
  readonly description: string;
  readonly docsUrl: string | null;
  readonly recommendedModels: readonly string[];
  readonly notes: string;
}

// A3: provider 공식 docs URL whitelist. URL 변경 / 404 위험을 분기 검토
// (SPRINT-258 retrospective 후보). Custom 만 외부 링크 0 — 자체 호스팅
// 안내는 ComuBoard 내부 설정 페이지 가이드만 alive.
const PROVIDERS: readonly ProviderInfo[] = [
  {
    name: "Anthropic Claude",
    description:
      "한국어 품질이 가장 안정적이에요. 도구 사용 (tool use) 정확도도 높아서 ComuBoard 의 AI 어시스턴트와 잘 어울려요.",
    docsUrl: "https://docs.anthropic.com/en/api/getting-started",
    recommendedModels: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
    ],
    notes: "추천 — 한국어 + 도구 사용 안정성 균형이 좋아요.",
  },
  {
    name: "OpenAI",
    description:
      "가장 범용적인 모델이에요. gpt-4o-mini 는 응답 속도가 빠르고 비용도 낮아서 일상적인 사용에 적합해요.",
    docsUrl: "https://platform.openai.com/docs/quickstart",
    recommendedModels: ["gpt-4o", "gpt-4o-mini"],
    notes:
      "범용성 + 비용 효율 균형. 비용 민감하다면 gpt-4o-mini 부터 권장해요.",
  },
  {
    name: "Google Gemini",
    description:
      "긴 컨텍스트 (최대 1M token) 를 지원해서 긴 글 전체를 한 번에 분석할 수 있어요.",
    docsUrl: "https://ai.google.dev/gemini-api/docs/api-key",
    recommendedModels: ["gemini-2.0-flash-exp", "gemini-1.5-pro"],
    notes: "긴 컨텍스트가 필요한 작업 (긴 글 요약 등) 에 강해요.",
  },
  {
    name: "OpenRouter",
    description:
      "하나의 API key 로 여러 제공자의 모델을 사용할 수 있어요. 모델 비교 / A·B 테스트에 편리해요.",
    docsUrl: "https://openrouter.ai/docs/quickstart",
    recommendedModels: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
    notes: "여러 모델을 비교하고 싶을 때 추천해요.",
  },
  {
    name: "Custom (자체 호스팅 / LiteLLM)",
    description:
      "자체 호스팅 LLM 또는 LiteLLM 프록시를 사용할 수 있어요. ComuBoard 의 AI 설정에서 base URL 을 직접 지정하면 돼요.",
    docsUrl: null,
    recommendedModels: ["llama-3-70b", "mixtral-8x7b"],
    notes:
      "base URL 형식: https://your-litellm.example.com/v1 — 끝에 /v1 알리바이가 필요해요.",
  },
] as const;

interface ProviderSectionProps {
  readonly provider: ProviderInfo;
}

function ProviderSection({ provider }: ProviderSectionProps) {
  return (
    <section className="my-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {provider.name}
      </h2>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {provider.description}
      </p>

      {provider.docsUrl && (
        <p className="mt-4">
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            API 키 발급 안내 보기 →
          </a>
        </p>
      )}

      <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
        추천 모델
      </h3>
      <ul className="mt-2 space-y-1">
        {provider.recommendedModels.map((model) => (
          <li
            key={model}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            <code className="rounded bg-slate-100 px-2 py-0.5 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {model}
            </code>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-400">
        {provider.notes}
      </p>
    </section>
  );
}

export function HelpAIByOAI() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-500 dark:text-brand-400">
            도움말 · BYOAI 가이드
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            내 AI 키로 ComuBoard 사용하기
          </h1>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
            5가지 AI 제공자 중 원하는 것을 선택해서 API 키를 발급받고, ComuBoard
            에 등록하면 <strong>무제한</strong>으로 AI 어시스턴트를 사용할 수
            있어요. 발급 절차는 각 제공자 공식 문서로 안내해 드릴게요.
          </p>
        </header>

        <section className="mb-12 rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            토큰 사용량을 절약하는 팁
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <li>
              가벼운 작업은 mini / haiku / flash 같은 작은 모델로 시작해 보세요.
            </li>
            <li>
              긴 글을 분석할 때만 컨텍스트가 큰 모델 (Gemini 1.5 Pro 등) 을
              선택해 주세요.
            </li>
            <li>
              ComuBoard 의 AI 설정에서 모델을 자유롭게 바꿀 수 있어요 — 상황에
              맞게 골라 사용해 주세요.
            </li>
          </ul>
        </section>

        {PROVIDERS.map((provider) => (
          <ProviderSection key={provider.name} provider={provider} />
        ))}

        <section className="my-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            ComuBoard 에 등록하는 방법
          </h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              ComuBoard 에{" "}
              <a
                href={APP_ROUTES.login}
                className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
              >
                로그인
              </a>{" "}
              해 주세요.
            </li>
            <li>
              <a
                href={appUrl("/settings/ai")}
                className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
              >
                설정 → AI
              </a>{" "}
              페이지로 이동해 주세요.
            </li>
            <li>제공자 + API 키 + 추천 모델을 입력하고 저장해 주세요.</li>
            <li>
              이제 AI 어시스턴트를 호출하면 본인 키가 사용돼요 (월 한도 0,
              무제한).
            </li>
          </ol>
        </section>

        <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          궁금한 점이 있으면{" "}
          <a
            href="mailto:admin@comuboard.com"
            className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            admin@comuboard.com
          </a>{" "}
          으로 알려 주세요!
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default HelpAIByOAI;
