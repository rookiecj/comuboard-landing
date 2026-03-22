import {
  Rss,
  Mail,
  AtSign,
  BrainCircuit,
  Tags,
  MessageSquare,
  Newspaper,
  Share2,
  QrCode,
} from "lucide-react";
import type { ComponentType } from "react";

interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: ComponentType<{ className?: string }>;
}

interface FeatureAxis {
  readonly label: string;
  readonly tagline: string;
  readonly color: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly features: readonly Feature[];
}

const axes: readonly FeatureAxis[] = [
  {
    label: "모으다",
    tagline: "이야기를 꺼내다",
    color: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    features: [
      {
        title: "RSS 피드 수집",
        description:
          "관심 있는 블로그, 뉴스 사이트의 RSS를 등록하면 새 글이 자동으로 커뮤니티에 유입됩니다.",
        icon: Rss,
      },
      {
        title: "소셜 멘션 모니터링",
        description:
          "X(Twitter), Reddit 등에서 키워드 멘션을 감지하여 관련 콘텐츠를 자동 수집합니다.",
        icon: AtSign,
      },
      {
        title: "Email 포워딩",
        description:
          "뉴스레터나 이메일을 커뮤니티 전용 주소로 포워딩하면 게시글로 변환됩니다.",
        icon: Mail,
      },
    ],
  },
  {
    label: "다듬다",
    tagline: "이야기가 깊어지다",
    color: "text-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      {
        title: "AI 요약",
        description:
          "긴 글을 AI가 핵심만 요약해줍니다. 빠르게 내용을 파악하고 토론에 참여하세요.",
        icon: BrainCircuit,
      },
      {
        title: "태그 & 카테고리",
        description:
          "자동 태그 추천과 카테고리 분류로 콘텐츠를 체계적으로 정리할 수 있습니다.",
        icon: Tags,
      },
      {
        title: "투표 & 댓글",
        description:
          "업보트/다운보트와 중첩 댓글 트리로 의미 있는 콘텐츠가 자연스럽게 부각됩니다.",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "나누다",
    tagline: "이야기가 퍼지다",
    color: "text-violet-600",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    features: [
      {
        title: "뉴스레터 발송",
        description:
          "커뮤니티의 주요 콘텐츠를 정기 뉴스레터로 발송하여 멤버 참여를 유지합니다.",
        icon: Newspaper,
      },
      {
        title: "OG 공유 카드",
        description:
          "게시글마다 자동 생성되는 OG 이미지로 SNS 공유 시 눈에 띄는 미리보기를 제공합니다.",
        icon: Share2,
      },
      {
        title: "QR코드 공유",
        description:
          "오프라인 행사나 인쇄물에서 QR코드로 커뮤니티와 게시글에 바로 접근할 수 있습니다.",
        icon: QrCode,
      },
    ],
  },
];

function FeatureCard({
  feature,
  iconBg,
  iconColor,
}: {
  readonly feature: Feature;
  readonly iconBg: string;
  readonly iconColor: string;
}) {
  const Icon = feature.icon;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h4 className="mt-4 text-lg font-semibold text-gray-900">
        {feature.title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {feature.description}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          커뮤니티 운영에 필요한 모든 것
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          모으다 · 다듬다 · 나누다, 세 가지 축으로 커뮤니티를 성장시킵니다.
        </p>

        <div className="mt-16 space-y-16">
          {axes.map((axis) => (
            <div key={axis.label}>
              <div className="mb-8 flex items-center gap-3">
                <span className={`text-xl font-bold ${axis.color}`}>
                  {axis.label}
                </span>
                <span className="text-sm text-gray-500">— {axis.tagline}</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {axis.features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    iconBg={axis.iconBg}
                    iconColor={axis.iconColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
